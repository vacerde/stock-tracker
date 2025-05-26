"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, Wallet, PieChart } from "lucide-react"
import { PortfolioChart } from "@/components/portfolio-chart"

const portfolioData = {
  totalValue: 125420.5,
  dayChange: 2340.2,
  dayChangePercent: 1.9,
  weekChange: -1250.3,
  weekChangePercent: -0.99,
  monthChange: 8920.15,
  monthChangePercent: 7.65,
  ytdChange: 23450.8,
  ytdChangePercent: 23.1,
}

const assetBreakdown = [
  { name: "Stocks", value: 75250.3, percentage: 60, color: "bg-blue-500" },
  { name: "Crypto", value: 37605.15, percentage: 30, color: "bg-orange-500" },
  { name: "Cash", value: 12565.05, percentage: 10, color: "bg-green-500" },
]

export function PortfolioOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
          <p className="text-muted-foreground">Track your investments and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Transaction</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString('de-DE')}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {portfolioData.dayChange > 0 ? (
                <ArrowUpIcon className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-red-500" />
              )}
              <span className={portfolioData.dayChange > 0 ? "text-green-500" : "text-red-500"}>
                ${Math.abs(portfolioData.dayChange).toLocaleString('de-DE')} ({portfolioData.dayChangePercent}%)
              </span>
              <span>today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Week Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={portfolioData.weekChange > 0 ? "text-green-500" : "text-red-500"}>
                {portfolioData.weekChange > 0 ? "+" : ""}${portfolioData.weekChange.toLocaleString('de-DE')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.weekChangePercent > 0 ? "+" : ""}
              {portfolioData.weekChangePercent}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month Change</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={portfolioData.monthChange > 0 ? "text-green-500" : "text-red-500"}>
                {portfolioData.monthChange > 0 ? "+" : ""}${portfolioData.monthChange.toLocaleString('de-DE')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.monthChangePercent > 0 ? "+" : ""}
              {portfolioData.monthChangePercent}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Change</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={portfolioData.ytdChange > 0 ? "text-green-500" : "text-red-500"}>
                {portfolioData.ytdChange > 0 ? "+" : ""}${portfolioData.ytdChange.toLocaleString('de-DE')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.ytdChangePercent > 0 ? "+" : ""}
              {portfolioData.ytdChangePercent}% year to date
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assetBreakdown.map((asset) => (
              <div key={asset.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-muted-foreground">{asset.percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${asset.color}`} style={{ width: `${asset.percentage}%` }} />
                  </div>
                  <span className="text-sm font-medium">${asset.value.toLocaleString('de-DE')}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
