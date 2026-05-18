import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear that field's error as user types
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Must contain at least one uppercase letter'
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Must contain at least one number'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const getStrength = () => {
    const p = form.password
    if (!p) return null
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400', width: 'w-1/3' }
    if (score <= 3) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-400', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-green-500', text: 'text-green-400', width: 'w-full' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength()

  const fields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password', placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: showPassword ? 'text' : 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-sky-400 mb-1">Create Account</h1>
        <p className="text-gray-500 mb-8 text-sm">Start your DSA journey</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {serverError && (
            <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm text-gray-400 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`input ${errors[name] ? 'border-red-500 focus:border-red-400' : ''}`}
                placeholder={placeholder}
              />
              {/* Password strength bar */}
              {name === 'password' && form.password && strength && (
                <div className="mt-1.5">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-0.5 ${strength.text}`}>{strength.label} password</p>
                </div>
              )}
              {/* Confirm password match indicator */}
              {name === 'confirmPassword' && form.confirmPassword && !errors.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs mt-0.5 text-green-400">✓ Passwords match</p>
              )}
              {errors[name] && (
                <p className="text-xs mt-0.5 text-red-400">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Show/hide password toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPassword ? 'Hide passwords' : 'Show passwords'}
          </button>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register