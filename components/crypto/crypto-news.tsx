"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, TrendingUp, TrendingDown } from "lucide-react"

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

export function CryptoNews({ symbol }: CryptoNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  // Simulated news data - replace with real API call
  useEffect(() => {
    const simulatedNews: NewsItem[] = [
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
      {
        id: "4",
        title: `${symbol} Network Upgrade Scheduled for Next Month`,
        summary: `Developers announce major network improvements that could enhance scalability and reduce transaction fees.`,
        url: "#",
        source: "DevUpdate",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        sentiment: 0.7,
        category: "development",
      },
      {
        id: "5",
        title: `Market Analysis: ${symbol} Correlation with Traditional Assets`,
        summary: `Recent data shows changing correlation patterns between cryptocurrency and traditional financial markets.`,
        url: "#",
        source: "MarketWatch",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        sentiment: 0.1,
        category: "analysis",
      },
    ]

    setTimeout(() => {
      setNews(simulatedNews)
      setLoading(false)
    }, 1000)
  }, [symbol])

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
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
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Button variant="outline" className="w-full">
              Load More News
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
