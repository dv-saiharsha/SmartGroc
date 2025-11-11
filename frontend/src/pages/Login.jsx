import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const { login, isAuthenticated, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/'

  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await login(formData.email, formData.password, rememberMe)
      // Navigation will be handled by the useEffect hook
    } catch (err) {
      setErrors({ 
        submit: err.message || 'An error occurred during login. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Demo accounts for testing
  const demoAccounts = [
    { 
      email: 'customer@smartgrocer.com', 
      password: 'demo123', 
      role: 'Customer',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    { 
      email: 'seller@smartgrocer.com', 
      password: 'demo123', 
      role: 'Seller',
      icon: TrendingUp,
      color: 'bg-green-500'
    }
  ]

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    })
    setErrors({})
    if (error) clearError()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your SmartGrocer account to continue shopping
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm font-medium mb-3 text-center">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account, index) => {
                const IconComponent = account.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoAccount(account)}
                    className="flex items-center gap-2 p-3 h-auto"
                  >
                    <div className={`w-6 h-6 ${account.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs">{account.role}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Global Error */}
              {(errors.submit || error) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit || error}</AlertDescription>
                </Alert>
              )}

              {/* Redirect Message */}
              {location.state?.from && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Please sign in to access {location.state.from.pathname}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/5 to-primary/20 relative overflow-hidden">
        <div className="flex items-center justify-center w-full p-12">
          <div className="max-w-lg text-center space-y-8">
            {/* Hero Content */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-foreground">
                Smart Shopping Made Simple
              </h3>
              <p className="text-lg text-muted-foreground">
                Join thousands of satisfied customers who trust SmartGrocer for their daily needs
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Fresh Quality</h4>
                  <p className="text-sm text-muted-foreground">Farm-fresh products delivered daily</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Best Prices</h4>
                  <p className="text-sm text-muted-foreground">Competitive pricing with amazing deals</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Trusted Community</h4>
                  <p className="text-sm text-muted-foreground">Join 50,000+ happy customers</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default Login