import { usePolling } from '../hooks/usePolling'
import { getMechanics } from '../api/client'
import StatusBadge from './StatusBadge'

export default function MechanicsList() {
  const { data: mechanics, loading } = usePolling(getMechanics, [], 15000)

  if (loading && !mechanics) {
    return <div className="panel px-5 py-8 text-center text-ink-500">Loading mechanics...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {mechanics?.map((m) => (
        <div key={m.id} className="panel px-5 py-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-ink-100">{m.name}</p>
              <p className="text-ink-500 text-xs mt-0.5">{m.specialty} · {m.city}</p>
            </div>
            <StatusBadge status={m.status} />
          </div>
          <div className="flex items-center justify-between text-sm border-t border-base-700 pt-3">
            <div>
              <p className="data-label">Jobs done</p>
              <p className="mono-num text-ink-100">{m.jobs_completed}</p>
            </div>
            <div>
              <p className="data-label">Rating</p>
              <p className="mono-num text-signal">{m.rating.toFixed(1)} ★</p>
            </div>
            <div className="text-right">
              <p className="data-label">Last booking</p>
              <p className="text-ink-300 text-xs">
                {m.last_booking ? `#${m.last_booking.id} · ${m.last_booking.status}` : 'None yet'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
