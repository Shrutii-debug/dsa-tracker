import { useState, useEffect, useCallback } from 'react'
import { reviewService } from '../services/problemService'
import ReviewCard from '../components/ReviewCard'

const ReviewQueue = () => {
  const [reviews, setReviews] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('due')

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const [dueRes, allRes] = await Promise.all([
        reviewService.getDue(),
        reviewService.getAll()
      ])
      setReviews(dueRes.data.reviews)
      setAllReviews(allRes.data.reviews)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmit = async (problemId, status) => {
    try {
      await reviewService.submit(problemId, status)
      setReviews((prev) => prev.filter((r) => r.problem?._id !== problemId))
      fetchReviews()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  const displayed = tab === 'due' ? reviews : allReviews

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Review Queue</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reviews.length} problem{reviews.length !== 1 ? 's' : ''} due today
          </p>
        </div>
        {reviews.length > 0 && (
          <span className="bg-red-900 text-red-200 text-sm font-bold px-3 py-1 rounded-full">
            {reviews.length} due
          </span>
        )}
      </div>

      <div className="flex gap-1 mb-4">
        {[
          { key: 'due', label: `Due Now (${reviews.length})` },
          { key: 'all', label: `All Tracked (${allReviews.length})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-sky-900 text-sky-200' : 'text-gray-400 hover:bg-gray-900'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">{tab === 'due' ? '🎉' : '📭'}</p>
          <p className="text-gray-400 font-medium">
            {tab === 'due' ? "You're all caught up!" : 'No problems tracked yet.'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {tab === 'due' ? 'No reviews due. Come back tomorrow.' : 'Use Blind Mode on any problem to start tracking it.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((review) => (
            <ReviewCard key={review._id} review={review} onSubmit={handleSubmit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewQueue