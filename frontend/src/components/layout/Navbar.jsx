import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { 
  ShoppingCart, 
  User, 
  Menu, 
  Search, 
  X,
  LogOut,
  Package
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white w-full shadow-sm border-b border-gray-100">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black flex items-center justify-center shadow-md" style={{borderRadius: '25px'}}>
                <span className="text-white font-bold text-lg sm:text-xl">S</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-black hover:text-gray-600 transition-colors">SmartGrocer</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-xl mx-8 hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 w-full border-2 border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  style={{borderRadius: '25px'}}
                />
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              
              {/* Search icon for mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden p-2"
                onClick={() => navigate('/products')}
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative p-2 hover:bg-gray-100" style={{borderRadius: '25px'}}>
                  <ShoppingCart className="h-6 w-6 text-black" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2"
                  >
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.full_name?.split(' ')[0] || 'User'}
                    </span>
                  </Button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-xl py-2 z-50" style={{borderRadius: '25px'}}>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900 text-sm">{user?.full_name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                      
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3 text-gray-400" />
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button className="text-gray-700 hover:text-black border-2 border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 transition-colors" style={{borderRadius: '25px'}}>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 transition-colors" style={{borderRadius: '25px'}}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden p-2 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{borderRadius: '25px'}}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-clean pl-12 pr-4"
              />
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-16 h-full w-80 max-w-sm bg-white shadow-xl" style={{borderTopLeftRadius: '25px', borderBottomLeftRadius: '25px'}}>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/products"
                  className="block text-gray-900 font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/offers"
                  className="block text-gray-900 font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Offers
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/orders"
                    className="block text-gray-900 font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="block text-gray-900 font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-primary">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar