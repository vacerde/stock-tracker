"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Target, Clock, PieChart } from "lucide-react"

const summaryData = {
  totalValue: 125420.5,
  totalCost: 98750.0,
  totalGain: 26670.5,
  totalGainPercent: 27.0,
  dayChange: 2340.2,
  dayChangePercent: 1.9,
  unrealizedGain: 22340.5,
  unrealizedGainPercent: 21.7,
  realizedGain: 4330.0,
  dividendIncome: 1250.75,
}

export function PortfolioSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summaryData.totalValue.toLocaleString('de-DE')}</div>
          <div className="flex items-center space-x-2 text-xs">
            {summaryData.dayChange > 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500" />
            )}
            <span className={summaryData.dayChange > 0 ? "text-green-500" : "text-red-500"}>
              ${Math.abs(summaryData.dayChange).toLocaleString('de-DE')} ({summaryData.dayChangePercent}%)
            </span>
            <span className="text-muted-foreground">today</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">+${summaryData.totalGain.toLocaleString('de-DE')}</div>
          <p className="text-xs text-muted-foreground">+{summaryData.totalGainPercent}% from cost basis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">+${summaryData.unrealizedGain.toLocaleString('de-DE')}</div>
          <p className="text-xs text-muted-foreground">+{summaryData.unrealizedGainPercent}% unrealized</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dividend Income</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summaryData.dividendIncome.toLocaleString('de-DE')}</div>
          <p className="text-xs text-muted-foreground">This year</p>
        </CardContent>
      </Card>
    </div>
  )
}
