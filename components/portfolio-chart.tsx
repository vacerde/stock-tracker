"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "2024-01-01", value: 95000 },
  { date: "2024-02-01", value: 98000 },
  { date: "2024-03-01", value: 102000 },
  { date: "2024-04-01", value: 99000 },
  { date: "2024-05-01", value: 105000 },
  { date: "2024-06-01", value: 108000 },
  { date: "2024-07-01", value: 112000 },
  { date: "2024-08-01", value: 115000 },
  { date: "2024-09-01", value: 118000 },
  { date: "2024-10-01", value: 122000 },
  { date: "2024-11-01", value: 120000 },
  { date: "2024-12-01", value: 125420 },
]

export function PortfolioChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
            formatter={(value: number) => [`$${value.toLocaleString('de-DE')}`, "Portfolio Value"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
