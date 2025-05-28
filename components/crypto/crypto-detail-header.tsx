"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, Star, Plus, Bell, ExternalLink } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CryptoData } from "@/lib/api"

interface CryptoDetailHeaderProps {
  crypto: CryptoData
}

export function CryptoDetailHeader({ crypto }: CryptoDetailHeaderProps) {
  const formatPrice = (price: number) => {
    if (price >= 1) return price.toFixed(2)
    if (price >= 0.01) return price.toFixed(4)
    return price.toFixed(8)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString('de-DE')}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center gap-4 px-6">
        <SidebarTrigger />

        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{crypto.name}</h1>
                <Badge variant="outline" className="text-xs">
                  {crypto.symbol}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Rank #{Math.floor(Math.random() * 100) + 1}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Website
            </Button>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Watchlist
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alert
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Buy
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
