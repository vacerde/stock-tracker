import { type NextRequest, NextResponse } from "next/server"
import { getStockCandles } from "@/lib/finnhub-api"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const { searchParams } = new URL(request.url)
    const resolution = searchParams.get("resolution") || "D"
    const from = searchParams.get("from") ? Number.parseInt(searchParams.get("from")!) : undefined
    const to = searchParams.get("to") ? Number.parseInt(searchParams.get("to")!) : undefined

    const candles = await getStockCandles(symbol, resolution, from, to)

    return NextResponse.json(candles)
  } catch (error) {
    console.error("Error fetching stock candles:", error)
    return NextResponse.json({ error: "Failed to fetch stock candles" }, { status: 500 })
  }
}
