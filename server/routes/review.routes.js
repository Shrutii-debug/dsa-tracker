import express from 'express'
import { getDueProblems, startReview, submitReview, getAllReviews } from '../controllers/review.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect)

router.get('/due', getDueProblems)
router.get('/all', getAllReviews)
router.post('/:problemId', startReview)
router.patch('/:problemId/submit', submitReview)

export default router