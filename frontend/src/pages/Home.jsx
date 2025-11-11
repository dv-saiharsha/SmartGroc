import { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { 
  ShoppingBag, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Users,
  Package,
  Sparkles
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { label: "Happy Customers", value: "50K+", icon: <Users className="h-5 w-5" /> },
    { label: "Products", value: "10K+", icon: <Package className="h-5 w-5" /> },
    { label: "Trusted Sellers", value: "500+", icon: <Star className="h-5 w-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Shield className="h-5 w-5" /> }
  ]

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Shopping",
      description: "Smart recommendations tailored to your preferences"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Reliable",
      description: "Bank-grade security with 99.9% uptime guarantee"  
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Fast Delivery", 
      description: "Fresh groceries delivered in 30 minutes or less"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-green-400/5 to-green-200/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-400/20 to-green-300/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge variant="secondary" className="glass px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Platform
              </Badge>
            </div>

            {/* Main Heading */}
            <div className={`mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Smart Grocery Shopping
                <br />
                <span className="gradient-text-forest">Made Simple</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the future of grocery shopping with intelligent recommendations and seamless ordering
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg shadow-lg hover-lift">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button variant="outline" size="lg" className="glass px-8 py-3 rounded-lg border-white/20 hover:bg-white/10">
                <Sparkles className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                ✅ NEW ENHANCED UI IS LOADING! ✅
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/60 backdrop-blur-sm border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SmartGrocer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience powerful features designed to revolutionize your grocery shopping and selling journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`glass hover-lift border-white/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${1200 + index * 200}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-green-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Shopping?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and experience the future of grocery shopping today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg shadow-lg hover-lift">
                <Link to="/products">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <Button variant="outline" size="lg" asChild className="px-8 py-3 rounded-lg">
                  <Link to="/login">
                    Get Started Free
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home