import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle
} from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { login, isAuthenticated, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      await login(formData.email, formData.password)
    } catch (err) {
      console.error('Login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12">
      <div className="w-full mx-auto px-4 sm:px-6" style={{maxWidth: 'min(95%, 28rem)'}}>
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center" style={{borderRadius: '25px'}}>
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-black">SmartGrocer</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 shadow-xl" style={{borderRadius: '25px'}}>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-gray-100 border-2 border-gray-300 p-4 flex items-center space-x-3" style={{borderRadius: '25px'}}>
                <AlertCircle className="h-6 w-6 text-gray-600 flex-shrink-0" />
                <p className="text-gray-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`pl-12 pr-4 text-base border-2 py-3 w-full focus:outline-none focus:border-black transition-colors bg-white ${errors.email ? 'border-gray-400 bg-gray-100' : 'border-gray-300'}`}
                  style={{borderRadius: '5px'}}
                />
              </div>
              {errors.email && (
                <p className="text-gray-700 text-sm font-medium bg-gray-100 p-2 border-l-4 border-gray-400" style={{borderRadius: '5px'}}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`pl-12 pr-12 text-base border-2 py-3 w-full focus:outline-none focus:border-black transition-colors bg-white ${errors.password ? 'border-gray-400 bg-gray-100' : 'border-gray-300'}`}
                  style={{borderRadius: '5px'}}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-gray-700 text-sm font-medium bg-gray-100 p-2 border-l-4 border-gray-400" style={{borderRadius: '5px'}}>{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium text-base py-3 px-6 transition-colors"
              style={{borderRadius: '25px'}}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 shadow-sm" style={{borderRadius: '25px'}}>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h3>
          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Email:</strong> demo@smartgrocer.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login