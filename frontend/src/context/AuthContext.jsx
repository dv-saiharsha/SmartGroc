import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null }
    case 'AUTH_FAILURE':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const user = await authService.getCurrentUser()
        dispatch({ type: 'AUTH_SUCCESS', payload: user })
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null })
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message })
      localStorage.removeItem('token')
    }
  }

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const { user, token } = await authService.login(email, password)
      localStorage.setItem('token', token)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const { user, token } = await authService.signup(userData)
      localStorage.setItem('token', token)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}