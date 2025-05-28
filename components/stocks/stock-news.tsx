"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock } from "lucide-react"
import { getMarketNews, type NewsItem } from "@/lib/api"

interface StockNewsProps {
  symbol: string
}

export function StockNews({ symbol }: StockNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getMarketNews(symbol)
        setNews(data.slice(0, 5))
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [symbol])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((article) => (
          <div
            key={article.id}
            className="space-y-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => window.open(article.url, "_blank")}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium leading-tight line-clamp-2">{article.title}</h4>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{article.source}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
