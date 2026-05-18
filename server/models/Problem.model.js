import mongoose from 'mongoose'
import { PATTERNS, DIFFICULTIES, PLATFORMS, STATUS } from '../config/constants.js'

const sectionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { _id: false }
)

const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    originalStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      default: 'LeetCode',
    },
    platformLink: {
      type: String,
      default: '',
    },
    pattern: {
      type: String,
      enum: PATTERNS,
      default: 'Other',
    },
    secondaryPatterns: [
      {
        type: String,
        enum: PATTERNS,
      },
    ],
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'Medium',
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'Unsolved',
    },
    tags: [String],
    preferredLanguage: {
      type: String,
      enum: ['Java', 'Python', 'C++'],
      default: 'Python',
    },
    breakdown: [sectionSchema],
    notes: {
      type: String,
      default: '',
    },
    approachNote: {
      type: String,
      default: '',
    },
    blindAttempts: [
      {
        date: { type: Date, default: Date.now },
        solved: Boolean,
        timeTaken: Number,
      },
    ],
    hasBreakdown: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

problemSchema.index({ user: 1, pattern: 1 })
problemSchema.index({ user: 1, difficulty: 1 })
problemSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Problem', problemSchema)