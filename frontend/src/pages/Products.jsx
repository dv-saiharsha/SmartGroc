import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [showQuantitySelector, setShowQuantitySelector] = useState({})
  const [productQuantities, setProductQuantities] = useState({})
  const [wishlistItems, setWishlistItems] = useState(new Set())
  const [addedToCart, setAddedToCart] = useState(new Set())
  const { addItem } = useCart()

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vegetables', name: 'Fresh Vegetables' },
    { id: 'fruits', name: 'Fresh Fruits' },
    { id: 'dairy', name: 'Dairy Products' },
    { id: 'bakery', name: 'Bakery Items' },
    { id: 'meat', name: 'Meat & Seafood' },
    { id: 'pantry', name: 'Pantry Essentials' }
  ]

  // Mock products - expanded for better testing
  const mockProducts = [
    {
      id: 1,
      name: 'Fresh Organic Bananas',
      price: 2.99,
      originalPrice: 3.49,
      image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&h=500&fit=crop',
      category: 'fruits',
      rating: 4.5,
      reviews: 124,
      inStock: true,
      unit: '1 lb',
      description: 'Fresh organic bananas, perfect for smoothies and snacks'
    },
    {
      id: 2,
      name: 'Organic Whole Milk',
      price: 4.49,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop',
      category: 'dairy',
      rating: 4.3,
      reviews: 67,
      inStock: true,
      unit: '1 gal',
      description: 'Fresh organic whole milk from grass-fed cows'
    },
    {
      id: 3,
      name: 'Fresh Avocados',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop',
      category: 'fruits',
      rating: 4.7,
      reviews: 89,
      inStock: true,
      unit: 'each',
      description: 'Perfectly ripe avocados, great for toast and salads'
    },
    {
      id: 4,
      name: 'Fresh Spinach Leaves',
      price: 3.29,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop',
      category: 'vegetables',
      rating: 4.4,
      reviews: 56,
      inStock: true,
      unit: '5 oz',
      description: 'Fresh baby spinach leaves, perfect for salads'
    },
    {
      id: 5,
      name: 'Artisan Sourdough Bread',
      price: 5.99,
      originalPrice: 7.49,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
      category: 'bakery',
      rating: 4.8,
      reviews: 203,
      inStock: true,
      unit: '1 loaf',
      description: 'Handcrafted sourdough bread with crispy crust'
    },
    {
      id: 6,
      name: 'Fresh Chicken Curry Cut',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop',
      category: 'meat',
      rating: 4.7,
      reviews: 145,
      inStock: true,
      unit: '1 kg',
      description: 'Fresh chicken curry cut, perfect for Indian dishes'
    },
    {
      id: 7,
      name: 'Organic Red Tomatoes',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop',
      category: 'vegetables',
      rating: 4.6,
      reviews: 92,
      inStock: true,
      unit: '1 lb',
      description: 'Vine-ripened organic tomatoes, bursting with flavor'
    },
    {
      id: 8,
      name: 'Fresh Strawberries',
      price: 4.99,
      originalPrice: 5.99,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop',
      category: 'fruits',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      unit: '1 lb',
      description: 'Sweet and juicy strawberries, perfect for desserts'
    },
    {
      id: 9,
      name: 'Greek Yogurt',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop',
      category: 'dairy',
      rating: 4.5,
      reviews: 84,
      inStock: true,
      unit: '16 oz',
      description: 'Creamy Greek yogurt, high in protein'
    },
    {
      id: 10,
      name: 'Croissants Pack',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop',
      category: 'bakery',
      rating: 4.7,
      reviews: 134,
      inStock: true,
      unit: '6 pack',
      description: 'Buttery, flaky croissants baked fresh daily'
    },
    {
      id: 11,
      name: 'Fresh Mutton Curry Cut',
      price: 9.99,
      originalPrice: 11.99,
      image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=500&h=500&fit=crop',
      category: 'meat',
      rating: 4.8,
      reviews: 189,
      inStock: true,
      unit: '1 kg',
      description: 'Fresh mutton curry cut, tender and flavorful'
    },
    {
      id: 12,
      name: 'Organic Carrots',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop',
      category: 'vegetables',
      rating: 4.3,
      reviews: 73,
      inStock: true,
      unit: '2 lb',
      description: 'Crisp organic carrots, great for snacking and cooking'
    },
    {
      id: 13,
      name: 'Fresh Pomfret Fish',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop',
      category: 'meat',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      unit: '1 kg',
      description: 'Fresh pomfret fish, cleaned and ready to cook'
    },
    {
      id: 14,
      name: 'Chicken Liver',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=500&fit=crop',
      category: 'meat',
      rating: 4.5,
      reviews: 98,
      inStock: true,
      unit: '500g',
      description: 'Fresh chicken liver, rich in iron and protein'
    },
    {
      id: 15,
      name: 'Mutton Kheema (Minced)',
      price: 7.99,
      originalPrice: 8.99,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&h=500&fit=crop',
      category: 'meat',
      rating: 4.7,
      reviews: 234,
      inStock: true,
      unit: '500g',
      description: 'Fresh mutton kheema, perfect for kheema curry'
    }
  ]

  const filteredProducts = mockProducts.filter(product => {
    const searchQuery = searchParams.get('search') || ''
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (category !== 'all') {
        newParams.set('category', category)
      } else {
        newParams.delete('category')
      }
      return newParams
    })
  }

  const handleAddToCart = (product) => {
    const quantity = productQuantities[product.id] || 1
    addItem(product, quantity)
    setAddedToCart(prev => new Set([...prev, product.id]))
    // Keep quantity selector visible after adding to cart
  }



  const handleQuantityChange = (productId, change, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const currentQty = productQuantities[productId] || 1
    const newQty = currentQty + change
    
    // If decreasing below 1, hide the quantity selector
    if (newQty < 1) {
      setShowQuantitySelector(prev => ({ ...prev, [productId]: false }))
      setProductQuantities(prev => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
      // Remove from added to cart state
      setAddedToCart(prev => {
        const updated = new Set(prev)
        updated.delete(productId)
        return updated
      })
      return
    }
    
    // Otherwise update the quantity (max 99)
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.min(99, newQty)
    }))
  }

  const toggleWishlist = (productId) => {
    setWishlistItems(prev => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
      } else {
        newWishlist.add(productId)
      }
      return newWishlist
    })
  }

  const initializeQuantitySelector = (productId) => {
    setShowQuantitySelector(prev => ({ ...prev, [productId]: true }))
    if (!productQuantities[productId]) {
      setProductQuantities(prev => ({ ...prev, [productId]: 1 }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-md">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Our Products</h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}`}
            {searchParams.get('search') && ` for "${searchParams.get('search')}"`}
          </p>
        </div>
      </div>

      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          
          {/* Sidebar Filters */}
          <div className="lg:w-72 xl:w-80">
            <div className="bg-white p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-3xl border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-5 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col rounded-3xl border border-gray-200" style={{minHeight: '560px'}}>
                  {/* Product Image */}
                  <div className="relative flex-shrink-0 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full object-cover transition-transform duration-500 hover:scale-110"
                      style={{height: '240px'}}
                    />
                    
                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-xs font-bold shadow-lg rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    
                    {/* Wishlist Heart */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-4 right-4 w-11 h-11 flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 rounded-full ${
                        wishlistItems.has(product.id) 
                          ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white' 
                          : 'bg-white text-gray-600 hover:text-red-500 hover:shadow-xl'
                      }`}
                    >
                      <i className={`${
                          wishlistItems.has(product.id) ? 'fas fa-heart' : 'far fa-heart'
                        } text-lg`}></i>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2" style={{minHeight: '3rem'}}>{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed" style={{minHeight: '2.5rem'}}>{product.description}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                          <i className="fas fa-star text-yellow-400"></i>
                          <span className="text-sm font-semibold text-gray-800 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-gray-500 text-xs font-medium">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">/{product.unit}</span>
                      </div>
                    </div>

                    {/* Cart Controls - Always at bottom */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      {!product.inStock ? (
                        <button 
                          disabled
                          className="w-full bg-gray-200 text-gray-500 font-semibold py-3 px-4 cursor-not-allowed text-sm rounded-2xl"
                        >
                          Out of Stock
                        </button>
                      ) : !showQuantitySelector[product.id] ? (
                        <button
                          onClick={() => initializeQuantitySelector(product.id)}
                          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-semibold py-3.5 px-4 transition-all duration-200 text-sm flex items-center justify-center gap-2 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <i className="fas fa-cart-shopping"></i>
                          Add to Cart
                        </button>
                      ) : (
                        <div className="space-y-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-2xl border border-gray-200">
                            <button
                              type="button"
                              onClick={(e) => handleQuantityChange(product.id, -1, e)}
                              className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center shadow-md transition-all hover:shadow-lg rounded-full"
                            >
                              <i className="fas fa-minus text-gray-700"></i>
                            </button>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-600">Qty:</span>
                              <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                                {productQuantities[product.id] || 1}
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={(e) => handleQuantityChange(product.id, 1, e)}
                              className="w-10 h-10 bg-white hover:bg-gray-200 flex items-center justify-center shadow-md transition-all hover:shadow-lg rounded-full"
                            >
                              <i className="fas fa-plus text-gray-700"></i>
                            </button>
                          </div>
                          
                          {/* Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`w-full font-semibold py-3.5 px-4 transition-all duration-200 text-sm flex items-center justify-center gap-2 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 ${
                              addedToCart.has(product.id)
                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white'
                            }`}
                          >
                            <i className="fas fa-cart-shopping"></i>
                            {addedToCart.has(product.id) 
                              ? `Added ${productQuantities[product.id] || 1} to Cart ✓`
                              : `Add ${productQuantities[product.id] || 1} to Cart`
                            }
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchParams({})
                  }}
                  style={{borderRadius: '25px'}}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products