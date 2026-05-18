import Review from '../models/Review.model.js'

const STATUS_TO_QUALITY = {
  Understood: 5,
  Shaky: 3,
  'Need to redo': 1,
}

export const calculateNextReview = (review, status) => {
  const quality = STATUS_TO_QUALITY[status] ?? 3
  let { interval, easeFactor, repetitions } = review

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    interval,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    repetitions,
    nextReviewDate,
    lastQuality: quality,
    lastStatus: status,
  }
}

export const getDueReviews = async (userId) => {
  const now = new Date()
  return await Review.find({
    user: userId,
    nextReviewDate: { $lte: now },
  })
    .populate('problem', 'title pattern difficulty status')
    .sort({ nextReviewDate: 1 })
}

export { STATUS_TO_QUALITY }