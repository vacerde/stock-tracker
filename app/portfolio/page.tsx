import { PortfolioHeader } from "@/components/portfolio/portfolio-header"
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary"
import { HoldingsTable } from "@/components/portfolio/holdings-table"
import { TransactionHistory } from "@/components/portfolio/transaction-history"
import { PerformanceChart } from "@/components/portfolio/performance-chart"

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PortfolioHeader />
      <div className="flex-1 space-y-6 p-6">
        <PortfolioSummary />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <div>
            <HoldingsTable />
          </div>
        </div>
        <TransactionHistory />
      </div>
    </div>
  )
}
