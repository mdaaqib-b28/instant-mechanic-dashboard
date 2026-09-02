import MechanicsList from '../components/MechanicsList'

export default function Mechanics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink-100">Mechanics</h1>
        <p className="text-ink-500 text-sm mt-1">Current status and workload across the field team.</p>
      </div>
      <MechanicsList />
    </div>
  )
}
