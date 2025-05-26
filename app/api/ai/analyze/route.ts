import { type NextRequest, NextResponse } from "next/server"
import { analyzeStock } from "@/lib/groq-ai"
import { getStockCandles, getStockNews } from "@/lib/finnhub-api"

export async function POST(request: NextRequest) {
  try {
    const { symbol, currentPrice } = await request.json()

    if (!symbol || !currentPrice) {
      return NextResponse.json({ error: "Symbol and current price are required" }, { status: 400 })
    }

    // Get historical data and news
    const [historicalData, news] = await Promise.all([getStockCandles(symbol, "D"), getStockNews(symbol)])

    const analysis = await analyzeStock(symbol, currentPrice, historicalData, news)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing stock:", error)
    return NextResponse.json({ error: "Failed to analyze stock" }, { status: 500 })
  }
}
