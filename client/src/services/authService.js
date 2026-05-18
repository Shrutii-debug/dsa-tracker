import api from './api'

// All auth-related API calls in one place
// Note: Most auth logic lives in AuthContext.jsx
// This file is for direct API calls if needed outside context

export const authService = {
  // Register a new user
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  // Login with email + password
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  // Get current logged-in user details
  getMe: () => api.get('/auth/me'),
}

export default authService