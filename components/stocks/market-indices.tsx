"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, RefreshCwIcon } from "lucide-react"
import { getStockQuote, StockQuote } from "@/lib/finnhub-api" // Adjust import path as needed

interface IndexData {
  name: string
  symbol: string
  quote: StockQuote | null
  loading: boolean
  error: boolean
}

const indicesConfig = [
  { name: "S&P 500", symbol: "SPY" },      // SPDR S&P 500 ETF Trust
  { name: "NASDAQ", symbol: "QQQ" },       // Invesco QQQ Trust ETF
  { name: "DOW", symbol: "DIA" },          // SPDR Dow Jones Industrial Average ETF
  { name: "Russell 2000", symbol: "IWM" }, // iShares Russell 2000 ETF
]

export function MarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>(
    indicesConfig.map(config => ({
      ...config,
      quote: null,
      loading: true,
      error: false
    }))
  )
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchIndexData = async (symbol: string): Promise<StockQuote | null> => {
    try {
      const quote = await getStockQuote(symbol)
      return quote
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error)
      return null
    }
  }

  const loadAllIndices = async () => {
    setIndices(prev => prev.map(index => ({ ...index, loading: true, error: false })))
    
    const promises = indicesConfig.map(async (config) => {
      const quote = await fetchIndexData(config.symbol)
      return {
        ...config,
        quote,
        loading: false,
        error: quote === null
      }
    })

    const results = await Promise.all(promises)
    setIndices(results)
    setLastUpdate(new Date())
  }

  useEffect(() => {
    loadAllIndices()

    // Refresh data every 30 seconds
    const interval = setInterval(loadAllIndices, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    }
    return value.toFixed(2)
  }

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}`
  }

  const formatChangePercent = (changePercent: number): string => {
    const sign = changePercent >= 0 ? '+' : ''
    return `${sign}${changePercent.toFixed(2)}%`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Market Indices</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCwIcon className="h-3 w-3" />
          Last updated: {lastUpdate.toLocaleTimeString('de-DE').slice(0, 5)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <Card key={index.symbol} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {index.loading ? (
                <div className="flex items-center justify-center py-4">
                  <RefreshCwIcon className="h-4 w-4 animate-spin" />
                </div>
              ) : index.error || !index.quote ? (
                <div className="text-center py-4">
                  <div className="text-sm text-muted-foreground">Data unavailable</div>
                  <div className="text-xs text-muted-foreground">{index.symbol}</div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {formatValue(index.quote.current)}
                    </div>
                    <div className="text-xs text-muted-foreground">{index.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatChange(index.quote.change)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={index.quote.changePercent >= 0 ? "default" : "destructive"} 
                      className="text-xs mb-1"
                    >
                      {index.quote.changePercent >= 0 ? 
                        <ArrowUpIcon className="h-3 w-3 mr-1" /> : 
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      }
                      {formatChangePercent(index.quote.changePercent)}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      H: {formatValue(index.quote.high)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      L: {formatValue(index.quote.low)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}