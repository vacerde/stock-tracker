"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, Star, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const watchlistData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 193.42,
    change: 2.34,
    changePercent: 1.22,
    marketCap: "3.01T",
    volume: "45.2M",
    type: "stock",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250.0,
    change: -1250.5,
    changePercent: -2.81,
    marketCap: "847B",
    volume: "28.5B",
    type: "crypto",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 248.5,
    change: 12.75,
    changePercent: 5.41,
    marketCap: "789B",
    volume: "89.3M",
    type: "stock",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2650.75,
    change: 85.25,
    changePercent: 3.33,
    marketCap: "318B",
    volume: "15.2B",
    type: "crypto",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.3,
    change: -15.2,
    changePercent: -1.71,
    marketCap: "2.16T",
    volume: "52.1M",
    type: "stock",
  },
]

export function WatchlistTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Watchlist
        </CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchlistData.map((asset) => (
              <TableRow key={asset.symbol} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{asset.symbol}</span>
                        <Badge variant={asset.type === "crypto" ? "secondary" : "outline"} className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{asset.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">${asset.price.toLocaleString('de-DE')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {asset.change > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={asset.change > 0 ? "text-green-500" : "text-red-500"}>
                      {asset.change > 0 ? "+" : ""}${Math.abs(asset.change).toFixed(2)}
                    </span>
                    <span className={`text-sm ${asset.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      ({asset.changePercent > 0 ? "+" : ""}
                      {asset.changePercent}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{asset.marketCap}</TableCell>
                <TableCell className="text-right">{asset.volume}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
