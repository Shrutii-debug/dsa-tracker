import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import errorHandler from './middleware/error.middleware.js'

dotenv.config()

const app = express()

connectDB()

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [])
  : ['http://localhost:5173']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'DSA Tracker API is running' })
})

// Routes
import authRoutes from './routes/auth.routes.js'
import problemRoutes from './routes/problem.routes.js'
import aiRoutes from './routes/ai.routes.js'
import reviewRoutes from './routes/review.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/reviews', reviewRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// FIX: In Express 5, app.use(errorHandler) doesn't reliably detect
// the 4-param signature as error middleware. Wrapping it explicitly works.
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})