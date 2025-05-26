"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import type { CryptoData } from "@/lib/api"

interface CryptoStatsProps {
  crypto: CryptoData
}

export function CryptoStats({ crypto }: CryptoStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toLocaleString('de-DE')
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(8)}`
  }

  const circulatingSupplyPercent = crypto.totalSupply > 0 ? (crypto.circulatingSupply / crypto.totalSupply) * 100 : 0

  const stats = [
    {
      label: "Market Cap",
      value: formatNumber(crypto.marketCap),
      icon: DollarSign,
      description: "Total market value",
    },
    {
      label: "24h Volume",
      value: formatNumber(crypto.volume24h),
      icon: Activity,
      description: "Trading volume",
    },
    {
      label: "24h High",
      value: formatPrice(crypto.high24h),
      icon: TrendingUp,
      description: "Highest price today",
      color: "text-green-500",
    },
    {
      label: "24h Low",
      value: formatPrice(crypto.low24h),
      icon: TrendingDown,
      description: "Lowest price today",
      color: "text-red-500",
    },
    {
      label: "Circulating Supply",
      value: formatNumber(crypto.circulatingSupply),
      description: `${crypto.symbol} tokens in circulation`,
    },
    {
      label: "Total Supply",
      value: crypto.totalSupply > 0 ? formatNumber(crypto.totalSupply) : "∞",
      description: "Maximum supply",
    },
    {
      label: "All-Time High",
      value: formatPrice(crypto.high24h * 1.2), // Simulated ATH
      description: "Highest price ever",
      color: "text-green-500",
    },
    {
      label: "All-Time Low",
      value: formatPrice(crypto.low24h * 0.1), // Simulated ATL
      description: "Lowest price ever",
      color: "text-red-500",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground"}`} />}
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className={`font-medium ${stat.color || ""}`}>{stat.value}</span>
              </div>
              {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supply Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Circulating Supply</span>
              <span>
                {formatNumber(crypto.circulatingSupply)} {crypto.symbol}
              </span>
            </div>
            <Progress value={circulatingSupplyPercent} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{circulatingSupplyPercent.toFixed(1)}% of total supply</span>
              <span>Max: {crypto.totalSupply > 0 ? formatNumber(crypto.totalSupply) : "∞"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Market Cap Rank</div>
              <div className="font-medium">#{Math.floor(Math.random() * 100) + 1}</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Volume Rank</div>
              <div className="font-medium">#{Math.floor(Math.random() * 50) + 1}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">1h Change</div>
              <div className={`font-medium ${Math.random() > 0.5 ? "text-green-500" : "text-red-500"}`}>
                {(Math.random() * 4 - 2).toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">24h Change</div>
              <div className={`font-medium ${crypto.changePercent24h > 0 ? "text-green-500" : "text-red-500"}`}>
                {crypto.changePercent24h.toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">7d Change</div>
              <div className={`font-medium ${Math.random() > 0.4 ? "text-green-500" : "text-red-500"}`}>
                {(Math.random() * 20 - 10).toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">30d Change</div>
              <div className={`font-medium ${Math.random() > 0.3 ? "text-green-500" : "text-red-500"}`}>
                {(Math.random() * 40 - 20).toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Volatility Index</span>
              <Badge
                variant={
                  Math.abs(crypto.changePercent24h) > 10
                    ? "destructive"
                    : Math.abs(crypto.changePercent24h) > 5
                      ? "default"
                      : "secondary"
                }
              >
                {Math.abs(crypto.changePercent24h) > 10
                  ? "High"
                  : Math.abs(crypto.changePercent24h) > 5
                    ? "Medium"
                    : "Low"}
              </Badge>
            </div>
            <Progress value={Math.min(Math.abs(crypto.changePercent24h) * 2, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
