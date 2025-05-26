"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const portfolioData = [
  { date: "2024-01-01", value: 95000, benchmark: 94000 },
  { date: "2024-02-01", value: 98000, benchmark: 96500 },
  { date: "2024-03-01", value: 102000, benchmark: 98000 },
  { date: "2024-04-01", value: 99000, benchmark: 97500 },
  { date: "2024-05-01", value: 105000, benchmark: 101000 },
  { date: "2024-06-01", value: 108000, benchmark: 103500 },
  { date: "2024-07-01", value: 112000, benchmark: 106000 },
  { date: "2024-08-01", value: 115000, benchmark: 108500 },
  { date: "2024-09-01", value: 118000, benchmark: 111000 },
  { date: "2024-10-01", value: 122000, benchmark: 113500 },
  { date: "2024-11-01", value: 120000, benchmark: 114000 },
  { date: "2024-12-01", value: 125420, benchmark: 116000 },
]

const allocationData = [
  { date: "2024-01-01", stocks: 60000, crypto: 25000, cash: 10000 },
  { date: "2024-02-01", stocks: 62000, crypto: 26000, cash: 10000 },
  { date: "2024-03-01", stocks: 65000, crypto: 27000, cash: 10000 },
  { date: "2024-04-01", stocks: 63000, crypto: 26000, cash: 10000 },
  { date: "2024-05-01", stocks: 67000, crypto: 28000, cash: 10000 },
  { date: "2024-06-01", stocks: 69000, crypto: 29000, cash: 10000 },
  { date: "2024-07-01", stocks: 72000, crypto: 30000, cash: 10000 },
  { date: "2024-08-01", stocks: 74000, crypto: 31000, cash: 10000 },
  { date: "2024-09-01", stocks: 76000, crypto: 32000, cash: 10000 },
  { date: "2024-10-01", stocks: 78000, crypto: 34000, cash: 10000 },
  { date: "2024-11-01", stocks: 77000, crypto: 33000, cash: 10000 },
  { date: "2024-12-01", stocks: 80000, crypto: 35000, cash: 10420 },
]

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString('de-DE')}`,
                      name === "value" ? "Portfolio" : "S&P 500",
                    ]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Portfolio"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="S&P 500"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={allocationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [`$${value.toLocaleString('de-DE')}`, name]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stocks"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    name="Stocks"
                  />
                  <Area
                    type="monotone"
                    dataKey="crypto"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    name="Crypto"
                  />
                  <Area
                    type="monotone"
                    dataKey="cash"
                    stackId="1"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3))"
                    name="Cash"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
