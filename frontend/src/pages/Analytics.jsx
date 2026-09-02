import { usePolling } from '../hooks/usePolling'
import { getDashboard } from '../api/client'
import { RevenueOverTimeChart, StatusPieChart, CategoryBarChart } from '../components/Charts'

export default function Analytics() {
  const { data, loading } = usePolling(getDashboard, [], 15000)

  if (loading && !data) {
    return <div className="text-ink-500 px-2 py-8">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink-100">Analytics</h1>
        <p className="text-ink-500 text-sm mt-1">Trends across revenue, status and service categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel px-5 py-5">
          <p className="data-label mb-3">Revenue — last 14 days</p>
          <RevenueOverTimeChart data={data.bookings_over_time} />
        </div>
        <div className="panel px-5 py-5">
          <p className="data-label mb-3">Booking status breakdown</p>
          <StatusPieChart data={data.status_breakdown} />
        </div>
        <div className="panel px-5 py-5 lg:col-span-2">
          <p className="data-label mb-3">Service category breakdown</p>
          <CategoryBarChart data={data.category_breakdown} />
        </div>
      </div>
    </div>
  )
}
