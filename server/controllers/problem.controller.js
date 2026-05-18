import Problem from '../models/Problem.model.js'
import Review from '../models/Review.model.js'
import User from '../models/User.model.js'

export const getProblems = async (req, res, next) => {
  try {
    const { pattern, difficulty, status, search, sort = '-createdAt' } = req.query

    const filter = { user: req.user._id }

    if (pattern) filter.pattern = pattern
    if (difficulty) filter.difficulty = difficulty
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const problems = await Problem.find(filter)
      .select('-breakdown -originalStatement')
      .sort(sort)
      .lean()

    const stats = await Problem.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$pattern',
          count: { $sum: 1 },
          solved: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } },
        },
      },
    ])

    res.status(200).json({ success: true, count: problems.length, problems, stats })
  } catch (error) {
    next(error)
  }
}

export const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, user: req.user._id })

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    res.status(200).json({ success: true, problem })
  } catch (error) {
    next(error)
  }
}

export const createProblem = async (req, res, next) => {
  try {
    const { title, originalStatement, platform, platformLink, preferredLanguage } = req.body

    if (!originalStatement) {
      return res.status(400).json({ success: false, message: 'Problem statement is required' })
    }

    const problem = await Problem.create({
      user: req.user._id,
      title: title || 'Untitled Problem',
      originalStatement,
      platform: platform || 'LeetCode',
      platformLink: platformLink || '',
      preferredLanguage: preferredLanguage || 'Python',
    })

    res.status(201).json({ success: true, problem })
  } catch (error) {
    next(error)
  }
}

export const updateProblem = async (req, res, next) => {
  try {
    const allowed = ['notes', 'approachNote', 'status', 'pattern', 'difficulty', 'title', 'platformLink', 'tags']
    const updates = {}

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    )

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    if (req.body.status === 'Solved') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalSolved: 1 } })
    }

    res.status(200).json({ success: true, problem })
  } catch (error) {
    next(error)
  }
}

export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    await Review.deleteOne({ problem: req.params.id, user: req.user._id })

    res.status(200).json({ success: true, message: 'Problem deleted' })
  } catch (error) {
    next(error)
  }
}

export const addBlindAttempt = async (req, res, next) => {
  try {
    const { solved, timeTaken } = req.body

    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $push: {
          blindAttempts: { solved, timeTaken, date: new Date() },
        },
      },
      { new: true }
    )

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    res.status(200).json({ success: true, problem })
  } catch (error) {
    next(error)
  }
}

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id

    const [patternStats, difficultyStats, recentProblems, totalCount] = await Promise.all([
      Problem.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$pattern',
            total: { $sum: 1 },
            solved: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Problem.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]),
      Problem.find({ user: userId })
        .select('title pattern difficulty status createdAt')
        .sort('-createdAt')
        .limit(5)
        .lean(),
      Problem.countDocuments({ user: userId }),
    ])

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        byPattern: patternStats,
        byDifficulty: difficultyStats,
        recentProblems,
        streak: req.user.streak,
        totalSolved: req.user.totalSolved,
      },
    })
  } catch (error) {
    next(error)
  }
}