"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface ScreenerHeaderProps {
  activeTab: "stocks" | "crypto"
  setActiveTab: (tab: "stocks" | "crypto") => void
}

export function ScreenerHeader({ activeTab, setActiveTab }: ScreenerHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-6">
        <SidebarTrigger />

        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Screeners</h1>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "stocks" | "crypto")}>
            <TabsList>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Screen
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </header>
  )
}
