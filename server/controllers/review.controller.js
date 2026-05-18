import Review from '../models/Review.model.js'
import Problem from '../models/Problem.model.js'
import { calculateNextReview, getDueReviews } from '../services/review.service.js'

export const getDueProblems = async (req, res, next) => {
  try {
    const reviews = await getDueReviews(req.user._id)
    res.status(200).json({ success: true, count: reviews.length, reviews })
  } catch (error) {
    next(error)
  }
}

export const startReview = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.problemId, user: req.user._id })

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    const existing = await Review.findOne({ user: req.user._id, problem: req.params.problemId })
    if (existing) {
      return res.status(200).json({ success: true, review: existing, message: 'Already tracking' })
    }

    const review = await Review.create({
      user: req.user._id,
      problem: req.params.problemId,
      nextReviewDate: new Date(),
    })

    res.status(201).json({ success: true, review })
  } catch (error) {
    next(error)
  }
}

export const submitReview = async (req, res, next) => {
  try {
    const { status } = req.body

    if (!['Understood', 'Shaky', 'Need to redo'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    let review = await Review.findOne({ user: req.user._id, problem: req.params.problemId })
    if (!review) {
      review = await Review.create({ user: req.user._id, problem: req.params.problemId })
    }

    const updates = calculateNextReview(review, status)

    review.reviewHistory.push({
      date: new Date(),
      quality: updates.lastQuality,
      status,
      interval: updates.interval,
    })

    Object.assign(review, updates)
    await review.save()

    res.status(200).json({
      success: true,
      review,
      message: `Next review in ${updates.interval} day${updates.interval === 1 ? '' : 's'}`,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('problem', 'title pattern difficulty status')
      .sort('nextReviewDate')
      .lean()

    res.status(200).json({ success: true, reviews })
  } catch (error) {
    next(error)
  }
}