import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { 
  Package,
  Search,
  Filter,
  Calendar,
  MapPin,
  ShoppingCart,
  Eye,
  RotateCcw,
  Download,
  Star,
  Truck,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'

const Orders = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addItem } = useCart()
  
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    loadOrders()
  }, [isAuthenticated, navigate])
  
  useEffect(() => {
    applyFilters()
  }, [orders, searchTerm, statusFilter, dateFilter])
  
  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    // Convert date strings back to Date objects and sort by creation date (newest first)
    const processedOrders = storedOrders.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt),
      estimatedDelivery: new Date(order.estimatedDelivery)
    }))
    const sortedOrders = processedOrders.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )
    setOrders(sortedOrders)
  }
  
  const applyFilters = () => {
    let filtered = [...orders]
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          filterDate.setMonth(now.getMonth() - 3)
          break
        default:
          filterDate.setFullYear(now.getFullYear() - 1)
      }
      
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filterDate
      )
    }
    
    setFilteredOrders(filtered)
  }
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-gray-100 text-gray-800', text: 'Confirmed' },
      preparing: { color: 'bg-gray-200 text-gray-800', text: 'Preparing' },
      'out-for-delivery': { color: 'bg-gray-300 text-gray-800', text: 'Out for Delivery' },
      delivered: { color: 'bg-black text-white', text: 'Delivered' },
      cancelled: { color: 'bg-gray-400 text-white', text: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.confirmed
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    )
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      case 'preparing':
        return <Package className="h-4 w-4 text-gray-600" />
      case 'out-for-delivery':
        return <Truck className="h-4 w-4 text-gray-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-black" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }
  
  const handleReorder = (order) => {
    // Add all items from the order back to cart
    order.items.forEach(item => {
      addItem(item, item.quantity)
    })
    
    // Navigate to cart
    navigate('/cart')
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-10 w-full">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-3">My Orders</h1>
              <p className="text-gray-600">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/products')}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop Now
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white p-6 sm:p-8 shadow-lg mb-8" style={{borderRadius: '25px'}}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                style={{borderRadius: '5px'}}
              />
            </div>
            
            {/* Filter Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="border-2 border-gray-300 bg-white hover:bg-gray-50 text-black px-4 py-2 transition-colors"
              style={{borderRadius: '25px'}}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white border border-gray-200" style={{borderRadius: '25px'}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Orders</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? "You haven't placed any orders yet."
                : "Try adjusting your search or filters."
              }
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-smooth-xl border border-gray-200 p-6 shadow-smooth hover:shadow-smooth-lg smooth-transition">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-black">Order #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="font-semibold text-black">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/track-order/${order.id}`)}
                      className="border-gray-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Track
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="border-gray-300"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reorder
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-black"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Order Progress */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-smooth-lg">
                  {getStatusIcon(order.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      {order.status === 'delivered' ? 'Order delivered successfully' :
                       order.status === 'out-for-delivery' ? 'Your order is on the way' :
                       order.status === 'preparing' ? 'We\'re preparing your order' :
                       'Order confirmed and being processed'}
                    </p>
                    {order.status === 'delivered' && (
                      <p className="text-xs text-gray-600">
                        Delivered on {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                  
                  {order.status === 'delivered' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-black"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Rate
                    </Button>
                  )}
                </div>
                
                {/* Order Items Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-black">Items in this order</h4>
                    <span className="text-sm text-gray-500">
                      {order.items.length > 3 ? `+${order.items.length - 3} more` : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-smooth">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-8 h-8 object-cover rounded-smooth"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-black truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Delivery Address */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-medium text-black">Delivery to:</span>
                      <span className="text-gray-600 ml-1">
                        {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Load More (if needed) */}
        {filteredOrders.length > 0 && filteredOrders.length % 10 === 0 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-gray-300"
            >
              Load More Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders