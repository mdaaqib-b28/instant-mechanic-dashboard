import { useEffect, useState, useCallback } from 'react'
import { getBookings } from '../api/client'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS = [
  '', 'Pending', 'Assigned', 'Mechanic On The Way', 'In Progress', 'Completed', 'Cancelled',
]

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatAmount(n) {
  return `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export default function BookingsTable() {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getBookings({
        page, page_size: 15, search, status, sort_by: sortBy, sort_dir: sortDir,
      })
      setRows(data.items)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } finally {
      setLoading(false)
    }
  }, [page, search, status, sortBy, sortDir])

  useEffect(() => {
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [search, status, sortBy, sortDir])

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  const columns = [
    { key: 'id', label: 'Booking ID', sortable: false },
    { key: 'customer', label: 'Customer', sortable: false },
    { key: 'vehicle', label: 'Vehicle', sortable: false },
    { key: 'service_category', label: 'Service', sortable: false },
    { key: 'mechanic', label: 'Mechanic', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'scheduled_at', label: 'Date / Time', sortable: true },
  ]

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 flex flex-wrap items-center gap-3 border-b border-base-700">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer, vehicle or service..."
          className="bg-base-800 border border-base-600 rounded px-3 py-2 text-sm w-72 placeholder:text-ink-500 focus:outline-none focus:border-signal"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-base-800 border border-base-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-signal"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === '' ? 'All statuses' : s}</option>
          ))}
        </select>
        <span className="text-ink-500 text-sm ml-auto">{total} bookings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-700 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={`px-5 py-3 data-label font-medium ${col.sortable ? 'cursor-pointer select-none hover:text-ink-100' : ''}`}
                >
                  {col.label}
                  {sortBy === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-ink-500">Loading bookings...</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-ink-500">No bookings match this filter.</td></tr>
            )}
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-base-800 hover:bg-base-800/60">
                <td className="px-5 py-3 mono-num text-ink-500">#{b.id}</td>
                <td className="px-5 py-3">{b.customer}</td>
                <td className="px-5 py-3 text-ink-300">{b.vehicle}</td>
                <td className="px-5 py-3 text-ink-300">{b.service_category}</td>
                <td className="px-5 py-3 text-ink-300">{b.mechanic}</td>
                <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-5 py-3 mono-num">{formatAmount(b.amount)}</td>
                <td className="px-5 py-3 text-ink-500">{formatDate(b.scheduled_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 flex items-center justify-between border-t border-base-700">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1.5 rounded border border-base-600 text-sm disabled:opacity-30 hover:border-signal"
        >
          Previous
        </button>
        <span className="text-ink-500 text-sm">Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1.5 rounded border border-base-600 text-sm disabled:opacity-30 hover:border-signal"
        >
          Next
        </button>
      </div>
    </div>
  )
}
