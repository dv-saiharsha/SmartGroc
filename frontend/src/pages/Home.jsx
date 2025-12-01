import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const [location, setLocation] = useState('Enter your location')
  const [searchQuery, setSearchQuery] = useState('')

  const features = [
    {
      icon: <i className="fas fa-truck-fast text-4xl text-gray-800"></i>,
      title: "Fast Delivery",
      description: "Get your groceries delivered in 30 minutes"
    },
    {
      icon: <i className="fas fa-shield-check text-4xl text-gray-800"></i>,
      title: "Quality Guaranteed",
      description: "Fresh products with 100% quality assurance"
    },
    {
      icon: <i className="fas fa-leaf text-4xl text-gray-800"></i>,
      title: "Fresh & Organic",
      description: "Sourced directly from local farms"
    }
  ]

  const categories = [
    {
      name: "Fresh Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop",
      count: "200+ items",
      link: "/products?category=vegetables",
      color: "from-green-400 to-emerald-600"
    },
    {
      name: "Fresh Fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
      count: "150+ items", 
      link: "/products?category=fruits",
      color: "from-red-400 to-rose-600"
    },
    {
      name: "Dairy Products",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
      count: "80+ items",
      link: "/products?category=dairy",
      color: "from-blue-400 to-indigo-600"
    },
    {
      name: "Bakery Items",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
      count: "60+ items",
      link: "/products?category=bakery",
      color: "from-amber-400 to-orange-600"
    },
    {
      name: "Meat & Seafood",
      image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
      count: "90+ items",
      link: "/products?category=meat",
      color: "from-cyan-400 to-blue-600"
    },
    {
      name: "Pantry Essentials",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      count: "300+ items",
      link: "/products?category=pantry",
      color: "from-purple-400 to-violet-600"
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center py-12 sm:py-16 lg:py-20"
        style={{
          backgroundImage: 'url(/images/veg-basket.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" style={{borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px'}}></div>
        
        <div className="w-full relative z-10">
          <div className="max-w-[95%] mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-white drop-shadow-lg">
                Fresh groceries delivered to your{' '}
                <span className="text-white">doorstep</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white mb-8 sm:mb-10 leading-relaxed drop-shadow-lg max-w-xl">
                Shop from the best local stores and get everything delivered fresh, fast, and reliable.
              </p>

              {/* Location and Search */}
              <div className="space-y-4 max-w-lg">
                {/* Location Input */}
                <div className="flex items-center bg-white p-4 shadow-lg transition-shadow hover:shadow-xl" style={{borderRadius: '25px'}}>
                  <i className="fas fa-location-dot text-gray-800 text-lg mr-3 flex-shrink-0"></i>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 text-gray-700 bg-transparent outline-none"
                    placeholder="Enter your delivery location"
                  />
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex items-center bg-white p-4 shadow-lg transition-shadow hover:shadow-xl" style={{borderRadius: '25px'}}>
                  <i className="fas fa-magnifying-glass text-gray-400 text-lg mr-3"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-gray-700 bg-transparent outline-none"
                    placeholder="Search for products..."
                  />
                  <Button type="submit" className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 ml-3 transition-colors" style={{borderRadius: '25px'}}>
                    <i className="fas fa-magnifying-glass mr-2"></i>
                    Search
                  </Button>
                </form>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose SmartGrocer?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're committed to providing the best grocery shopping experience with quality, convenience, and reliability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{borderRadius: '25px'}}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center" style={{borderRadius: '50%'}}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Explore our wide range of fresh and quality products
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative bg-white overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{borderRadius: '20px'}}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  
                  {/* Item Count Badge */}
                  <div className="absolute top-3 right-3 backdrop-blur-md bg-white/90 px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-xs font-bold text-gray-800">{category.count}</span>
                  </div>
                </div>
                
                {/* Category Info */}
                <div className="p-4 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-black transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Shop Now Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium">Shop Now</span>
                    <i className="fas fa-arrow-right text-gray-600 group-hover:text-black group-hover:translate-x-1 transition-all"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Ready to start shopping?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of happy customers who trust SmartGrocer for their daily grocery needs.
            </p>
            
            {isAuthenticated ? (
              <Link to="/products">
                <Button className="btn-primary text-lg px-8 py-3">
                  Start Shopping
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button className="bg-black hover:bg-gray-800 text-white font-medium text-lg px-8 py-3 transition-colors" style={{borderRadius: '25px'}}>
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/products">
                  <Button className="border-2 border-gray-300 bg-white hover:bg-gray-50 text-black text-lg px-8 py-3 transition-colors" style={{borderRadius: '25px'}}>
                    Browse Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t border-gray-200 bg-white">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            <div className="text-center p-6 bg-white border border-gray-100 hover:shadow-lg transition-all duration-300" style={{borderRadius: '25px'}}>
              <div className="text-4xl font-black gradient-text mb-3">10,000+</div>
              <div className="text-gray-600 font-medium">Products Available</div>
            </div>
            <div className="text-center p-6 bg-white border border-gray-100 hover:shadow-lg transition-all duration-300" style={{borderRadius: '25px'}}>
              <div className="text-4xl font-black gradient-text mb-3">50,000+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-white border border-gray-100 hover:shadow-lg transition-all duration-300" style={{borderRadius: '25px'}}>
              <div className="text-4xl font-black gradient-text mb-3">100+</div>
              <div className="text-gray-600 font-medium">Partner Stores</div>
            </div>
            <div className="text-center p-6 bg-white border border-gray-100 hover:shadow-lg transition-all duration-300" style={{borderRadius: '25px'}}>
              <div className="text-4xl font-black gradient-text mb-3">30 min</div>
              <div className="text-gray-600 font-medium">Average Delivery</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home