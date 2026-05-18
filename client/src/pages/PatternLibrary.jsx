import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { problemService } from '../services/problemService'
import PatternBadge from '../components/PatternBadge'
import { difficultyClass } from '../utils/parseBreakdown'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const STATUS_OPTIONS = ['Unsolved', 'Attempted', 'Solved']
const PATTERN_LIST = [
  'Array', 'String', 'Two Pointers', 'Sliding Window', 'Prefix Sum',
  'Hash Map / Hash Set', 'Binary Search', 'Sorting', 'Recursion',
  'Dynamic Programming', 'Greedy', 'Stack', 'Queue / Deque', 'Linked List',
  'Tree', 'Binary Search Tree', 'Graph', 'BFS', 'DFS', 'Backtracking',
  'Heap / Priority Queue', 'Trie', 'Union Find', 'Bit Manipulation',
  'Math', 'Matrix', 'Monotonic Stack', 'Divide and Conquer', 'Other',
]

const PatternLibrary = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ pattern: '', difficulty: '', status: '', search: '' })

  const fetchProblems = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.pattern) params.pattern = filters.pattern
      if (filters.difficulty) params.difficulty = filters.difficulty
      if (filters.status) params.status = filters.status
      if (filters.search) params.search = filters.search
      const { data } = await problemService.getAll(params)
      setProblems(data.problems)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === prev[key] ? '' : value }))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Pattern Library</h1>
        <Link to="/" className="btn-primary text-sm py-1.5">+ New Problem</Link>
      </div>

      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
        className="input mb-4"
        placeholder="Search by title or tag..."
      />

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Pattern</p>
          <div className="flex flex-wrap gap-1.5">
            {PATTERN_LIST.map((p) => (
              <button
                key={p}
                onClick={() => setFilter('pattern', p)}
                className={`badge cursor-pointer transition-colors ${
                  filters.pattern === p ? 'badge-pattern' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setFilter('difficulty', d)}
              className={`badge cursor-pointer ${filters.difficulty === d ? difficultyClass(d) : 'bg-gray-800 text-gray-400'}`}>
              {d}
            </button>
          ))}
          {STATUS_OPTIONS.map((s) => (
            <button key={s} onClick={() => setFilter('status', s)}
              className={`badge cursor-pointer ${filters.status === s ? 'bg-sky-900 text-sky-300' : 'bg-gray-800 text-gray-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full" />
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No problems found.</p>
          <Link to="/" className="text-sky-400 text-sm hover:underline mt-2 block">Add your first problem →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {problems.map((p) => (
            <Link key={p._id} to={`/problems/${p._id}`}
              className="card flex items-center gap-3 hover:border-gray-700 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`badge ${difficultyClass(p.difficulty)}`}>{p.difficulty}</span>
                  <PatternBadge pattern={p.pattern} />
                  {p.status === 'Solved' && <span className="badge bg-green-900 text-green-300">✓ Solved</span>}
                </div>
                <span className="text-gray-200 font-medium truncate block">{p.title}</span>
              </div>
              <span className="text-gray-600 text-sm flex-shrink-0">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatternLibrary