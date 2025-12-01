import { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { 
  Search, 
  Star, 
  Clock, 
  MapPin,
  Filter,
  Truck,
  Percent
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filters = [
    { id: 'all', name: 'All Stores', icon: '🏪' },
    { id: 'grocery', name: 'Grocery', icon: '🛒' },
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'electronics', name: 'Electronics', icon: '📱' }
  ]

  const stores = [
    {
      id: 1,
      name: "FreshMart Superstore",
      type: "Grocery Store",
      rating: 4.2,
      reviews: 1247,
      deliveryTime: "25-30 mins",
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      offers: ["Flat 20% off on pre-booking", "Up to 10% off with bank offers"],
      category: 'grocery',
      deliveryFee: "Free",
      cuisine: "North Indian • Grocery",
      priceRange: "₹200 for two"
    },
    {
      id: 2,
      name: "4 Seasons Bakery & Cafe",
      type: "Bakery • Desserts",
      rating: 4.1,
      reviews: 856,
      deliveryTime: "15-20 mins",
      distance: "0.9 km",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop",
      offers: ["Flat 10% off on walk-in", "+ 1 more"],
      category: 'bakery',
      deliveryFee: "₹25",
      cuisine: "Fast Food • Bakery",
      priceRange: "₹400 for two"
    },
    {
      id: 3,
      name: "Green Park Organic Market",
      type: "Organic Store",
      rating: 4.6,
      reviews: 634,
      deliveryTime: "30-35 mins",
      distance: "2.1 km",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      offers: ["Flat 20% off on pre-booking", "+ 4 more"],
      category: 'grocery',
      deliveryFee: "Free",
      cuisine: "South Indian • Biryani",
      priceRange: "₢600 for two"
    },
    {
      id: 4,
      name: "HealthPlus Pharmacy",
      type: "Medical Store",
      rating: 3.9,
      reviews: 423,
      deliveryTime: "20-25 mins",
      distance: "1.7 km",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      offers: ["Up to 10% off with bank offers"],
      category: 'pharmacy',
      deliveryFee: "₹15",
      cuisine: "Healthcare • Medicine",
      priceRange: "₹900 for two"
    }
  ]

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || store.category === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">🏪 Discover Best Stores</h1>
            <p className="text-lg opacity-90">
              Find amazing local stores and get everything delivered
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search stores, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {filters.map((filter, index) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span>{filter.icon}</span>
                <span className="font-medium text-sm">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStores.map((store, index) => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className={`block transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="bg-white hover:shadow-xl transition-all border-0 shadow-md overflow-hidden group">
                <div className="relative">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white text-xs">
                      ⚡ {store.deliveryTime}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-gray-700 text-xs">
                      📍 {store.distance}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{store.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{store.cuisine}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-green-600 fill-current" />
                        <span className="font-semibold">{store.rating}</span>
                        <span className="text-gray-500">({store.reviews})</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{store.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Offers */}
                  <div className="mb-3">
                    {store.offers.map((offer, i) => (
                      <div key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1">
                        <Percent className="h-3 w-3 inline mr-1" />
                        {offer}
                      </div>
                    ))}
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-gray-600">{store.priceRange}</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <Truck className="h-3 w-3" />
                      <span className="font-medium">
                        {store.deliveryFee === "Free" ? "FREE" : store.deliveryFee}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No stores found</h3>
            <p className="text-gray-600 mb-4">
              Try searching for different terms or browse all categories
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedFilter('all')
            }}>
              View All Stores
            </Button>
          </div>
        )}

        {/* Info Section */}
        <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🌟 Why Choose SmartGrocer Stores?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Get your orders delivered in 15-30 minutes from local stores
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">
                Handpicked stores with highest quality standards and ratings
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Offers</h3>
              <p className="text-gray-600 text-sm">
                Exclusive deals and discounts from your favorite local stores
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Discover