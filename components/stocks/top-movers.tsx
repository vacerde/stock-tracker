"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const gainers = [
  { symbol: "NVDA", change: "+8.5%", price: "$875.30" },
  { symbol: "TSLA", change: "+5.4%", price: "$248.50" },
  { symbol: "AMD", change: "+4.2%", price: "$142.80" },
  { symbol: "AAPL", change: "+1.2%", price: "$193.42" },
]

const losers = [
  { symbol: "META", change: "-3.1%", price: "$485.20" },
  { symbol: "NFLX", change: "-2.8%", price: "$612.45" },
  { symbol: "GOOGL", change: "-1.9%", price: "$142.65" },
  { symbol: "AMZN", change: "-1.5%", price: "$151.94" },
]

export function TopMovers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers">Losers</TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="space-y-3">
            {gainers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  <div className="text-sm text-muted-foreground">{stock.price}</div>
                </div>
                <Badge variant="default" className="text-xs">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {stock.change}
                </Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="losers" className="space-y-3">
            {losers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  <div className="text-sm text-muted-foreground">{stock.price}</div>
                </div>
                <Badge variant="destructive" className="text-xs">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
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
