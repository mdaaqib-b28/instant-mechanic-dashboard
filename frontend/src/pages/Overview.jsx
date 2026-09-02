import { usePolling } from '../hooks/usePolling'
import { getDashboard } from '../api/client'
import StatCard from '../components/StatCard'
import { BookingsOverTimeChart } from '../components/Charts'

export default function Overview() {
  const { data, loading, error } = usePolling(getDashboard, [], 15000)

  if (loading && !data) {
    return <div className="text-ink-500 px-2 py-8">Loading dashboard...</div>
  }
  if (error && !data) {
    return (
      <div className="panel px-5 py-8 text-center">
        <p className="text-danger font-medium">Could not reach the backend API.</p>
        <p className="text-ink-500 text-sm mt-1">Check that the Flask server is running and VITE_API_URL is set correctly.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink-100">Operations Overview</h1>
        <p className="text-ink-500 text-sm mt-1">Live snapshot across bookings, mechanics and revenue.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={data.total_bookings} />
        <StatCard label="Today's Bookings" value={data.today_bookings} accent="signal" />
        <StatCard label="Completed" value={data.completed_bookings} accent="ok" />
        <StatCard label="Pending" value={data.pending_bookings} accent="warn" />
        <StatCard label="Cancelled" value={data.cancelled_bookings} accent="danger" />
        <StatCard label="Total Revenue" value={`₹${Math.round(data.total_revenue).toLocaleString('en-IN')}`} />
        <StatCard label="Active Mechanics" value={data.active_mechanics} />
        <StatCard label="New Customers Today" value={data.new_customers_today} />
      </div>

      <div className="panel px-5 py-5">
        <p className="data-label mb-3">Bookings — last 14 days</p>
        <BookingsOverTimeChart data={data.bookings_over_time} />
      </div>
    </div>
  )
}
