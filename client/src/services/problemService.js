import api from './api'

export const problemService = {
  getAll: (filters = {}) => api.get('/problems', { params: filters }),
  getOne: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems', data),
  update: (id, data) => api.patch(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
  addBlindAttempt: (id, data) => api.post(`/problems/${id}/blind-attempt`, data),
  getDashboard: () => api.get('/problems/stats/dashboard'),
}

export const aiService = {
  quickGenerate: (data) => api.post('/ai/quick-generate', data),
  generateForProblem: (problemId, data) => api.post(`/ai/generate/${problemId}`, data),
}

export const reviewService = {
  getDue: () => api.get('/reviews/due'),
  getAll: () => api.get('/reviews/all'),
  start: (problemId) => api.post(`/reviews/${problemId}`),
  submit: (problemId, status) => api.patch(`/reviews/${problemId}/submit`, { status }),
}