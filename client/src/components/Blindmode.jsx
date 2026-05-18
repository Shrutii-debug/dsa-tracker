import { useState, useEffect, useRef } from 'react'
import { reviewService } from '../services/problemService'

const BlindMode = ({ problemId, breakdown }) => {
  const [active, setActive] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const intervalRef = useRef(null)

  const startAttempt = () => {
    setActive(true)
    setRevealed(false)
    setSeconds(0)
    setSubmitted(false)
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
  }

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const handleReveal = () => {
    stopTimer()
    setRevealed(true)
  }

  const handleSubmit = async (status) => {
    try {
      await reviewService.submit(problemId, status)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => () => stopTimer(), [])

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (!active) {
    return (
      <div className="card text-center py-8">
        <p className="text-4xl mb-3">🕶️</p>
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Blind Mode</h3>
        <p className="text-gray-500 text-sm mb-4">
          Try to solve the problem on your own before looking at the breakdown.
        </p>
        <button onClick={startAttempt} className="btn-primary">
          Start Attempt
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-200">🕶️ Blind Mode</h3>
        <span className="font-mono text-sky-400 text-lg">{formatTime(seconds)}</span>
      </div>

      {!revealed ? (
        <div className="text-center py-6">
          <p className="text-gray-400 mb-4">Breakdown is hidden. Solve it yourself!</p>
          <p className="text-gray-500 text-sm mb-6">Open LeetCode / paper and attempt the solution.</p>
          <button onClick={handleReveal} className="btn-secondary">
            Reveal Breakdown
          </button>
        </div>
      ) : submitted ? (
        <div className="text-center py-4 text-green-400">
          ✓ Review scheduled! Keep it up.
        </div>
      ) : (
        <div>
          <p className="text-gray-400 text-sm mb-3">Time taken: {formatTime(seconds)}</p>
          <p className="text-gray-300 mb-3 font-medium">How did it go?</p>
          <div className="grid grid-cols-3 gap-2">
            {['Understood', 'Shaky', 'Need to redo'].map((status) => (
              <button
                key={status}
                onClick={() => handleSubmit(status)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  status === 'Understood'
                    ? 'bg-green-900 hover:bg-green-800 text-green-200'
                    : status === 'Shaky'
                    ? 'bg-yellow-900 hover:bg-yellow-800 text-yellow-200'
                    : 'bg-red-900 hover:bg-red-800 text-red-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlindMode