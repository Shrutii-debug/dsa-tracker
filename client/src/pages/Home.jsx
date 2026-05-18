import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiService } from '../services/problemService'
import { useAuth } from '../context/AuthContext'

const LANGUAGES = ['Python', 'Java', 'C++']
const PLATFORMS = ['LeetCode', 'GFG', 'Codeforces', 'HackerRank', 'Custom']

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [statement, setStatement] = useState('')
  const [language, setLanguage] = useState('Python')
  const [platform, setPlatform] = useState('LeetCode')
  const [platformLink, setPlatformLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!statement.trim()) return setError('Please paste a problem statement')
    setError('')
    setLoading(true)
    try {
      const { data } = await aiService.quickGenerate({
        originalStatement: statement,
        language,
        platform,
        platformLink,
      })
      navigate(`/problems/${data.problem._id}`)
    } catch (err) {
      const msg = err.response?.data?.message
      if (err.response?.status === 429) {
        setError('Gemini free quota exceeded. Try again later (resets daily).')
      } else {
        setError(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500">
          Paste any DSA problem and get a complete 14-section breakdown. Auto-organized by pattern.
        </p>
      </div>

      {/* Input card */}
      <div className="card space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Problem Statement</label>
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            className="input min-h-[180px] resize-y font-mono text-sm"
            placeholder="Paste the full problem statement here...

Example:
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="input"
            >
              {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Problem URL (optional)</label>
            <input
              type="url"
              value={platformLink}
              onChange={(e) => setPlatformLink(e.target.value)}
              className="input"
              placeholder="https://leetcode.com/..."
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !statement.trim()}
          className="btn-primary w-full py-3 text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating breakdown...
            </span>
          ) : (
            '⚡ Generate Full Breakdown'
          )}
        </button>

        <p className="text-xs text-center text-gray-600">
          Powered by Gemini 2.0 Flash · Free tier · ~15 sec generation time
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { label: 'Total Problems', value: user?.totalSolved ?? 0 },
          { label: 'Day Streak', value: `🔥 ${user?.streak ?? 0}` },
          { label: 'Sections / Problem', value: '14' },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-sky-400">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home