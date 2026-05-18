import express from 'express'
import { generateProblemBreakdown, quickGenerate } from '../controllers/ai.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect)

router.post('/quick-generate', quickGenerate)
router.post('/generate/:problemId', generateProblemBreakdown)

export default router