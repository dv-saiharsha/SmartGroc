import api from './api'

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed')
    }
  },

  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Signup failed')
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user')
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Token refresh failed')
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Password reset failed')
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Password reset failed')
    }
  },

  async googleLogin(token) {
    try {
      const response = await api.post('/auth/google', { token })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Google login failed')
    }
  }
}