import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  SlidersHorizontal
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CategoryProducts = () => {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const categoryFromQuery = searchParams.get('category')
  const currentCategory = category || categoryFromQuery

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState('grid')
  const [priceFilter, setPriceFilter] = useState('all')

  // Category configurations with enhanced product data
  const categoryConfig = {
    vegetables: {
      title: "Fresh Vegetables",
      icon: "🥬",
      description: "Farm-fresh vegetables delivered to your doorstep",
      products: [
        {
          id: 1,
          name: "Fresh Spinach (Palak)",
          price: 1.99,
          originalPrice: 2.49,
          image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
          rating: 4.5,
          reviews: 128,
          organic: true,
          stock: 50,
          unit: "250g bunch"
        },
        {
          id: 2,
          name: "Organic Carrots",
          price: 2.99,
          originalPrice: 3.49,
          image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop",
          rating: 4.7,
          reviews: 95,
          organic: true,
          stock: 35,
          unit: "1 kg"
        },
        {
          id: 3,
          name: "Fresh Broccoli",
          price: 3.99,
          originalPrice: 4.99,
          image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop",
          rating: 4.3,
          reviews: 67,
          organic: false,
          stock: 25,
          unit: "1 head"
        },
        {
          id: 4,
          name: "Red Bell Peppers",
          price: 4.49,
          originalPrice: 5.99,
          image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop",
          rating: 4.6,
          reviews: 112,
          organic: false,
          stock: 40,
          unit: "3 pieces"
        },
        {
          id: 5,
          name: "Fresh Cucumber",
          price: 1.49,
          originalPrice: 1.99,
          image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop",
          rating: 4.2,
          reviews: 78,
          organic: true,
          stock: 60,
          unit: "2 pieces"
        },
        {
          id: 6,
          name: "Green Capsicum",
          price: 2.49,
          originalPrice: 2.99,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
          rating: 4.4,
          reviews: 89,
          organic: false,
          stock: 30,
          unit: "500g"
        }
      ]
    },
    fruits: {
      title: "Fresh Fruits",
      icon: "🍎",
      description: "Sweet, juicy fruits handpicked for quality",
      products: [
        {
          id: 11,
          name: "Red Delicious Apples",
          price: 3.99,
          originalPrice: 4.99,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
          rating: 4.5,
          reviews: 156,
          organic: true,
          stock: 45,
          unit: "1 kg"
        },
        {
          id: 12,
          name: "Fresh Bananas",
          price: 2.49,
          originalPrice: 2.99,
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
          rating: 4.7,
          reviews: 203,
          organic: false,
          stock: 80,
          unit: "1 dozen"
        },
        {
          id: 13,
          name: "Sweet Oranges",
          price: 4.49,
          originalPrice: 5.49,
          image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop",
          rating: 4.6,
          reviews: 134,
          organic: true,
          stock: 55,
          unit: "2 kg"
        },
        {
          id: 14,
          name: "Fresh Grapes",
          price: 5.99,
          originalPrice: 7.99,
          image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop",
          rating: 4.8,
          reviews: 187,
          organic: false,
          stock: 25,
          unit: "500g"
        }
      ]
    },
    dairy: {
      title: "Dairy, Bread & Eggs",
      icon: "🥛",
      description: "Fresh dairy products and bakery items",
      products: [
        {
          id: 21,
          name: "Fresh Whole Milk",
          price: 3.49,
          originalPrice: 3.99,
          image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
          rating: 4.5,
          reviews: 298,
          organic: false,
          stock: 40,
          unit: "1 liter"
        },
        {
          id: 22,
          name: "Farm Fresh Eggs",
          price: 4.99,
          originalPrice: 5.99,
          image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
          rating: 4.7,
          reviews: 167,
          organic: true,
          stock: 35,
          unit: "12 pieces"
        },
        {
          id: 23,
          name: "Whole Wheat Bread",
          price: 2.99,
          originalPrice: 3.49,
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
          rating: 4.3,
          reviews: 89,
          organic: false,
          stock: 20,
          unit: "1 loaf"
        }
      ]
    },
    grains: {
      title: "Rice, Atta & Dals",
      icon: "🌾",
      description: "Premium grains and lentils for your kitchen",
      products: [
        {
          id: 31,
          name: "Basmati Rice Premium",
          price: 12.99,
          originalPrice: 15.99,
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
          rating: 4.6,
          reviews: 234,
          organic: false,
          stock: 30,
          unit: "5 kg"
        },
        {
          id: 32,
          name: "Whole Wheat Flour",
          price: 8.99,
          originalPrice: 10.99,
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
          rating: 4.4,
          reviews: 156,
          organic: true,
          stock: 45,
          unit: "10 kg"
        }
      ]
    },
    spices: {
      title: "Masalas & Dry Fruits",
      icon: "🌶️",
      description: "Aromatic spices and premium dry fruits",
      products: [
        {
          id: 41,
          name: "Garam Masala Powder",
          price: 4.99,
          originalPrice: 6.99,
          image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
          rating: 4.7,
          reviews: 178,
          organic: false,
          stock: 25,
          unit: "100g"
        },
        {
          id: 42,
          name: "Premium Almonds",
          price: 15.99,
          originalPrice: 18.99,
          image: "https://images.unsplash.com/photo-1508747578473-bfd122bb8537?w=400&h=400&fit=crop",
          rating: 4.8,
          reviews: 267,
          organic: true,
          stock: 20,
          unit: "500g"
        }
      ]
    },
    oils: {
      title: "Oils & Ghee",
      icon: "🫒",
      description: "Pure cooking oils and clarified butter",
      products: [
        {
          id: 51,
          name: "Extra Virgin Olive Oil",
          price: 18.99,
          originalPrice: 22.99,
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
          rating: 4.6,
          reviews: 145,
          organic: true,
          stock: 15,
          unit: "500ml"
        }
      ]
    },
    snacks: {
      title: "Munchies",
      icon: "🍿",
      description: "Delicious snacks for every craving",
      products: [
        {
          id: 61,
          name: "Mixed Nuts Premium",
          price: 12.99,
          originalPrice: 15.99,
          image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop",
          rating: 4.5,
          reviews: 123,
          organic: false,
          stock: 30,
          unit: "250g"
        }
      ]
    },
    sweets: {
      title: "Sweets",
      icon: "🍯",
      description: "Traditional and modern sweet treats",
      products: [
        {
          id: 71,
          name: "Pure Honey",
          price: 8.99,
          originalPrice: 11.99,
          image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
          rating: 4.7,
          reviews: 189,
          organic: true,
          stock: 25,
          unit: "500g"
        }
      ]
    }
  }

  const config = categoryConfig[currentCategory] || {
    title: "Products",
    icon: "🛒",
    description: "Discover our wide range of products",
    products: []
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(config.products)
      setLoading(false)
    }, 800)
  }, [currentCategory])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return b.reviews - a.reviews // popularity
    }
  })

  const addToCart = (product) => {
    alert(`Added ${product.name} to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">{config.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{config.icon}</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
              <p className="text-muted-foreground text-lg">{config.description}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-sm"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                {product.organic && (
                  <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                    Organic
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.unit}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse other categories
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryProducts