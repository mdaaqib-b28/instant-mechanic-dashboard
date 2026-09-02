const STYLES = {
  Pending: 'bg-warn/15 text-warn border-warn/30',
  Assigned: 'bg-steel/15 text-steel border-steel/30',
  'Mechanic On The Way': 'bg-teal/15 text-teal border-teal/30',
  'In Progress': 'bg-signal/15 text-signal border-signal/30',
  Completed: 'bg-ok/15 text-ok border-ok/30',
  Cancelled: 'bg-danger/15 text-danger border-danger/30',
  Available: 'bg-ok/15 text-ok border-ok/30',
  'On Job': 'bg-signal/15 text-signal border-signal/30',
  'Off Duty': 'bg-ink-500/15 text-ink-500 border-ink-500/30',
}

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || 'bg-ink-500/15 text-ink-500 border-ink-500/30'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {status}
    </span>
  )
}
