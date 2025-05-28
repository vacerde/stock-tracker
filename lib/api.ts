// API configuration and utilities for real market data
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "demo"
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "demo"
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  high52Week: number
  low52Week: number
  pe: number
  eps: number
  dividend: number
  beta: number
  // Additional Finnhub data
  openPrice?: number
  previousClose?: number
  ipo?: string
  logo?: string
  weburl?: string
  country?: string
  currency?: string
  exchange?: string
  industry?: string
  sector?: string
}

export interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  circulatingSupply: number
  totalSupply: number
}

export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
  sentiment?: "positive" | "negative" | "neutral"
  // Additional Finnhub news data
  image?: string
  summary?: string
  related?: string
}

export interface ChartData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Helper function to make Finnhub API calls
async function finnhubRequest(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`)
  url.searchParams.append('token', FINNHUB_API_KEY)
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status}`)
  }
  
  return response.json()
}

// Stock API functions
export async function getStockData(symbol: string): Promise<StockData> {
  try {
    // Get real-time quote (free)
    const quote = await finnhubRequest('/quote', { symbol })
    
    // Get company profile for additional data (free)
    const profile = await finnhubRequest('/stock/profile2', { symbol })

    if (quote.c === 0) {
      throw new Error("Stock not found or market closed")
    }

    // Use available data from free endpoints only
    return {
      symbol: symbol.toUpperCase(),
      name: profile.name || symbol,
      price: quote.c, // current price
      change: quote.d, // change
      changePercent: quote.dp, // change percent
      volume: 0, // Not available in free quote endpoint
      marketCap: profile.marketCapitalization || 0,
      high52Week: quote.h, // Using day high as approximation
      low52Week: quote.l, // Using day low as approximation
      pe: 0, // Not available in free tier
      eps: 0, // Not available in free tier
      dividend: 0, // Not available in free tier
      beta: 0, // Not available in free tier
      // Additional data from Finnhub free tier
      openPrice: quote.o,
      previousClose: quote.pc,
      ipo: profile.ipo,
      logo: profile.logo,
      weburl: profile.weburl,
      country: profile.country,
      currency: profile.currency,
      exchange: profile.exchange,
      industry: profile.finnhubIndustry,
      sector: profile.gind,
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw error
  }
}

export async function getStockChart(symbol: string, interval = "daily"): Promise<ChartData[]> {
  try {
    // Fallback to Yahoo Finance API for historical data (free alternative)
    // or generate mock data based on current quote
    const quote = await finnhubRequest('/quote', { symbol })
    
    if (quote.c === 0) {
      throw new Error("No chart data available - stock not found")
    }

    // Generate simulated historical data based on current price
    // This is a workaround since Finnhub's candle endpoint is premium
    const currentPrice = quote.c
    const days = interval === "daily" ? 30 : interval.includes("min") ? 1 : 7
    const dataPoints = interval === "daily" ? 30 : interval.includes("min") ? 96 : 7 // 15min intervals for intraday
    
    const chartData: ChartData[] = []
    const now = Date.now()
    const timeStep = interval === "daily" ? 24 * 60 * 60 * 1000 : 
                    interval.includes("min") ? parseInt(interval) * 60 * 1000 :
                    24 * 60 * 60 * 1000

    // Create historical data points with some realistic variation
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = now - (i * timeStep)
      const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
      const basePrice = currentPrice * (1 + variation * (i / dataPoints))
      const volatility = 0.02 // 2% daily volatility
      
      const open = basePrice * (1 + (Math.random() - 0.5) * volatility)
      const close = i === 0 ? currentPrice : basePrice * (1 + (Math.random() - 0.5) * volatility)
      const high = Math.max(open, close) * (1 + Math.random() * volatility)
      const low = Math.min(open, close) * (1 - Math.random() * volatility)
      const volume = Math.floor(Math.random() * 10000000) + 1000000 // Random volume

      chartData.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      })
    }

    return chartData
  } catch (error) {
    console.error("Error fetching stock chart:", error)
    
    // If even the quote fails, return empty array
    return []
  }
}

// Crypto API functions (unchanged - still using CoinGecko)
export async function getCryptoData(id: string): Promise<CryptoData> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    )
    const data = await response.json()

    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_24h,
      changePercent24h: data.market_data.price_change_percentage_24h,
      volume24h: data.market_data.total_volume.usd,
      marketCap: data.market_data.market_cap.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
    }
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    throw error
  }
}

