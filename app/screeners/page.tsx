"use client"

import { useState } from "react"
import { ScreenerHeader } from "@/components/screeners/screener-header"
import { ScreenerFilters } from "@/components/screeners/screener-filters"
import { ScreenerResults } from "@/components/screeners/screener-results"
import { ScreenerPresets } from "@/components/screeners/screener-presets"

export default function ScreenersPage() {
  const [activeTab, setActiveTab] = useState<"stocks" | "crypto">("stocks")
  const [filters, setFilters] = useState({})

  return (
    <div className="flex flex-col min-h-screen">
      <ScreenerHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 space-y-6 p-6">
        <ScreenerPresets activeTab={activeTab} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ScreenerFilters activeTab={activeTab} filters={filters} setFilters={setFilters} />
          </div>
          <div className="lg:col-span-3">
            <ScreenerResults activeTab={activeTab} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  )
}
