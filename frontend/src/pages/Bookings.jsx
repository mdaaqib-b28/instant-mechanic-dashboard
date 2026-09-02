import BookingsTable from '../components/BookingsTable'

export default function Bookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink-100">Bookings</h1>
        <p className="text-ink-500 text-sm mt-1">Search, filter and track every service booking.</p>
      </div>
      <BookingsTable />
    </div>
  )
}
