"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, Star, Plus, TrendingUp, TrendingDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CryptoData } from "@/lib/api"
import Link from "next/link"

interface CryptoTableProps {
  cryptos: CryptoData[]
}

export function CryptoTable({ cryptos }: CryptoTableProps) {
  const [sortBy, setSortBy] = useState<"marketCap" | "price" | "change24h">("marketCap")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const sortedCryptos = [...cryptos].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue
  })

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString('de-DE')}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    return `$${volume.toLocaleString('de-DE')}`
  }

  const getPriceChangeColor = (change: number) => {
    if (change > 5) return "text-green-600"
    if (change > 0) return "text-green-500"
    if (change < -5) return "text-red-600"
    if (change < 0) return "text-red-500"
    return "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Top Cryptocurrencies
          <Badge variant="outline" className="text-xs">
            Live Prices
          </Badge>
        </CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">1h</TableHead>
              <TableHead className="text-right">24h</TableHead>
              <TableHead className="text-right">7d</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCryptos.map((crypto, index) => (
              <TableRow key={crypto.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://assets.coingecko.com/coins/images/${crypto.id}/small/${crypto.id}.png`}
                        alt={crypto.name}
                      />
                      <AvatarFallback>{crypto.symbol.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Link href={`/crypto/${crypto.id}`} className="font-medium hover:underline">
                        {crypto.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">{crypto.symbol}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${crypto.price >= 1 ? crypto.price.toFixed(2) : crypto.price.toFixed(6)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {Math.random() > 0.5 ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={Math.random() > 0.5 ? "text-green-500" : "text-red-500"}>
                      {(Math.random() * 4 - 2).toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {crypto.changePercent24h > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={getPriceChangeColor(crypto.changePercent24h)}>
                      {crypto.changePercent24h > 0 ? "+" : ""}
                      {crypto.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {Math.random() > 0.4 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={Math.random() > 0.4 ? "text-green-500" : "text-red-500"}>
                      {(Math.random() * 20 - 10).toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatMarketCap(crypto.marketCap)}</TableCell>
                <TableCell className="text-right">{formatVolume(crypto.volume24h)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Link href={`/crypto/${crypto.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
