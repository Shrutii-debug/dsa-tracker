// SM-2 Spaced Repetition Algorithm (client-side utility)
// This mirrors the server-side logic in server/services/review.service.js
// Used for displaying next review info in the UI without hitting the API

// Map review labels to SM-2 quality scores (0-5 scale)
export const STATUS_TO_QUALITY = {
  Understood: 5,
  Shaky: 3,
  'Need to redo': 1,
}

// Calculate what the next review interval would be
// (preview only — actual calculation happens on the server)
export const previewNextInterval = (currentInterval, currentEaseFactor, status) => {
  const quality = STATUS_TO_QUALITY[status] ?? 3

  let interval = currentInterval ?? 1
  let easeFactor = currentEaseFactor ?? 2.5

  if (quality >= 3) {
    if (interval === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
  } else {
    interval = 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  return {
    interval,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    nextReviewDate: addDays(new Date(), interval),
  }
}

// Add N days to a date
export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Human-readable label for a date
export const formatReviewDate = (date) => {
  if (!date) return 'Not scheduled'
  const d = new Date(date)
  const now = new Date()
  const diffMs = d - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Due now'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 6) return `In ${diffDays} days`
  if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`
  return `In ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''}`
}

// Color class for a review status label
export const statusColor = (status) => {
  return {
    Understood: 'bg-green-900 text-green-300',
    Shaky: 'bg-yellow-900 text-yellow-300',
    'Need to redo': 'bg-red-900 text-red-300',
  }[status] ?? 'bg-gray-800 text-gray-400'
}

// Is a review overdue?
export const isOverdue = (nextReviewDate) => {
  if (!nextReviewDate) return false
  return new Date(nextReviewDate) < new Date()
}