"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const holdingsData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 50,
    avgCost: 150.25,
    currentPrice: 193.42,
    marketValue: 9671.0,
    totalCost: 7512.5,
    gain: 2158.5,
    gainPercent: 28.7,
    type: "stock",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 0.75,
    avgCost: 35000.0,
    currentPrice: 43250.0,
    marketValue: 32437.5,
    totalCost: 26250.0,
    gain: 6187.5,
    gainPercent: 23.6,
    type: "crypto",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    quantity: 25,
    avgCost: 220.0,
    currentPrice: 248.5,
    marketValue: 6212.5,
    totalCost: 5500.0,
    gain: 712.5,
    gainPercent: 13.0,
    type: "stock",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    quantity: 12,
    avgCost: 2100.0,
    currentPrice: 2650.75,
    marketValue: 31809.0,
    totalCost: 25200.0,
    gain: 6609.0,
    gainPercent: 26.2,
    type: "crypto",
  },
]

export function HoldingsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdingsData.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{holding.symbol}</span>
                      <Badge variant={holding.type === "crypto" ? "secondary" : "outline"} className="text-xs">
                        {holding.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">${holding.currentPrice.toLocaleString('de-DE')}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{holding.quantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col">
                    <span className="font-medium">${holding.marketValue.toLocaleString('de-DE')}</span>
                    <span className="text-xs text-muted-foreground">Cost: ${holding.totalCost.toLocaleString('de-DE')}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {holding.gain > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    )}
                    <div className="flex flex-col">
                      <span className={`text-sm ${holding.gain > 0 ? "text-green-500" : "text-red-500"}`}>
                        ${Math.abs(holding.gain).toLocaleString('de-DE')}
                      </span>
                      <span className={`text-xs ${holding.gain > 0 ? "text-green-500" : "text-red-500"}`}>
                        {holding.gainPercent > 0 ? "+" : ""}
                        {holding.gainPercent}%
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Buy More</DropdownMenuItem>
                      <DropdownMenuItem>Sell</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
