"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { StockDetailHeader } from "@/components/stocks/stock-detail-header"
import { StockChart } from "@/components/stocks/stock-chart"
import { StockStats } from "@/components/stocks/stock-stats"
import { StockNews } from "@/components/stocks/stock-news"
import { getStockData, getStockChart, getStockChartFromYahoo, type StockData, type ChartData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function StockDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string

  const [stockData, setStockData] = useState<StockData | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStockDetails() {
      try {
        setLoading(true)
        const [stock, chart] = await Promise.all([getStockData(symbol), getStockChart(symbol, "daily")])
        setStockData(stock)
        setChartData(chart)
      } catch (err) {
        setError("Failed to fetch stock details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchStockDetails()
    }
  }, [symbol])

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Stock Not Found</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !stockData) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="border-b p-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 space-y-6 p-6">
          <Skeleton className="h-96 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full">
        <div className="sticky top-0 z-10 bg-background">
          <StockDetailHeader stock={stockData} />
        </div>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <StockChart data={chartData} symbol={symbol} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StockNews symbol={symbol} />
          </div>
          <div>
            <StockStats stock={stockData} />
          </div>
        </div>
      </div>
    </div>
  )
}
