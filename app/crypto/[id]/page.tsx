"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CryptoDetailHeader } from "@/components/crypto/crypto-detail-header"
import { CryptoChart } from "@/components/crypto/crypto-chart"
import { CryptoStats } from "@/components/crypto/crypto-stats"
import { CryptoNews } from "@/components/crypto/crypto-news"
import { getCryptoData, getCryptoChart, type CryptoData, type ChartData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function CryptoDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCryptoDetails() {
      try {
        setLoading(true)
        const [crypto, chart] = await Promise.all([getCryptoData(id), getCryptoChart(id, 30)])
        setCryptoData(crypto)
        setChartData(chart)
      } catch (err) {
        setError("Failed to fetch crypto details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCryptoDetails()
    }
  }, [id])

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Cryptocurrency Not Found</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !cryptoData) {
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
      <CryptoDetailHeader crypto={cryptoData} />
      <div className="flex-1 space-y-6 p-6">
        <CryptoChart data={chartData} symbol={cryptoData.symbol} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CryptoNews symbol={cryptoData.symbol} />
          </div>
          <div>
            <CryptoStats crypto={cryptoData} />
          </div>
        </div>
      </div>
    </div>
  )
}
