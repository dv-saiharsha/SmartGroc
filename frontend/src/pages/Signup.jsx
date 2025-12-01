import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { 
  Eye, 
  EyeOff, 
  CheckCircle2,
  X
} from 'lucide-react'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signup, isAuthenticated, error } = useAuth()
  const navigate = useNavigate()
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }
    
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
      await signup({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password
      })
    } catch (err) {
      console.error('Signup failed:', err)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-8">
      <div className="w-full max-w-md mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-black flex items-center justify-center shadow-lg" style={{borderRadius: '16px'}}>
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">SmartGrocer</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Sign up
          </h1>
          <p className="text-gray-600 text-lg">
            Create your account to get started
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white p-8 shadow-2xl border border-gray-100" style={{borderRadius: '24px'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 flex items-center space-x-3" style={{borderRadius: '12px'}}>
                <div className="w-6 h-6 bg-red-500 flex items-center justify-center" style={{borderRadius: '50%'}}>
                  <X className="h-4 w-4 text-white" />
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-800">
                Name
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`px-4 py-4 text-base w-full focus:outline-none transition-all duration-200 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'bg-red-50 ring-2 ring-red-400' : ''}`}
                  style={{borderRadius: '12px'}}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <X className="h-4 w-4" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`px-4 py-4 text-base w-full focus:outline-none transition-all duration-200 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 ${errors.email ? 'bg-red-50 ring-2 ring-red-400' : ''}`}
                  style={{borderRadius: '12px'}}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {formData.email && !errors.email && formData.email.includes('@') && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <X className="h-4 w-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`px-4 py-4 pr-12 text-base w-full focus:outline-none transition-all duration-200 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 ${errors.password ? 'bg-red-50 ring-2 ring-red-400' : ''}`}
                  style={{borderRadius: '12px'}}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <X className="h-4 w-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.fullName || !formData.email || !formData.password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-base py-4 px-6 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              style={{borderRadius: '12px'}}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Sign Up */}
            <Button
              type="button"
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium text-base py-4 px-6 transition-all duration-200 flex items-center justify-center space-x-3"
              style={{borderRadius: '12px'}}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign up with Google</span>
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup