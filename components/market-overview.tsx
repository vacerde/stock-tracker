"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const marketData = {
  stocks: [
    { name: "S&P 500", value: "4,783.45", change: "+1.2%", positive: true },
    { name: "NASDAQ", value: "15,095.14", change: "+0.8%", positive: true },
    { name: "DOW", value: "37,545.33", change: "-0.3%", positive: false },
  ],
  crypto: [
    { name: "Total Market Cap", value: "$1.68T", change: "+2.1%", positive: true },
    { name: "BTC Dominance", value: "50.3%", change: "-0.5%", positive: false },
    { name: "Fear & Greed", value: "72", change: "Greed", positive: true },
  ],
}

const topMovers = [
  { symbol: "NVDA", change: "+8.5%", positive: true },
  { symbol: "TSLA", change: "+5.4%", positive: true },
  { symbol: "AAPL", change: "+1.2%", positive: true },
  { symbol: "META", change: "-2.1%", positive: false },
  { symbol: "GOOGL", change: "-1.8%", positive: false },
]

export function MarketOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="movers">Top Movers</TabsTrigger>
          </TabsList>

          <TabsContent value="indices" className="space-y-3">
            {marketData.stocks.map((index) => (
              <div key={index.name} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">{index.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{index.value}</span>
                  <Badge variant={index.positive ? "default" : "destructive"} className="text-xs">
                    {index.positive ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {index.change}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="crypto" className="space-y-3">
            {marketData.crypto.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">{metric.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{metric.value}</span>
                  <Badge variant={metric.positive ? "default" : "secondary"} className="text-xs">
                    {metric.change}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="movers" className="space-y-3">
            {topMovers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">{stock.symbol}</span>
                <Badge variant={stock.positive ? "default" : "destructive"} className="text-xs">
                  {stock.positive ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {stock.change}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
