import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  Share2,
  Download,
  ArrowRight,
  Home,
  Calendar,
  Phone,
  Mail,
  Star
} from 'lucide-react'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [estimatedSteps, setEstimatedSteps] = useState([])
  
  useEffect(() => {
    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find(o => o.id === orderId)
    
    if (foundOrder) {
      // Convert date strings back to Date objects
      foundOrder.estimatedDelivery = new Date(foundOrder.estimatedDelivery)
      foundOrder.createdAt = new Date(foundOrder.createdAt)
      setOrder(foundOrder)
      
      // Generate delivery timeline based on delivery option
      const now = new Date()
      const steps = []
      
      if (foundOrder.deliveryOption === 'express') {
        steps.push(
          { status: 'Order Confirmed', time: new Date(now.getTime()), completed: true },
          { status: 'Preparing Order', time: new Date(now.getTime() + 10 * 60000), completed: false },
          { status: 'Out for Delivery', time: new Date(now.getTime() + 20 * 60000), completed: false },
          { status: 'Delivered', time: foundOrder.estimatedDelivery, completed: false }
        )
      } else if (foundOrder.deliveryOption === 'standard') {
        steps.push(
          { status: 'Order Confirmed', time: new Date(now.getTime()), completed: true },
          { status: 'Processing', time: new Date(now.getTime() + 30 * 60000), completed: false },
          { status: 'Packed', time: new Date(now.getTime() + 2 * 3600000), completed: false },
          { status: 'Out for Delivery', time: new Date(now.getTime() + 3 * 3600000), completed: false },
          { status: 'Delivered', time: foundOrder.estimatedDelivery, completed: false }
        )
      } else {
        steps.push(
          { status: 'Order Confirmed', time: new Date(now.getTime()), completed: true },
          { status: 'Scheduled', time: new Date(now.getTime() + 3600000), completed: false },
          { status: 'Preparing', time: new Date(foundOrder.estimatedDelivery.getTime() - 3600000), completed: false },
          { status: 'Out for Delivery', time: new Date(foundOrder.estimatedDelivery.getTime() - 1800000), completed: false },
          { status: 'Delivered', time: foundOrder.estimatedDelivery, completed: false }
        )
      }
      
      setEstimatedSteps(steps)
    } else {
      // Redirect if order not found
      navigate('/orders')
    }
  }, [orderId, navigate])
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Loading order details...</p>
          <p className="text-sm text-gray-500">
            If this takes too long, please check your order history or contact support.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/orders')}
            className="mt-4"
          >
            Go to Order History
          </Button>
        </div>
      </div>
    )
  }
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  const getDeliveryMessage = () => {
    switch (order.deliveryOption) {
      case 'express':
        return 'Your order will arrive within 30 minutes - 1 hour'
      case 'standard':
        return 'Your order will arrive in 2-4 hours'
      case 'scheduled':
        return 'Your order will arrive at your scheduled time'
      default:
        return 'Your order is being processed'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your order. We've received your payment and started preparing your items.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(`/track-order/${order.id}`)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Track Your Order
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/orders')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Clock className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-black mb-1">Order #{order.id}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-1">Delivery Information</h3>
                <p className="text-gray-600 mb-3">{getDeliveryMessage()}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-800">Estimated Delivery:</span>
                    <p className="text-gray-600">
                      {formatDate(order.estimatedDelivery)} • {formatTime(order.estimatedDelivery)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-800">Delivery Address:</span>
                    <p className="text-gray-600">
                      {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-black mb-4">Order Timeline</h3>
            
            <div className="space-y-4">
              {estimatedSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-sm ${
                      step.completed ? 'text-black font-medium' : 'text-gray-600'
                    }`}>
                      {step.status}
                    </span>
                    
                    <span className="text-xs text-gray-500">
                      {step.completed ? 'Completed' : formatTime(step.time)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-black mb-4">Order Items ({order.items.length})</h3>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-black">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${item.price} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="space-y-3 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-black">${order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-black">${order.deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-black">${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-black">Total</span>
                  <span className="font-bold text-black">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-black mb-4">Need Help?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-black">Call Us</p>
                <p className="text-xs text-gray-600">1-800-GROCERY</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-black">Email Support</p>
                <p className="text-xs text-gray-600">support@smartgrocer.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-black">Live Chat</p>
                <p className="text-xs text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-6 text-white mb-6">
          <h3 className="font-bold text-xl mb-3">What's Next?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4" />
                </div>
                <span className="font-medium">Track Your Order</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Get real-time updates on your delivery progress with our tracking system.
              </p>
              <Button 
                onClick={() => navigate(`/track-order/${order.id}`)}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                Track Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4" />
                </div>
                <span className="font-medium">Rate Your Experience</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Help us improve by rating your shopping and delivery experience.
              </p>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                Rate Order
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Home className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess