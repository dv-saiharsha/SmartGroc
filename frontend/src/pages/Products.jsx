import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  X,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  TrendingUp,
  Clock,
  Package,
  Zap
} from 'lucide-react'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  // Enhanced mock products with more realistic data
  const mockProducts = [
    {
      id: 1,
      name: 'Fresh Organic Bananas',
      price: 2.99,
      originalPrice: 3.49,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
      category: 'Fruits & Vegetables',
      brand: 'FreshFarms',
      description: 'Crisp, sweet organic bananas perfect for breakfast or smoothies',
      stock: 50,
      rating: 4.8,
      reviews: 124,
      isOrganic: true,
      discount: 14,
      badges: ['Organic', 'Popular']
    },
    {
      id: 2,
      name: 'Whole Milk - 1 Gallon',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&crop=center',
      category: 'Dairy & Eggs',
      brand: 'DairyBest',
      description: 'Fresh whole milk from grass-fed cows, rich in nutrients',
      stock: 25,
      rating: 4.6,
      reviews: 89,
      isOrganic: false,
      badges: ['Fresh', 'Local']
    },
    {
      id: 3,
      name: 'Artisan Sourdough Bread',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop&crop=center',
      category: 'Bakery',
      brand: 'ArtisanBread Co',
      description: 'Handcrafted sourdough bread with crispy crust and soft interior',
      stock: 8,
      rating: 4.9,
      reviews: 203,
      isOrganic: true,
      badges: ['Artisan', 'Low Stock']
    },
    {
      id: 4,
      name: 'Premium Ground Coffee',
      price: 12.99,
      originalPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop&crop=center',
      category: 'Beverages',
      brand: 'CoffeeHouse',
      description: 'Rich, dark roast coffee beans sourced from sustainable farms',
      stock: 30,
      rating: 4.7,
      reviews: 156,
      isOrganic: true,
      discount: 19,
      badges: ['Premium', 'Fair Trade']
    },
    {
      id: 5,
      name: 'Free-Range Chicken Breast',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center',
      category: 'Meat & Seafood',
      brand: 'FarmFresh',
      description: 'Premium free-range chicken breast, 1 lb package',
      stock: 20,
      rating: 4.5,
      reviews: 67,
      isOrganic: false,
      badges: ['Free-Range', 'High Protein']
    },
    {
      id: 6,
      name: 'Organic Baby Spinach',
      price: 4.49,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center',
      category: 'Fruits & Vegetables',
      brand: 'GreenLeaf',
      description: 'Fresh organic baby spinach leaves, perfect for salads',
      stock: 35,
      rating: 4.4,
      reviews: 92,
      isOrganic: true,
      badges: ['Organic', 'Superfood']
    }
  ]

  const categories = [
    'all',
    'Fruits & Vegetables',
    'Dairy & Eggs', 
    'Bakery',
    'Meat & Seafood',
    'Beverages',
    'Pantry',
    'Frozen Foods'
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesStock = !inStockOnly || product.stock > 0
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock
  }).sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'price' || sortBy === 'rating') {
      aValue = parseFloat(aValue)
      bValue = parseFloat(bValue)
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const addToCart = (product) => {
    // This will be implemented with cart context
    alert(`Added ${product.name} to cart!`)
  }

  const toggleWishlist = (product) => {
    alert(`Added ${product.name} to wishlist!`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() })
    } else {
      setSearchParams({})
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setPriceRange([0, 100])
    setInStockOnly(false)
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          {/* Controls Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1 max-w-2xl" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Products</h1>
              <p className="text-muted-foreground">Discover fresh groceries and premium brands</p>
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
          
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for products, brands, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-')
                    setSortBy(newSortBy)
                    setSortOrder(newSortOrder)
                  }}
                  className="appearance-none bg-background border border-input rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock Only
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
            {filteredProducts.length !== products.length && (
              <span className="ml-1">({products.length} total)</span>
            )}
          </p>
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Popular
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Top Rated
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              New Arrivals
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {paginatedProducts.map(product => (
                <Card key={product.id} className={`group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5Y2EzYWYiPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.discount && (
                        <Badge variant="destructive" className="text-xs font-bold">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.badges?.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Stock Warning */}
                    {product.stock < 10 && product.stock > 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Only {product.stock} left
                      </Badge>
                    )}
                    
                    {/* Wishlist Button */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                      onClick={() => toggleWishlist(product)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    
                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full group-hover:shadow-md transition-shadow"
                      disabled={product.stock === 0}
                      variant={product.stock === 0 ? 'secondary' : 'default'}
                    >
                      {product.stock === 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-muted-foreground">...</span>
                    }
                    return null
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products matching your search criteria.
              </p>
              <div className="space-y-2">
                <Button onClick={clearFilters} className="w-full">
                  Clear all filters
                </Button>
                <Button variant="outline" onClick={() => setSearchTerm('')} className="w-full">
                  Clear search
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products