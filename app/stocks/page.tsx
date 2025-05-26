"use client"

import { useState, useEffect } from "react"
import { StockHeader } from "@/components/stocks/stock-header"
import { StockTable } from "@/components/stocks/stock-table"
import { MarketIndices } from "@/components/stocks/market-indices"
import { TopMovers } from "@/components/stocks/top-movers"
import { getTopStocks, type StockData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true)
        const data = await getTopStocks()
        setStocks(data)
      } catch (err) {
        setError("Failed to fetch stock data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [])

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <StockHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Error Loading Stocks</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StockHeader />
      <div className="flex-1 space-y-6 p-6">
        <MarketIndices />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <StockTable stocks={stocks} />
            )}
          </div>
          <div>
            <TopMovers />
          </div>
        </div>
      </div>
    </div>
  )
}
