"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Volume2, Activity, Zap } from "lucide-react"
import type { ChartData } from "@/lib/api"

interface CryptoChartProps {
  symbol: string
  data: ChartData[]
}

export function CryptoChart({ symbol, data }: CryptoChartProps) {
  const [timeframe, setTimeframe] = useState("24h")
  const [chartType, setChartType] = useState("price")

  const chartData = data.map((item) => ({
    timestamp: item.timestamp,
    date: new Date(item.timestamp).toLocaleDateString(),
    time: new Date(item.timestamp).toLocaleTimeString(),
    price: item.close,
    volume: item.volume,
    high: item.high,
    low: item.low,
  }))

  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0
  const priceChange = data.length > 1 ? data[data.length - 1].close - data[data.length - 2].close : 0
  const priceChangePercent = data.length > 1 ? (priceChange / data[data.length - 2].close) * 100 : 0

  const PriceChart = () => (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="time"
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value.split(":").slice(0, 2).join(":")}
          />
          <YAxis
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `$${value.toFixed(value < 1 ? 6 : 2)}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">
                      {data.date} {data.time}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        Price: <span className="font-medium">${data.price?.toFixed(data.price < 1 ? 6 : 2)}</span>
                      </p>
                      <p>
                        High:{" "}
                        <span className="font-medium text-green-500">${data.high?.toFixed(data.high < 1 ? 6 : 2)}</span>
                      </p>
                      <p>
                        Low:{" "}
                        <span className="font-medium text-red-500">${data.low?.toFixed(data.low < 1 ? 6 : 2)}</span>
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
          />
          <ReferenceLine y={currentPrice} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

  const VolumeChart = () => (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="time" className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value: number) => [
              value > 1e9 ? `${(value / 1e9).toFixed(2)}B` : `${(value / 1e6).toFixed(2)}M`,
              "Volume",
            ]}
          />
          <Bar dataKey="volume" fill="hsl(var(--chart-2))" opacity={0.7} />
          <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {symbol} Live Chart
            <Badge variant="default" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
                <SelectItem value="1y">1y</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={chartType === "price" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("price")}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "volume" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("volume")}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Current: </span>
            <span className="font-medium">${currentPrice.toFixed(currentPrice < 1 ? 6 : 2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Change: </span>
            <span className={priceChange > 0 ? "text-green-500" : "text-red-500"}>
              {priceChange > 0 ? "+" : ""}${priceChange.toFixed(currentPrice < 1 ? 6 : 2)} (
              {priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">24h High: </span>
            <span className="font-medium text-green-500">
              ${Math.max(...data.map((d) => d.high)).toFixed(currentPrice < 1 ? 6 : 2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">24h Low: </span>
            <span className="font-medium text-red-500">
              ${Math.min(...data.map((d) => d.low)).toFixed(currentPrice < 1 ? 6 : 2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "price" ? <PriceChart /> : <VolumeChart />}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-medium">
              {data.length > 0 ? `${(data[data.length - 1].volume / 1e6).toFixed(2)}M` : "N/A"}
            </div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Volatility</div>
            <div className="font-medium">{Math.abs(priceChangePercent).toFixed(2)}%</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Trend</div>
            <div className={`font-medium ${priceChange > 0 ? "text-green-500" : "text-red-500"}`}>
              {priceChange > 0 ? "Bullish" : "Bearish"}
            </div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Momentum</div>
            <div className="font-medium">
              <Activity className="h-4 w-4 inline mr-1" />
              {Math.abs(priceChangePercent) > 5 ? "High" : Math.abs(priceChangePercent) > 2 ? "Medium" : "Low"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
