import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/analytics', label: 'Analytics' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/mechanics', label: 'Mechanics' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-base-700 bg-base-900 flex flex-col">
      <div className="px-5 py-6 border-b border-base-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal" />
          <span className="font-display text-2xl tracking-wide text-ink-100">
            INSTANT MECHANIC
          </span>
        </div>
        <p className="text-ink-500 text-xs mt-1">Operations Console</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-signal/15 text-signal border-l-2 border-signal'
                  : 'text-ink-300 border-l-2 border-transparent hover:bg-base-800 hover:text-ink-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-base-700">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
          Live — auto-refreshing
        </div>
      </div>
    </aside>
  )
}
