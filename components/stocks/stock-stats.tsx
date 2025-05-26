"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StockData } from "@/lib/api"

interface StockStatsProps {
  stock: StockData
}

export function StockStats({ stock }: StockStatsProps) {
  console.log(stock)
  const stats = [
    //{ label: "Market Cap", value: stock.marketCap ? `$${(stock.marketCap / 1e9).toFixed(2)}B` : "N/A" },
    { label: "Volume", value: `${(stock.volume / 1e6).toFixed(2)}M` },
    { label: "52W High", value: `$${stock.high52Week.toFixed(2)}` },
    { label: "52W Low", value: `$${stock.low52Week.toFixed(2)}` },
    //{ label: "P/E Ratio", value: stock.pe ? stock.pe.toFixed(2) : "N/A" },
    //{ label: "EPS", value: stock.eps ? `$${stock.eps.toFixed(2)}` : "N/A" },
    //{ label: "Dividend", value: stock.dividend ? `$${stock.dividend.toFixed(2)}` : "N/A" },
    //{ label: "Beta", value: stock.beta ? stock.beta.toFixed(2) : "N/A" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
