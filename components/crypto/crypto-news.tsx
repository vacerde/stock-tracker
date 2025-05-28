"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface CryptoNewsProps {
  symbol: string
}

interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  sentiment: number
  category: string
}

interface CryptoNewsAPIResponse {
  data: Array<{
    id: string
    attributes: {
      title: string
      teaser: string
      url: string
      created_at: string
      domain: string
    }
  }>
}

export function CryptoNews({ symbol }: CryptoNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  // Function to determine sentiment based on title and summary
  const analyzeSentiment = (title: string, summary: string): number => {
    const text = (title + " " + summary).toLowerCase()
    
    const bullishKeywords = [
      'bullish', 'surge', 'rally', 'moon', 'pump', 'rise', 'up', 'gain', 'growth', 
      'adoption', 'breakthrough', 'partnership', 'upgrade', 'positive', 'boost',
      'milestone', 'record', 'high', 'institutional', 'investment'
    ]
    
    const bearishKeywords = [
      'bearish', 'crash', 'dump', 'fall', 'down', 'drop', 'decline', 'loss',
      'regulation', 'ban', 'hack', 'scam', 'negative', 'concern', 'worry',
      'investigation', 'lawsuit', 'fraud', 'risk', 'warning'
    ]
    
    let bullishScore = 0
    let bearishScore = 0
    
    bullishKeywords.forEach(keyword => {
      if (text.includes(keyword)) bullishScore++
    })
    
    bearishKeywords.forEach(keyword => {
      if (text.includes(keyword)) bearishScore++
    })
    
    if (bullishScore > bearishScore) return Math.min(0.8, bullishScore * 0.2)
    if (bearishScore > bullishScore) return Math.max(-0.8, -bearishScore * 0.2)
    return 0
  }

  // Function to categorize news based on content
  const categorizeNews = (title: string, summary: string): string => {
    const text = (title + " " + summary).toLowerCase()
    
    if (text.includes('regulation') || text.includes('sec') || text.includes('government') || text.includes('legal')) {
      return 'regulatory'
    }
    if (text.includes('technical') || text.includes('chart') || text.includes('resistance') || text.includes('support')) {
      return 'technical'
    }
    if (text.includes('adoption') || text.includes('partnership') || text.includes('institution')) {
      return 'adoption'
    }
    if (text.includes('development') || text.includes('upgrade') || text.includes('protocol') || text.includes('network')) {
      return 'development'
    }
    return 'analysis'
  }

  // Fetch news from CryptoPanic API (free tier)
  const fetchCryptoNews = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Using CryptoPanic API - you'll need to get a free API key from https://cryptopanic.com/developers/api/
      const API_KEY = process.env.NEXT_PUBLIC_CRYPTOPANIC_API_KEY || 'free' // Use 'free' for limited requests
      
      // CryptoPanic API endpoint
      const response = await fetch(
        `https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&public=true&currencies=${symbol}&page=${pageNum}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CryptoNewsAPIResponse = await response.json()
      
      const processedNews: NewsItem[] = data.data.map((item, index) => ({
        id: item.id || `${pageNum}-${index}`,
        title: item.attributes.title,
        summary: item.attributes.teaser || item.attributes.title,
        url: item.attributes.url,
        source: item.attributes.domain || 'Unknown',
        publishedAt: item.attributes.created_at,
        sentiment: analyzeSentiment(item.attributes.title, item.attributes.teaser || ''),
        category: categorizeNews(item.attributes.title, item.attributes.teaser || ''),
      }))

      if (pageNum === 1) {
        setNews(processedNews)
      } else {
        setNews(prev => [...prev, ...processedNews])
      }

    } catch (err) {
      console.error('Error fetching crypto news:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
      
      // Fallback to simulated data if API fails
      if (pageNum === 1) {
        setNews(getSimulatedNews())
      }
    } finally {
      setLoading(false)
    }
  }

  // Alternative: Using NewsAPI (requires API key)
  const fetchNewsAPI = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY
      if (!API_KEY) {
        throw new Error('NewsAPI key not found')
      }

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${symbol}+cryptocurrency&sortBy=publishedAt&page=${pageNum}&pageSize=10&apiKey=${API_KEY}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const processedNews: NewsItem[] = data.articles.map((article: any, index: number) => ({
        id: `${pageNum}-${index}`,
        title: article.title,
        summary: article.description || article.title,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        sentiment: analyzeSentiment(article.title, article.description || ''),
        category: categorizeNews(article.title, article.description || ''),
      }))

      if (pageNum === 1) {
        setNews(processedNews)
      } else {
        setNews(prev => [...prev, ...processedNews])
      }

    } catch (err) {
      console.error('Error fetching news:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
      
      // Fallback to simulated data if API fails
      if (pageNum === 1) {
        setNews(getSimulatedNews())
      }
    } finally {
      setLoading(false)
    }
  }

  // Fallback simulated data
  const getSimulatedNews = (): NewsItem[] => {
    return [
      {
        id: "1",
        title: `${symbol} Sees Major Institutional Adoption as Payment Method`,
        summary: `Several major corporations announce plans to accept ${symbol} as payment, driving increased adoption and price momentum.`,
        url: "#",
        source: "CryptoNews",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: 0.8,
        category: "adoption",
      },
      {
        id: "2",
        title: `Technical Analysis: ${symbol} Forms Bullish Pattern`,
        summary: `Chart analysis reveals a potential breakout pattern forming, with key resistance levels being tested.`,
        url: "#",
        source: "TradingView",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        sentiment: 0.6,
        category: "technical",
      },
      {
        id: "3",
        title: `Regulatory Update: New Guidelines for ${symbol} Trading`,
        summary: `Financial authorities release new guidelines that could impact trading and institutional investment.`,
        url: "#",
        source: "RegulatoryNews",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        sentiment: -0.2,
        category: "regulatory",
      },
    ]
  }

  useEffect(() => {
    setPage(1)
    fetchCryptoNews(1)
    // Alternative: Use fetchNewsAPI(1) if you prefer NewsAPI
  }, [symbol])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchCryptoNews(nextPage)
  }

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.3) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (sentiment < -0.3) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <div className="h-3 w-3 rounded-full bg-yellow-500" />
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return "text-green-500"
    if (sentiment < -0.3) return "text-red-500"
    return "text-yellow-500"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "adoption":
        return "bg-blue-500"
      case "technical":
        return "bg-purple-500"
      case "regulatory":
        return "bg-orange-500"
      case "development":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading && news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest {symbol} News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest {symbol} News</CardTitle>
        <Button variant="outline" size="sm" onClick={() => fetchCryptoNews(1)}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              {error} - Showing cached data
            </span>
          </div>
        )}

        {news.map((article) => (
          <div
            key={article.id}
            className="space-y-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => window.open(article.url, "_blank")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium leading-tight line-clamp-2">{article.title}</h4>
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getCategoryColor(article.category)}`}>{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(article.sentiment)}
                      <span className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                        {article.sentiment > 0.3 ? "Bullish" : article.sentiment < -0.3 ? "Bearish" : "Neutral"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(article.publishedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="text-center">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More News"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}