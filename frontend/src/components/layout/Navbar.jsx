import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { 
  ShoppingCart, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  Search, 
  Bell,
  Heart,
  Package,
  LogOut,
  Settings,
  ChevronDown,
  X
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs', 
    'Meat & Seafood',
    'Bakery',
    'Pantry',
    'Beverages',
    'Frozen Foods',
    'Health & Beauty'
  ]

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                SmartGrocer
              </span>
              <div className="text-xs text-muted-foreground -mt-1">Cloud</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-200 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for groceries, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-10 pr-4 py-2 w-full border-2 transition-colors focus:border-primary/50"
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search for mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-9 h-9"
              onClick={() => navigate('/products')}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 hidden sm:flex"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="w-9 h-9 relative hidden sm:flex">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="w-9 h-9 hidden sm:flex">
                <Heart className="h-4 w-4" />
              </Button>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative w-9 h-9">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3"
                >
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-24 truncate">
                    {user?.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform hidden md:block ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </Button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <div className="font-medium">{user?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-3" />
                      My Orders
                    </Link>

                    {user?.is_seller && (
                      <Link
                        to="/seller"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Seller Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="shadow-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden lg:flex items-center space-x-6 py-2 border-t bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">Categories:</span>
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
          <Link
            to="/products"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          {/* Mobile Search */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>
          </div>

          {/* Mobile Navigation Links */}
          <div className="py-2">
            <Link
              to="/products"
              className="flex items-center px-4 py-3 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/offers"
              className="flex items-center px-4 py-3 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Special Offers
            </Link>
            {isAuthenticated && user?.is_seller && (
              <Link
                to="/seller"
                className="flex items-center px-4 py-3 text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Seller Dashboard
              </Link>
            )}
            <Link
              to="/contact"
              className="flex items-center px-4 py-3 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            
            {!isAuthenticated && (
              <div className="px-4 py-3 space-y-2 border-t">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Categories */}
            <div className="border-t mt-2 pt-2">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground">Categories</div>
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar