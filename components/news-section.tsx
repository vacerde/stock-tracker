"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"

const newsData = [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Rate Cuts in 2024",
    source: "Reuters",
    time: "2 hours ago",
    category: "Markets",
    excerpt:
      "The Federal Reserve indicated it may consider lowering interest rates if inflation continues to decline...",
  },
  {
    id: 2,
    title: "Bitcoin ETF Sees Record Inflows",
    source: "CoinDesk",
    time: "4 hours ago",
    category: "Crypto",
    excerpt: "Bitcoin exchange-traded funds recorded their highest single-day inflows since launch...",
  },
  {
    id: 3,
    title: "Tech Stocks Rally on AI Optimism",
    source: "Bloomberg",
    time: "6 hours ago",
    category: "Technology",
    excerpt: "Major technology companies saw significant gains as investors remain bullish on AI developments...",
  },
  {
    id: 4,
    title: "Oil Prices Surge on Supply Concerns",
    source: "CNBC",
    time: "8 hours ago",
    category: "Commodities",
    excerpt: "Crude oil prices jumped 3% amid concerns about potential supply disruptions in the Middle East...",
  },
]

export function NewsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest News</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {newsData.map((article) => (
          <div
            key={article.id}
            className="space-y-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium leading-tight line-clamp-2">{article.title}</h4>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{article.source}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {article.time}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
