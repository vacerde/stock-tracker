import { type NextRequest, NextResponse } from "next/server"
import { searchAssets } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
    }

    const results = await searchAssets(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching assets:", error)
    return NextResponse.json({ error: "Failed to search assets" }, { status: 500 })
  }
}
