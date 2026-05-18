import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const ProgressChart = ({ data = [] }) => {
  if (!data.length) return <p className="text-gray-500 text-sm">No data yet.</p>

  const chartData = data
    .map((d) => ({ name: d._id, total: d.total, solved: d.solved }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#e5e7eb' }}
          itemStyle={{ color: '#9ca3af' }}
        />
        <Bar dataKey="total" fill="#1e40af" radius={[4, 4, 0, 0]} name="Total" />
        <Bar dataKey="solved" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Solved" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ProgressChart