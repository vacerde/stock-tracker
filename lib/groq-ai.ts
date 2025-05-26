// Groq AI integration for stock analysis
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
})

export interface StockAnalysis {
  symbol: string
  analysis: string
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL"
  confidence: number
  keyPoints: string[]
  priceTarget: {
    low: number
    high: number
    target: number
  }
  timeframe: string
}

export async function analyzeStock(
  symbol: string,
  currentPrice: number,
  historicalData: any[],
  news: any[],
): Promise<StockAnalysis> {
  try {
    const prompt = `
    Analyze the stock ${symbol} with the following data:
    
    Current Price: $${currentPrice}
    
    Recent Historical Data (last 30 days):
    ${historicalData
      .slice(-30)
      .map((d) => `Date: ${new Date(d.timestamp).toDateString()}, Close: $${d.close}, Volume: ${d.volume}`)
      .join("\n")}
    
    Recent News:
    ${news
      .slice(0, 5)
      .map((n) => `- ${n.headline} (Sentiment: ${n.sentiment})`)
      .join("\n")}
    
    Provide a comprehensive analysis including:
    1. Overall sentiment (BULLISH/BEARISH/NEUTRAL)
    2. Confidence level (0-100)
    3. Key technical and fundamental points
    4. Price targets (low, high, target)
    5. Recommended timeframe for the analysis
    
    Format your response as JSON with the following structure:
    {
      "sentiment": "BULLISH|BEARISH|NEUTRAL",
      "confidence": number,
      "analysis": "detailed analysis text",
      "keyPoints": ["point1", "point2", "point3"],
      "priceTarget": {
        "low": number,
        "high": number,
        "target": number
      },
      "timeframe": "1-3 months"
    }
    `

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.3,
    })

    const analysis = JSON.parse(text)

    return {
      symbol,
      analysis: analysis.analysis,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      keyPoints: analysis.keyPoints,
      priceTarget: analysis.priceTarget,
      timeframe: analysis.timeframe,
    }
  } catch (error) {
    console.error("Error analyzing stock with AI:", error)
    throw error
  }
}

export async function generateTradingStrategy(
  symbol: string,
  userGoal: string,
  riskTolerance: string,
): Promise<string> {
  try {
    const prompt = `
    Generate a trading strategy for ${symbol} based on:
    - User Goal: ${userGoal}
    - Risk Tolerance: ${riskTolerance}
    
    Provide specific entry points, exit strategies, stop losses, and position sizing recommendations.
    Keep it practical and actionable.
    `

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.4,
    })

    return text
  } catch (error) {
    console.error("Error generating trading strategy:", error)
    throw error
  }
}

export async function explainTechnicalIndicator(indicator: string, value: number, context: string): Promise<string> {
  try {
    const prompt = `
    Explain the technical indicator "${indicator}" with current value ${value} in the context of: ${context}
    
    Provide:
    1. What this indicator means
    2. How to interpret the current value
    3. What signals it might be giving
    4. How it fits into overall technical analysis
    
    Keep it educational but practical for trading decisions.
    `

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.2,
    })

    return text
  } catch (error) {
    console.error("Error explaining technical indicator:", error)
    throw error
  }
}
