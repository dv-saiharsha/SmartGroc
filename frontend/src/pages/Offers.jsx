import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { 
  Search, 
  Percent, 
  Clock, 
  Star,
  Gift,
  Zap,
  Crown,
  Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Offers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const offerCategories = [
    { id: 'all', name: 'All Offers', icon: '🎯' },
    { id: 'grocery', name: 'Grocery', icon: '🛒' },
    { id: 'fruits', name: 'Fruits & Vegetables', icon: '🥬' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' }
  ]

  const offers = [
    {
      id: 1,
      title: "FLAT 60% OFF",
      subtitle: "On Fresh Vegetables",
      description: "Get fresh vegetables at unbeatable prices",
      code: "FRESH60",
      validUntil: "31 Dec 2024",
      minOrder: 25,
      category: 'fruits',
      image: "🥬",
      bgGradient: "from-green-500 to-green-600",
      link: "/products?category=vegetables",
      featured: true
    },
    {
      id: 2,
      title: "BUY 2 GET 1 FREE",
      subtitle: "Premium Dairy Products",
      description: "Stock up on milk, cheese, and yogurt",
      code: "DAIRY3FOR2",
      validUntil: "25 Dec 2024",
      minOrder: 20,
      category: 'dairy',
      image: "🥛",
      bgGradient: "from-blue-500 to-blue-600",
      link: "/products?category=dairy",
      featured: true
    },
    {
      id: 3,
      title: "50% OFF",
      subtitle: "First Order Discount",
      description: "New users get massive savings",
      code: "WELCOME50",
      validUntil: "31 Dec 2024",
      minOrder: 30,
      category: 'all',
      image: "🎉",
      bgGradient: "from-purple-500 to-pink-500",
      link: "/products",
      featured: true
    },
    {
      id: 4,
      title: "FREE DELIVERY",
      subtitle: "On Orders Above $40",
      description: "No delivery charges for bulk orders",
      code: "FREEDEL40",
      validUntil: "30 Dec 2024",
      minOrder: 40,
      category: 'all',
      image: "🚚",
      bgGradient: "from-orange-500 to-red-500",
      link: "/products",
      featured: false
    },
    {
      id: 5,
      title: "30% OFF",
      subtitle: "Premium Snacks",
      description: "Satisfy your cravings for less",
      code: "MUNCH30",
      validUntil: "28 Dec 2024",
      minOrder: 15,
      category: 'snacks',
      image: "🍿",
      bgGradient: "from-yellow-500 to-amber-500",
      link: "/products?category=snacks",
      featured: false
    },
    {
      id: 6,
      title: "COMBO DEAL",
      subtitle: "Fruits + Vegetables",
      description: "Bundle deals for healthy eating",
      code: "HEALTHY25",
      validUntil: "29 Dec 2024",
      minOrder: 35,
      category: 'fruits',
      image: "🥗",
      bgGradient: "from-emerald-500 to-teal-500",
      link: "/products?category=fruits",
      featured: false
    }
  ]

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredOffers = offers.filter(offer => offer.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🎯 Amazing Offers</h1>
            <p className="text-xl opacity-90 mb-6">
              Save big on your favorite products with exclusive deals
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 placeholder-white/70 text-white"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {offerCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Offers */}
        {selectedCategory === 'all' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🌟 Featured Deals
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredOffers.map((offer, index) => (
                <Link
                  key={offer.id}
                  to={offer.link}
                  className={`block transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card className={`bg-gradient-to-br ${offer.bgGradient} text-white border-0 shadow-xl overflow-hidden group relative`}>
                    <div className="absolute top-2 right-2">
                      <Crown className="h-6 w-6 text-yellow-300" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{offer.title}</h3>
                          <p className="text-white/90 mb-2">{offer.subtitle}</p>
                          <p className="text-sm text-white/80">{offer.description}</p>
                        </div>
                        <div className="text-4xl group-hover:scale-110 transition-transform">
                          {offer.image}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Gift className="h-4 w-4 mr-2" />
                          <span>Code: <strong>{offer.code}</strong></span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Valid until {offer.validUntil}</span>
                        </div>
                      </div>

                      <Badge className="bg-white/20 text-white border-white/30">
                        Min order: ${offer.minOrder}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Offers Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {selectedCategory === 'all' ? '🎁 All Offers' : `Offers in ${offerCategories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => (
              <Link
                key={offer.id}
                to={offer.link}
                className={`block transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="bg-white hover:shadow-xl transition-all border-0 shadow-md overflow-hidden group">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-r ${offer.bgGradient} p-6 text-white relative`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                          <p className="text-white/90 text-sm">{offer.subtitle}</p>
                        </div>
                        <div className="text-3xl group-hover:scale-110 transition-transform">
                          {offer.image}
                        </div>
                      </div>
                      
                      {offer.featured && (
                        <div className="absolute top-2 right-2">
                          <Star className="h-5 w-5 text-yellow-300 fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Gift className="h-4 w-4 mr-2 text-green-600" />
                          <span>Use code: <strong className="text-gray-900">{offer.code}</strong></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Valid until {offer.validUntil}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-green-700 border-green-200">
                          Min order: ${offer.minOrder}
                        </Badge>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No offers found</h3>
            <p className="text-gray-600 mb-4">
              Try searching for different terms or browse all categories
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}>
              View All Offers
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 text-center bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">🎉 Don't Miss Out!</h2>
          <p className="text-xl mb-6 opacity-90">
            Subscribe to get notified about exclusive deals and offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 placeholder-white/70 text-white flex-1"
            />
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
              Subscribe
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Offers