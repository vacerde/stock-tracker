// Finnhub API integration for real-time stock data
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "demo"
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

export interface StockQuote {
  symbol: string
  current: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
}

export interface StockProfile {
  symbol: string
  name: string
  country: string
  currency: string
  exchange: string
  ipo: string
  marketCapitalization: number
  shareOutstanding: number
  logo: string
  phone: string
  weburl: string
  finnhubIndustry: string
}

export interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockNews {
  id: string
  headline: string
  summary: string
  url: string
  source: string
  datetime: number
  category: string
  sentiment: number
}

export interface TechnicalIndicator {
  name: string
  value: number
  signal: "BUY" | "SELL" | "NEUTRAL"
  description: string
}

export interface StockMetrics {
  symbol: string
  pe: number
  eps: number
  beta: number
  week52High: number
  week52Low: number
  marketCap: number
  dividendYield: number
  rsi: number
  sma20: number
  sma50: number
  sma200: number
}

// Get real-time stock quote
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return {
      symbol,
      current: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    }
  } catch (error) {
    console.error("Error fetching stock quote:", error)
    throw error
  }
}

// Get company profile
export async function getStockProfile(symbol: string): Promise<StockProfile> {
  try {
    const response = await fetch(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return {
      symbol,
      name: data.name,
      country: data.country,
      currency: data.currency,
      exchange: data.exchange,
      ipo: data.ipo,
      marketCapitalization: data.marketCapitalization,
      shareOutstanding: data.shareOutstanding,
      logo: data.logo,
      phone: data.phone,
      weburl: data.weburl,
      finnhubIndustry: data.finnhubIndustry,
    }
  } catch (error) {
    console.error("Error fetching stock profile:", error)
    throw error
  }
}

// Get historical candle data
export async function getStockCandles(
  symbol: string,
  resolution = "D",
  from?: number,
  to?: number,
): Promise<CandleData[]> {
  try {
    const fromTime = from || Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60 // 1 year ago
    const toTime = to || Math.floor(Date.now() / 1000)

    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${fromTime}&to=${toTime}&token=${FINNHUB_API_KEY}`,
    )
    const data = await response.json()

    if (data.s !== "ok") {
      throw new Error("No data available")
    }

    return data.t.map((timestamp: number, index: number) => ({
      timestamp: timestamp * 1000,
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      close: data.c[index],
      volume: data.v[index],
    }))
  } catch (error) {
    console.error("Error fetching stock candles:", error)
    throw error
  }
}

// Get stock news
export async function getStockNews(symbol: string): Promise<StockNews[]> {
  try {
    const from = new Date()
    from.setDate(from.getDate() - 7) // Last 7 days
    const to = new Date()

    const response = await fetch(
      `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from.toISOString().split("T")[0]}&to=${to.toISOString().split("T")[0]}&token=${FINNHUB_API_KEY}`,
    )
    const data = await response.json()

    return data.slice(0, 10).map((item: any, index: number) => ({
      id: `${symbol}-${index}`,
      headline: item.headline,
      summary: item.summary,
      url: item.url,
      source: item.source,
      datetime: item.datetime,
      category: item.category,
      sentiment: item.sentiment || 0,
    }))
  } catch (error) {
    console.error("Error fetching stock news:", error)
    return []
  }
}

// Search stocks
export async function searchStocks(query: string): Promise<{ symbol: string; description: string; type: string }[]> {
  try {
    const response = await fetch(`${FINNHUB_BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`)
    const data = await response.json()

    return (
      data.result?.slice(0, 10).map((item: any) => ({
        symbol: item.symbol,
        description: item.description,
        type: item.type,
      })) || []
    )
  } catch (error) {
    console.error("Error searching stocks:", error)
    return []
  }
}

// Get basic financial metrics
export async function getStockMetrics(symbol: string): Promise<StockMetrics> {
  try {
    const [quote, metrics] = await Promise.all([
      getStockQuote(symbol),
      fetch(`${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`).then((res) =>
        res.json(),
      ),
    ])

    const data = metrics.metric

    return {
      symbol,
      pe: data.peBasicExclExtraTTM || 0,
      eps: data.epsBasicExclExtraAnnual || 0,
      beta: data.beta || 0,
      week52High: data["52WeekHigh"] || 0,
      week52Low: data["52WeekLow"] || 0,
      marketCap: data.marketCapitalization || 0,
      dividendYield: data.dividendYieldIndicatedAnnual || 0,
      rsi: 0, // Would need separate technical analysis API
      sma20: 0,
      sma50: 0,
      sma200: 0,
    }
  } catch (error) {
    console.error("Error fetching stock metrics:", error)
    throw error
  }
}

// Get market status
export async function getMarketStatus(): Promise<{ isOpen: boolean; session: string }> {
  try {
    const response = await fetch(`${FINNHUB_BASE_URL}/stock/market-status?exchange=US&token=${FINNHUB_API_KEY}`)
    const data = await response.json()

    return {
      isOpen: data.isOpen,
      session: data.session,
    }
  } catch (error) {
    console.error("Error fetching market status:", error)
    return { isOpen: false, session: "closed" }
  }
}
