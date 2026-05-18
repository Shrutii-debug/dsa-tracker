import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    interval: {
      type: Number,
      default: 1,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    lastQuality: {
      type: Number,
      default: null,
    },
    lastStatus: {
      type: String,
      enum: ['Understood', 'Shaky', 'Need to redo', null],
      default: null,
    },
    reviewHistory: [
      {
        date: { type: Date, default: Date.now },
        quality: Number,
        status: String,
        interval: Number,
      },
    ],
  },
  { timestamps: true }
)

reviewSchema.index({ user: 1, nextReviewDate: 1 })
reviewSchema.index({ user: 1, problem: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)