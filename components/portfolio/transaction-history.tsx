"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, ArrowDownIcon, DollarSign } from "lucide-react"
import { format } from "date-fns"

const transactionData = [
  {
    id: 1,
    date: new Date("2024-12-20"),
    type: "buy",
    symbol: "AAPL",
    quantity: 10,
    price: 193.42,
    total: 1934.2,
    fees: 4.95,
  },
  {
    id: 2,
    date: new Date("2024-12-18"),
    type: "sell",
    symbol: "TSLA",
    quantity: 5,
    price: 248.5,
    total: 1242.5,
    fees: 4.95,
  },
  {
    id: 3,
    date: new Date("2024-12-15"),
    type: "buy",
    symbol: "BTC",
    quantity: 0.25,
    price: 43250.0,
    total: 10812.5,
    fees: 25.0,
  },
  {
    id: 4,
    date: new Date("2024-12-10"),
    type: "dividend",
    symbol: "AAPL",
    quantity: 50,
    price: 0.25,
    total: 12.5,
    fees: 0,
  },
  {
    id: 5,
    date: new Date("2024-12-05"),
    type: "buy",
    symbol: "ETH",
    quantity: 2,
    price: 2650.75,
    total: 5301.5,
    fees: 15.0,
  },
]

export function TransactionHistory() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Fees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "buy" ? "default" : transaction.type === "sell" ? "destructive" : "secondary"
                    }
                  >
                    {transaction.type === "buy" && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                    {transaction.type === "sell" && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                    {transaction.type === "dividend" && <DollarSign className="h-3 w-3 mr-1" />}
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{transaction.symbol}</TableCell>
                <TableCell className="text-right">{transaction.quantity}</TableCell>
                <TableCell className="text-right">${transaction.price.toLocaleString('de-DE')}</TableCell>
                <TableCell className="text-right">${transaction.total.toLocaleString('de-DE')}</TableCell>
                <TableCell className="text-right">${transaction.fees.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
