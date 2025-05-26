"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const indices = [
  { name: "S&P 500", symbol: "SPX", value: "4,783.45", change: "+1.2%", positive: true },
  { name: "NASDAQ", symbol: "IXIC", value: "15,095.14", change: "+0.8%", positive: true },
  { name: "DOW", symbol: "DJI", value: "37,545.33", change: "-0.3%", positive: false },
  { name: "Russell 2000", symbol: "RUT", value: "2,045.23", change: "+0.5%", positive: true },
]

export function MarketIndices() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {indices.map((index) => (
        <Card key={index.symbol}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{index.value}</div>
                <div className="text-xs text-muted-foreground">{index.symbol}</div>
              </div>
              <Badge variant={index.positive ? "default" : "destructive"} className="text-xs">
                {index.positive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {index.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
