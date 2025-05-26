"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, ArrowDownIcon, Flame, TrendingUp, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const trendingCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", change: "+8.5%", rank: 1 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", change: "+5.4%", rank: 2 },
  { id: "solana", name: "Solana", symbol: "SOL", change: "+12.2%", rank: 3 },
  { id: "cardano", name: "Cardano", symbol: "ADA", change: "+7.8%", rank: 4 },
]

const topGainers = [
  { id: "pepe", name: "Pepe", symbol: "PEPE", change: "+45.2%", price: "$0.000012" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB", change: "+23.1%", price: "$0.000008" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", change: "+18.7%", price: "$0.082" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", change: "+15.3%", price: "$14.52" },
]

const topLosers = [
  { id: "terra-luna", name: "Terra Luna", symbol: "LUNA", change: "-12.3%", price: "$0.45" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", change: "-8.9%", price: "$35.20" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", change: "-7.2%", price: "$0.85" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI", change: "-6.1%", price: "$6.75" },
]

const newListings = [
  { id: "new-coin-1", name: "MetaVerse Pro", symbol: "MVP", change: "+125.4%", price: "$0.0045" },
  { id: "new-coin-2", name: "DeFi Protocol", symbol: "DFP", change: "+89.2%", price: "$1.23" },
  { id: "new-coin-3", name: "GameFi Token", symbol: "GFT", change: "+67.8%", price: "$0.156" },
]

export function CryptoTrending() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Trending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trending">🔥 Hot</TabsTrigger>
            <TabsTrigger value="movers">📈 Movers</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Trending Searches
              </div>
              {trendingCoins.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center"
                    >
                      {coin.rank}
                    </Badge>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://assets.coingecko.com/coins/images/${coin.id}/small/${coin.id}.png`}
                        alt={coin.name}
                      />
                      <AvatarFallback className="text-xs">{coin.symbol.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    {coin.change}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4" />
                New Listings
              </div>
              {newListings.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{coin.price}</div>
                    <Badge variant="default" className="text-xs">
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                      {coin.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movers" className="space-y-4">
            <Tabs defaultValue="gainers" className="space-y-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gainers">🚀 Gainers</TabsTrigger>
                <TabsTrigger value="losers">📉 Losers</TabsTrigger>
              </TabsList>

              <TabsContent value="gainers" className="space-y-3">
                {topGainers.map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://assets.coingecko.com/coins/images/${coin.id}/small/${coin.id}.png`}
                          alt={coin.name}
                        />
                        <AvatarFallback className="text-xs">{coin.symbol.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{coin.symbol}</div>
                        <div className="text-xs text-muted-foreground">{coin.price}</div>
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs bg-green-500">
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                      {coin.change}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="losers" className="space-y-3">
                {topLosers.map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://assets.coingecko.com/coins/images/${coin.id}/small/${coin.id}.png`}
                          alt={coin.name}
                        />
                        <AvatarFallback className="text-xs">{coin.symbol.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{coin.symbol}</div>
                        <div className="text-xs text-muted-foreground">{coin.price}</div>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                      {coin.change}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
