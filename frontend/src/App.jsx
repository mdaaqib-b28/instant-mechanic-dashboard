import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import Analytics from './pages/Analytics'
import Bookings from './pages/Bookings'
import Mechanics from './pages/Mechanics'

export default function App() {
  return (
    <div className="flex min-h-screen bg-base-950">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-[1400px]">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/mechanics" element={<Mechanics />} />
        </Routes>
      </main>
    </div>
  )
}
