import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalSolved: user.totalSolved,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const today = new Date().toDateString()
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastActive !== today) {
      if (lastActive === yesterday) {
        user.streak += 1
      } else {
        user.streak = 1
      }
      user.lastActiveDate = new Date()
      await user.save({ validateBeforeSave: false })
    }

    const token = signToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalSolved: user.totalSolved,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' })
  }
}

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      streak: req.user.streak,
      totalSolved: req.user.totalSolved,
      createdAt: req.user.createdAt,
    },
  })
}