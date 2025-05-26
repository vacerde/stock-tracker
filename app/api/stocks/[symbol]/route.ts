import { type NextRequest, NextResponse } from "next/server"
import { getStockQuote, getStockProfile, getStockMetrics } from "@/lib/finnhub-api"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()

    const [quote, profile, metrics] = await Promise.all([
      getStockQuote(symbol),
      getStockProfile(symbol).catch(() => null),
      getStockMetrics(symbol).catch(() => null),
    ])

    return NextResponse.json({
      quote,
      profile,
      metrics,
    })
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}
