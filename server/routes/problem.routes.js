import express from 'express'
import {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  addBlindAttempt,
  getDashboardStats,
} from '../controllers/problem.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect)

router.get('/stats/dashboard', getDashboardStats)
router.route('/').get(getProblems).post(createProblem)
router.route('/:id').get(getProblem).patch(updateProblem).delete(deleteProblem)
router.post('/:id/blind-attempt', addBlindAttempt)

export default router