export default function StatCard({ label, value, accent = 'default', suffix = '' }) {
  const accentClass = {
    default: 'text-ink-100',
    signal: 'text-signal',
    ok: 'text-ok',
    warn: 'text-warn',
    danger: 'text-danger',
  }[accent]

  return (
    <div className="panel px-5 py-4">
      <p className="data-label">{label}</p>
      <p className={`font-display text-4xl leading-tight mt-1 mono-num ${accentClass}`}>
        {value}
        {suffix && <span className="text-lg ml-1 text-ink-500">{suffix}</span>}
      </p>
    </div>
  )
}
