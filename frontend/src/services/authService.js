import api from './api'

// Mock users for demonstration (remove when backend is ready)
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@smartgrocer.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'AU'
  },
  {
    id: 2,
    email: 'user@smartgrocer.com',
    password: 'user123',
    name: 'John Doe',
    role: 'customer',
    avatar: 'JD'
  },
  {
    id: 3,
    email: 'seller@smartgrocer.com',
    password: 'seller123',
    name: 'Jane Smith',
    role: 'seller',
    avatar: 'JS'
  }
]

// Mock implementation for development
const mockAuth = {
  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`
    const { password: _, ...userWithoutPassword } = user
    
    // Store token in localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return {
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    }
  },

  async getCurrentUser() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const token = localStorage.getItem('token')
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('Invalid token')
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      throw new Error('User not found')
    }
    
    return user
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const authService = {
  async login(email, password) {
    try {
      // Try mock authentication first (for development)
      if (import.meta.env.VITE_USE_MOCK_AUTH !== 'false') {
        return await mockAuth.login(email, password)
      }
      
      // Real API call
      const response = await api.post('/auth/login', { email, password })
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
      }
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.message || 'Login failed')
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
      // Try mock authentication first (for development)
      if (import.meta.env.VITE_USE_MOCK_AUTH !== 'false') {
        return await mockAuth.getCurrentUser()
      }
      
      // Real API call
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
  },

  logout() {
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // In production, you might want to call an API endpoint to invalidate the token
    // await api.post('/auth/logout')
  }
}