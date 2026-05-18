import Problem from '../models/Problem.model.js'
import { generateBreakdown } from '../services/gemini.service.js'
import { PATTERNS, DIFFICULTIES } from '../config/constants.js'

export const generateProblemBreakdown = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.problemId, user: req.user._id })

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' })
    }

    if (problem.hasBreakdown && !req.body.force) {
      return res.status(200).json({
        success: true,
        message: 'Breakdown already exists. Pass force: true to regenerate.',
        problem,
      })
    }

    const language = req.body.language || problem.preferredLanguage || 'Python'
    const { sections, meta } = await generateBreakdown(problem.originalStatement, language)

    const updates = {
      breakdown: sections,
      hasBreakdown: true,
      preferredLanguage: language,
    }

    if (meta) {
      if (meta.detectedPattern && PATTERNS.includes(meta.detectedPattern)) updates.pattern = meta.detectedPattern
      if (meta.secondaryPatterns) updates.secondaryPatterns = meta.secondaryPatterns.filter((p) => PATTERNS.includes(p))
      if (meta.difficulty && DIFFICULTIES.includes(meta.difficulty)) updates.difficulty = meta.difficulty
      if (meta.title && problem.title === 'Untitled Problem') updates.title = meta.title
      if (meta.tags) updates.tags = meta.tags
    }

    const updated = await Problem.findByIdAndUpdate(problem._id, updates, { new: true })

    res.status(200).json({ success: true, problem: updated })
  } catch (error) {
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({
        success: false,
        message: 'Gemini API quota exceeded. Free tier allows 1500 requests/day. Please try again later.',
      })
    }
    next(error)
  }
}

export const quickGenerate = async (req, res, next) => {
  try {
    const { originalStatement, platform, platformLink, language = 'Python' } = req.body

    if (!originalStatement) {
      return res.status(400).json({ success: false, message: 'Problem statement is required' })
    }

    const problem = await Problem.create({
      user: req.user._id,
      title: 'Generating...',
      originalStatement,
      platform: platform || 'LeetCode',
      platformLink: platformLink || '',
      preferredLanguage: language,
    })

    const { sections, meta } = await generateBreakdown(originalStatement, language)

    const updates = { breakdown: sections, hasBreakdown: true }

    if (meta) {
      if (meta.detectedPattern && PATTERNS.includes(meta.detectedPattern)) updates.pattern = meta.detectedPattern
      if (meta.secondaryPatterns) updates.secondaryPatterns = meta.secondaryPatterns.filter((p) => PATTERNS.includes(p))
      if (meta.difficulty && DIFFICULTIES.includes(meta.difficulty)) updates.difficulty = meta.difficulty
      if (meta.title) updates.title = meta.title
      if (meta.tags) updates.tags = meta.tags
    }

    const updated = await Problem.findByIdAndUpdate(problem._id, updates, { new: true })

    res.status(201).json({ success: true, problem: updated })
  } catch (error) {
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({
        success: false,
        message: 'Gemini API quota exceeded. Please try again later.',
      })
    }
    next(error)
  }
}