import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { problemService } from '../services/problemService'
import BreakdownCard from '../components/Breakdowncard'
import BlindMode from '../components/Blindmode'
import PatternBadge from '../components/Patternbadge'
import { difficultyClass } from '../utils/parseBreakdown'

const STATUS_OPTIONS = ['Unsolved', 'Attempted', 'Solved']

const ProblemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('breakdown')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchProblem = useCallback(async () => {
    try {
      const { data } = await problemService.getOne(id)
      setProblem(data.problem)
      setNotes(data.problem.notes || '')
    } catch {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    fetchProblem()
  }, [fetchProblem])

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      await problemService.update(id, { notes })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (status) => {
    const updated = await problemService.update(id, { status })
    setProblem(updated.data.problem)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this problem and its breakdown?')) return
    setDeleting(true)
    try {
      await problemService.delete(id)
      navigate('/patterns')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!problem) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`badge ${difficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
              <PatternBadge pattern={problem.pattern} />
              {problem.secondaryPatterns?.map((p) => <PatternBadge key={p} pattern={p} />)}
              {problem.tags?.map((tag) => (
                <span key={tag} className="badge bg-gray-800 text-gray-400">{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-100">{problem.title}</h1>
            {problem.platformLink && (
              <a href={problem.platformLink} target="_blank" rel="noopener noreferrer"
                className="text-sm text-sky-400 hover:underline mt-1 block">
                ↗ {problem.platform} Link
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select value={problem.status} onChange={(e) => handleStatusChange(e.target.value)}
              className="input text-sm w-auto">
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm py-1.5">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-800">
        {[
          { key: 'breakdown', label: '📖 Breakdown' },
          { key: 'notes', label: '📝 My Notes' },
          { key: 'blind', label: '🕶️ Blind Mode' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === key ? 'border-sky-400 text-sky-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'breakdown' && <BreakdownCard breakdown={problem.breakdown} />}

      {tab === 'notes' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Your Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              className="input min-h-[200px] resize-y"
              placeholder="Write your understanding, key insights, what clicked for you..." />
          </div>
          <button onClick={handleSaveNotes} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      )}

      {tab === 'blind' && <BlindMode problemId={id} breakdown={problem.breakdown} />}
    </div>
  )
}

export default ProblemDetail