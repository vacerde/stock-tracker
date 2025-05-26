import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { WatchlistTable } from "@/components/watchlist-table"
import { MarketOverview } from "@/components/market-overview"
import { NewsSection } from "@/components/news-section"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 space-y-6 p-6">
        <PortfolioOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WatchlistTable />
            <MarketOverview />
          </div>
          <div className="space-y-6">
            <NewsSection />
          </div>
        </div>
      </div>
    </div>
  )
}
