import { Link } from 'react-router-dom'
import { difficultyClass, formatNextReview } from '../utils/parseBreakdown'
import PatternBadge from './Patternbadge'

const ReviewCard = ({ review, onSubmit }) => {
  const { problem, nextReviewDate, lastStatus, interval } = review

  if (!problem) return null

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`badge ${difficultyClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <PatternBadge pattern={problem.pattern} />
          {lastStatus && (
            <span className={`badge text-xs ${
              lastStatus === 'Understood' ? 'bg-green-900 text-green-300' :
              lastStatus === 'Shaky' ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              Last: {lastStatus}
            </span>
          )}
        </div>
        <Link
          to={`/problems/${problem._id}`}
          className="text-gray-200 font-medium hover:text-sky-400 transition-colors truncate block"
        >
          {problem.title}
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">{formatNextReview(nextReviewDate)}</p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {['Understood', 'Shaky', 'Need to redo'].map((status) => (
          <button
            key={status}
            onClick={() => onSubmit(problem._id, status)}
            className={`text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
              status === 'Understood'
                ? 'bg-green-900 hover:bg-green-800 text-green-200'
                : status === 'Shaky'
                ? 'bg-yellow-900 hover:bg-yellow-800 text-yellow-200'
                : 'bg-red-900 hover:bg-red-800 text-red-200'
            }`}
          >
            {status === 'Understood' ? '✓' : status === 'Shaky' ? '~' : '✗'}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ReviewCard