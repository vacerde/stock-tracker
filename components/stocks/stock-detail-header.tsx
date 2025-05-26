"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, Star, Plus, Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { StockData } from "@/lib/api"

interface StockDetailHeaderProps {
  stock: StockData
}

export function StockDetailHeader({ stock }: StockDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger />

        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{stock.symbol}</h1>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                <div className="flex items-center gap-1">
                  {stock.change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={stock.change > 0 ? "text-green-500" : "text-red-500"}>
                    {stock.change > 0 ? "+" : ""}${stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
