import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'

const COLORS = ['#FF8A33', '#3E8E8A', '#5B7B9A', '#4CAF6D', '#E5B84C', '#E5484D', '#8A8F9B']

const tooltipStyle = {
  background: '#1B1E24',
  border: '1px solid #3B404C',
  borderRadius: 6,
  fontSize: 12,
  color: '#F3F4F6',
}

export function BookingsOverTimeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF8A33" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#FF8A33" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2E323C" vertical={false} />
        <XAxis dataKey="date" stroke="#8A8F9B" fontSize={11} tickLine={false} />
        <YAxis stroke="#8A8F9B" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="bookings" stroke="#FF8A33" fill="url(#bookingsGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RevenueOverTimeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E8E8A" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3E8E8A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2E323C" vertical={false} />
        <XAxis dataKey="date" stroke="#8A8F9B" fontSize={11} tickLine={false} />
        <YAxis stroke="#8A8F9B" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
        <Area type="monotone" dataKey="revenue" stroke="#3E8E8A" fill="url(#revenueGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function StatusPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1B1E24" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CategoryBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2E323C" horizontal={false} />
        <XAxis type="number" stroke="#8A8F9B" fontSize={11} />
        <YAxis type="category" dataKey="category" stroke="#8A8F9B" fontSize={11} width={110} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="#5B7B9A" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
