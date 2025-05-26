import { type NextRequest, NextResponse } from "next/server"
import { getCryptoData } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id.toLowerCase()
    const data = await getCryptoData(id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 })
  }
}
