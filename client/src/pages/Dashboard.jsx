import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { problemService } from '../services/problemService'
import ProgressChart from '../components/ProgressChart'
import PatternBadge from '../components/PatternBadge'
import { difficultyClass } from '../utils/parseBreakdown'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    problemService.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  const weakPatterns = (stats?.byPattern || [])
    .filter((p) => p.total > 0)
    .map((p) => ({ ...p, solveRate: p.solved / p.total }))
    .sort((a, b) => a.solveRate - b.solveRate)
    .slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Dashboard</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Problems', value: stats?.total ?? 0, color: 'text-sky-400' },
          { label: 'Solved', value: stats?.totalSolved ?? user?.totalSolved ?? 0, color: 'text-green-400' },
          { label: 'Day Streak', value: `🔥 ${user?.streak ?? 0}`, color: 'text-yellow-400' },
          { label: 'Patterns Covered', value: stats?.byPattern?.length ?? 0, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-200 mb-4">Problems by Pattern</h2>
        <ProgressChart data={stats?.byPattern || []} />
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 justify-center">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-800 inline-block" /> Total</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-400 inline-block" /> Solved</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak patterns */}
        <div className="card">
          <h2 className="font-semibold text-gray-200 mb-3">⚠️ Weak Patterns</h2>
          {weakPatterns.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet — add some problems!</p>
          ) : (
            <div className="space-y-2">
              {weakPatterns.map((p) => (
                <div key={p._id} className="flex items-center justify-between">
                  <PatternBadge pattern={p._id} />
                  <span className="text-sm text-gray-400">
                    {p.solved}/{p.total} solved ({Math.round(p.solveRate * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent problems */}
        <div className="card">
          <h2 className="font-semibold text-gray-200 mb-3">🕐 Recently Added</h2>
          {!stats?.recentProblems?.length ? (
            <p className="text-gray-500 text-sm">No problems yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentProblems.map((p) => (
                <Link
                  key={p._id}
                  to={`/problems/${p._id}`}
                  className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  <span className="text-gray-200 text-sm truncate flex-1">{p.title}</span>
                  <span className={`badge ${difficultyClass(p.difficulty)} ml-2 flex-shrink-0`}>
                    {p.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/patterns" className="text-xs text-sky-400 hover:underline mt-3 block">
            View all problems →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard