"use client"

import { useState, useEffect } from "react"
import { CryptoHeader } from "@/components/crypto/crypto-header"
import { CryptoTable } from "@/components/crypto/crypto-table"
import { CryptoMarketStats } from "@/components/crypto/crypto-market-stats"
import { CryptoTrending } from "@/components/crypto/crypto-trending"
import { getTopCryptos, type CryptoData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function CryptoPage() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCryptos() {
      try {
        setLoading(true)
        const data = await getTopCryptos()
        setCryptos(data)
      } catch (err) {
        setError("Failed to fetch crypto data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
  }, [])

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <CryptoHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Error Loading Cryptocurrencies</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CryptoHeader />
      <div className="flex-1 space-y-6 p-6">
        <CryptoMarketStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <CryptoTable cryptos={cryptos} />
            )}
          </div>
          <div>
            <CryptoTrending />
          </div>
        </div>
      </div>
    </div>
  )
}
