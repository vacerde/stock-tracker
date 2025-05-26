"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  ReferenceLine,
} from "recharts"
import { Square, Type, Minus, RotateCcw, Save } from "lucide-react"
import type { CandleData } from "@/lib/finnhub-api"

interface AdvancedChartProps {
  symbol: string
  data: CandleData[]
  currentPrice: number
}

interface DrawingTool {
  type: "line" | "rectangle" | "text"
  active: boolean
}

interface TechnicalIndicators {
  sma20: number[]
  sma50: number[]
  rsi: number[]
  volume: number[]
}

export function AdvancedChart({ symbol, data, currentPrice }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState("1D")
  const [chartType, setChartType] = useState("candlestick")
  const [drawingTool, setDrawingTool] = useState<DrawingTool>({ type: "line", active: false })
  const [annotations, setAnnotations] = useState<any[]>([])
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Calculate technical indicators
  useEffect(() => {
    if (data.length > 0) {
      const closes = data.map((d) => d.close)
      const volumes = data.map((d) => d.volume)

      // Simple Moving Averages
      const sma20 = calculateSMA(closes, 20)
      const sma50 = calculateSMA(closes, 50)

      // RSI
      const rsi = calculateRSI(closes, 14)

      setIndicators({
        sma20,
        sma50,
        rsi,
        volume: volumes,
      })
    }
  }, [data])

  const calculateSMA = (prices: number[], period: number): number[] => {
    const sma = []
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      sma.push(sum / period)
    }
    return sma
  }

  const calculateRSI = (prices: number[], period: number): number[] => {
    const rsi = []
    const gains = []
    const losses = []

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }

    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
      const rs = avgGain / avgLoss
      rsi.push(100 - 100 / (1 + rs))
    }

    return rsi
  }

  const chartData = data.map((item, index) => ({
    timestamp: item.timestamp,
    date: new Date(item.timestamp).toLocaleDateString(),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    sma20: indicators?.sma20[index - 19] || null,
    sma50: indicators?.sma50[index - 49] || null,
    rsi: indicators?.rsi[index - 14] || null,
  }))

  const handleDrawingToolSelect = (tool: "line" | "rectangle" | "text") => {
    setDrawingTool({ type: tool, active: !drawingTool.active || drawingTool.type !== tool })
  }

  const saveAnnotations = async () => {
    // Save to Supabase
    console.log("Saving annotations:", annotations)
  }

  const clearAnnotations = () => {
    setAnnotations([])
  }

  const CandlestickChart = () => (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
          <YAxis
            className="text-xs fill-muted-foreground"
            domain={["dataMin - 5", "dataMax + 5"]}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        Open: <span className="font-medium">${data.open?.toFixed(2)}</span>
                      </p>
                      <p>
                        High: <span className="font-medium text-green-500">${data.high?.toFixed(2)}</span>
                      </p>
                      <p>
                        Low: <span className="font-medium text-red-500">${data.low?.toFixed(2)}</span>
                      </p>
                      <p>
                        Close: <span className="font-medium">${data.close?.toFixed(2)}</span>
                      </p>
                      <p>
                        Volume: <span className="font-medium">{(data.volume / 1000000).toFixed(2)}M</span>
                      </p>
                      {data.rsi && (
                        <p>
                          RSI: <span className="font-medium">{data.rsi.toFixed(2)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />

          {/* Candlestick representation using bars */}
          <Bar
            dataKey={(entry) => [entry.low, entry.high]}
            fill="transparent"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
          />

          {/* Moving averages */}
          <Line
            type="monotone"
            dataKey="sma20"
            stroke="hsl(var(--chart-1))"
            strokeWidth={1}
            dot={false}
            connectNulls={false}
            name="SMA 20"
          />
          <Line
            type="monotone"
            dataKey="sma50"
            stroke="hsl(var(--chart-2))"
            strokeWidth={1}
            dot={false}
            connectNulls={false}
            name="SMA 50"
          />

          {/* Current price line */}
          <ReferenceLine y={currentPrice} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )

  const LineChartView = () => (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sma20" stroke="hsl(var(--chart-1))" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="sma50" stroke="hsl(var(--chart-2))" strokeWidth={1} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  const VolumeChart = () => (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip formatter={(value: number) => [(value / 1000000).toFixed(2) + "M", "Volume"]} />
          <Bar dataKey="volume" fill="hsl(var(--muted))" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )

  const RSIChart = () => (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis domain={[0, 100]} className="text-xs fill-muted-foreground" />
          <Tooltip />
          <Line type="monotone" dataKey="rsi" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
          <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
          <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {symbol} Advanced Chart
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1m</SelectItem>
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={drawingTool.active && drawingTool.type === "line" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDrawingToolSelect("line")}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant={drawingTool.active && drawingTool.type === "rectangle" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDrawingToolSelect("rectangle")}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={drawingTool.active && drawingTool.type === "text" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDrawingToolSelect("text")}
              >
                <Type className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={clearAnnotations}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={saveAnnotations}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="candlestick" className="space-y-4">
          <TabsList>
            <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="rsi">RSI</TabsTrigger>
          </TabsList>

          <TabsContent value="candlestick">
            <CandlestickChart />
          </TabsContent>

          <TabsContent value="line">
            <LineChartView />
          </TabsContent>

          <TabsContent value="volume">
            <VolumeChart />
          </TabsContent>

          <TabsContent value="rsi">
            <RSIChart />
          </TabsContent>
        </Tabs>

        {/* Technical Indicators Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">SMA 20</div>
            <div className="font-medium">${indicators?.sma20[indicators.sma20.length - 1]?.toFixed(2) || "N/A"}</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">SMA 50</div>
            <div className="font-medium">${indicators?.sma50[indicators.sma50.length - 1]?.toFixed(2) || "N/A"}</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">RSI</div>
            <div className="font-medium">{indicators?.rsi[indicators.rsi.length - 1]?.toFixed(2) || "N/A"}</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="font-medium">
              {data.length > 0 ? `${(data[data.length - 1].volume / 1000000).toFixed(2)}M` : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
