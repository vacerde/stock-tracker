"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, Star, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { StockData } from "@/lib/api"
import Link from "next/link"

interface StockTableProps {
  stocks: StockData[]
}

export function StockTable({ stocks }: StockTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Stocks</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">52W Range</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <Link href={`/stocks/${stock.symbol}`} className="font-medium hover:underline">
                        {stock.symbol}
                      </Link>
                      <span className="text-sm text-muted-foreground">{stock.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">${stock.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {stock.change > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stock.change > 0 ? "text-green-500" : "text-red-500"}>
                      {stock.change > 0 ? "+" : ""}${stock.change.toFixed(2)}
                    </span>
                    <span className={`text-sm ${stock.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      ({stock.changePercent > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{(stock.volume / 1000000).toFixed(1)}M</TableCell>
                <TableCell className="text-right">
                  <div className="text-sm">
                    <div>
                      ${stock.low52Week.toFixed(2)} - ${stock.high52Week.toFixed(2)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Link href={`/stocks/${stock.symbol}`}>
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
