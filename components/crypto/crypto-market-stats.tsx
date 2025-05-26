"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, Activity, Zap } from "lucide-react"

interface MarketStats {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  ethDominance: number
  fearGreedIndex: number
  activeCoins: number
  marketCapChange24h: number
}

export function CryptoMarketStats() {
  const [stats, setStats] = useState<MarketStats>({
    totalMarketCap: 1680000000000, // $1.68T
    totalVolume24h: 89500000000, // $89.5B
    btcDominance: 50.3,
    ethDominance: 17.2,
    fearGreedIndex: 72,
    activeCoins: 13847,
    marketCapChange24h: 2.1,
  })

  const getFearGreedLabel = (index: number) => {
    if (index >= 75) return { label: "Extreme Greed", color: "bg-red-500" }
    if (index >= 55) return { label: "Greed", color: "bg-orange-500" }
    if (index >= 45) return { label: "Neutral", color: "bg-yellow-500" }
    if (index >= 25) return { label: "Fear", color: "bg-blue-500" }
    return { label: "Extreme Fear", color: "bg-green-500" }
  }

  const fearGreed = getFearGreedLabel(stats.fearGreedIndex)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats.totalMarketCap / 1e12).toFixed(2)}T</div>
          <div className="flex items-center space-x-2 text-xs">
            {stats.marketCapChange24h > 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500" />
            )}
            <span className={stats.marketCapChange24h > 0 ? "text-green-500" : "text-red-500"}>
              {stats.marketCapChange24h > 0 ? "+" : ""}
              {stats.marketCapChange24h}% (24h)
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats.totalVolume24h / 1e9).toFixed(1)}B</div>
          <p className="text-xs text-muted-foreground">Across all exchanges</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.btcDominance}%</div>
          <p className="text-xs text-muted-foreground">ETH: {stats.ethDominance}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fear & Greed</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.fearGreedIndex}</div>
          <Badge className={`text-xs ${fearGreed.color}`}>{fearGreed.label}</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