export async function getCryptoChart(id: string, days = 30): Promise<ChartData[]> {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/${id}/ohlc?vs_currency=usd&days=${days}`)
    const data = await response.json()

    return data.map((item: number[]) => ({
      timestamp: item[0],
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: 0, // OHLC endpoint doesn't include volume
    }))
  } catch (error) {
    console.error("Error fetching crypto chart:", error)
    throw error
  }
}

export async function getTopStocks(): Promise<StockData[]> {
  try {
    // Get major US indices components or popular stocks list
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX", "ORCL", "CRM"]
    
    // Fetch all stocks concurrently but handle failures gracefully
    const promises = symbols.map(async (symbol) => {
      try {
        return await getStockData(symbol)
      } catch (error) {
        console.warn(`Failed to fetch data for ${symbol}:`, error)
        return null
      }
    })
    
    const results = await Promise.all(promises)
    return results.filter(Boolean) as StockData[]
  } catch (error) {
    console.error("Error fetching top stocks:", error)
    return []
  }
}

export async function getTopCryptos(): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`,
    )
    const data = await response.json()

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_24h,
      changePercent24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      circulatingSupply: coin.circulating_supply,
      totalSupply: coin.total_supply,
    }))
  } catch (error) {
    console.error("Error fetching top cryptos:", error)
    throw error
  }
}

export async function getMarketNews(category = "general"): Promise<NewsItem[]> {
  try {
    // Use Finnhub's market news endpoint
    const data = await finnhubRequest('/news', { category })

    return data.slice(0, 20).map((article: any, index: number) => ({
      id: article.id?.toString() || `${index}`,
      title: article.headline,
      description: article.summary,
      url: article.url,
      source: article.source,
      publishedAt: new Date(article.datetime * 1000).toISOString(),
      category: article.category || "general",
      image: article.image,
      summary: article.summary,
      related: article.related,
    }))
  } catch (error) {
    console.warn("Finnhub news failed, falling back to News API:", error)
    
    // Fallback to original News API
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${NEWS_API_KEY}`,
      )
      const data = await response.json()

      return (
        data.articles?.map((article: any, index: number) => ({
          id: `${index}`,
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          category: "business",
        })) || []
      )
    } catch (fallbackError) {
      console.error("Error fetching news from both sources:", fallbackError)
      return []
    }
  }
}

export async function searchAssets(query: string): Promise<{ stocks: StockData[]; cryptos: CryptoData[] }> {
  try {
    // Search stocks using Finnhub symbol lookup
    const stockData = await finnhubRequest('/search', { q: query })

    // Search cryptos using CoinGecko
    const cryptoResponse = await fetch(`${COINGECKO_API_URL}/search?query=${query}`)
    const cryptoData = await cryptoResponse.json()

    const stocks = stockData.result?.slice(0, 10).map((match: any) => ({
      symbol: match.symbol,
      name: match.description,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0,
      high52Week: 0,
      low52Week: 0,
      pe: 0,
      eps: 0,
      dividend: 0,
      beta: 0,
      exchange: match.displaySymbol,
    })) || []

    const cryptos = cryptoData.coins?.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: 0,
      change24h: 0,
      changePercent24h: 0,
      volume24h: 0,
      marketCap: 0,
      high24h: 0,
      low24h: 0,
      circulatingSupply: 0,
      totalSupply: 0,
    })) || []

    return { stocks, cryptos }
  } catch (error) {
    console.error("Error searching assets:", error)
    return { stocks: [], cryptos: [] }
  }
}

// Additional Finnhub-specific functions you can use (free tier only)

export async function getCompanyNews(symbol: string, from?: string, to?: string) {
  try {
    const params: Record<string, string> = { symbol }
    if (from) params.from = from
    if (to) params.to = to
    
    return await finnhubRequest('/company-news', params)
  } catch (error) {
    console.error("Error fetching company news:", error)
    return []
  }
}

export async function getPeers(symbol: string) {
  try {
    return await finnhubRequest('/stock/peers', { symbol })
  } catch (error) {
    console.error("Error fetching peers:", error)
    return []
  }
}

// Alternative chart function using Yahoo Finance (free)
export async function getStockChartFromYahoo(symbol: string, interval = "1d", range = "1mo"): Promise<ChartData[]> {
  try {
    // Yahoo Finance API (unofficial but free)
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`
    )
    const data = await response.json()
    
    if (!data.chart?.result?.[0]) {
      throw new Error("No chart data available")
    }

    const result = data.chart.result[0]
    const timestamps = result.timestamp
    const quotes = result.indicators.quote[0]

    return timestamps.map((timestamp: number, index: number) => ({
      timestamp: timestamp * 1000,
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0,
    })).filter((item: ChartData) => item.close > 0) // Filter out invalid data points
  } catch (error) {
    console.error("Error fetching Yahoo Finance chart:", error)
    return []
  }
}