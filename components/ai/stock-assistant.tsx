"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { StockAnalysis } from "@/lib/groq-ai"

interface StockAssistantProps {
  symbol: string
  currentPrice: number
}

export function StockAssistant({ symbol, currentPrice }: StockAssistantProps) {
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([])

  const analyzeStock = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, currentPrice }),
      })

      if (!response.ok) throw new Error("Failed to analyze stock")

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Error analyzing stock:", error)
    } finally {
      setLoading(false)
    }
  }

  const askQuestion = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      // This would call another AI endpoint for Q&A
      const answer = `Based on current market conditions and ${symbol}'s performance, here's my analysis of your question: "${question}". This is a simulated response - implement actual AI Q&A endpoint.`

      setChatHistory([...chatHistory, { question, answer }])
      setQuestion("")
    } catch (error) {
      console.error("Error asking question:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "BEARISH":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH":
        return "bg-green-500"
      case "BEARISH":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Stock Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Section */}
        <div className="space-y-4">
          <Button onClick={analyzeStock} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Analyze {symbol}
          </Button>

          {analysis && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(analysis.sentiment)}
                  <Badge className={getSentimentColor(analysis.sentiment)}>{analysis.sentiment}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Confidence: {analysis.confidence}%</div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Analysis</h4>
                <p className="text-sm text-muted-foreground">{analysis.analysis}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Points</h4>
                <ul className="text-sm space-y-1">
                  {analysis.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Target Low</div>
                  <div className="font-medium text-red-500">${analysis.priceTarget.low}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Target</div>
                  <div className="font-medium">${analysis.priceTarget.target}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Target High</div>
                  <div className="font-medium text-green-500">${analysis.priceTarget.high}</div>
                </div>
              </div>

              <div className="text-center">
                <Badge variant="outline">{analysis.timeframe}</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Q&A Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder={`Ask me anything about ${symbol}...`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
            <Button onClick={askQuestion} disabled={loading || !question.trim()} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Ask AI
            </Button>
          </div>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <div className="text-sm font-medium">You:</div>
                    <div className="text-sm">{chat.question}</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <div className="text-sm font-medium">AI:</div>
                    <div className="text-sm">{chat.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
