import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useToast } from '../components/ui/use-toast'
import { orderService } from '../services/orderService'
import { Package, Truck, MapPin, Clock, CheckCircle, Phone, ArrowLeft, Navigation, Star, AlertCircle, RefreshCw, Headphones, Mail, User } from 'lucide-react'

const TrackOrder = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [order, setOrder] = useState(null)
  const [trackingHistory, setTrackingHistory] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [activeTab, setActiveTab] = useState('timeline')
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orderRating, setOrderRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const trackingSteps = useMemo(() => ([
    { id: 'confirmed', title: 'Order Confirmed', icon: CheckCircle },
    { id: 'preparing', title: 'Preparing', icon: Package },
    { id: 'packed', title: 'Packed', icon: Package },
    { id: 'out-for-delivery', title: 'Out for Delivery', icon: Truck },
    { id: 'delivered', title: 'Delivered', icon: CheckCircle },
  ]), [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        // Try backend first
        let fetchedOrder = null
        try {
          fetchedOrder = await orderService.getOrderById(orderId)
        } catch (_) {
          // Fallback to localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]')
          fetchedOrder = orders.find((o) => o.id === orderId) || null
        }

        if (!fetchedOrder) throw new Error('Order not found')

        // Normalize
        if (typeof fetchedOrder.createdAt === 'string') fetchedOrder.createdAt = new Date(fetchedOrder.createdAt)
        if (typeof fetchedOrder.estimatedDelivery === 'string') fetchedOrder.estimatedDelivery = new Date(fetchedOrder.estimatedDelivery)

        if (cancelled) return
        setOrder(fetchedOrder)

        // Tracking
        try {
          const data = await orderService.trackOrder(orderId)
          if (data?.history?.length) {
            setTrackingHistory(data.history.map(h => ({
              status: h.status,
              description: h.description || '',
              timestamp: new Date(h.timestamp),
              location: h.location || '—'
            })))
            setCurrentStep(Math.min(Number(data.currentStep ?? 0), trackingSteps.length - 1))
          } else {
            throw new Error('no-api')
          }
        } catch {
          const created = fetchedOrder?.createdAt ? new Date(fetchedOrder.createdAt) : new Date()
          const now = new Date()
          const events = [
            { status: 'Order Confirmed', description: 'We received your order.', timestamp: created, location: 'SmartGrocer HQ' },
            { status: 'Preparing', description: 'Picking fresh items.', timestamp: new Date(created.getTime() + 10 * 60 * 1000), location: 'Fulfillment Center' },
            { status: 'Packed', description: 'Order packed securely.', timestamp: new Date(created.getTime() + 25 * 60 * 1000), location: 'Packing Station' },
            { status: 'Out for Delivery', description: 'Courier on the way.', timestamp: new Date(created.getTime() + 50 * 60 * 1000), location: fetchedOrder?.shippingInfo?.city || 'Your City' },
            { status: 'Delivered', description: 'Delivered to your address.', timestamp: new Date(created.getTime() + 80 * 60 * 1000), location: 'Destination' },
          ]
          setTrackingHistory(events.filter(ev => ev.timestamp <= now))
          const elapsed = now.getTime() - created.getTime()
          const step = elapsed < 10*60*1000 ? 0 : elapsed < 25*60*1000 ? 1 : elapsed < 50*60*1000 ? 2 : elapsed < 80*60*1000 ? 3 : 4
          setCurrentStep(step)
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load order')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [orderId, trackingSteps])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      try {
        const data = await orderService.trackOrder(orderId)
        if (data?.history?.length) {
          setTrackingHistory(data.history.map((h) => ({
            status: h.status,
            description: h.description || '',
            timestamp: new Date(h.timestamp),
            location: h.location || '—'
          })))
          setCurrentStep(Math.min(Number(data.currentStep ?? currentStep), trackingSteps.length - 1))
        }
      } catch {
        // keep existing state
      }
      toast({ title: 'Tracking updated', description: 'Latest status fetched successfully.' })
    } finally {
      setRefreshing(false)
    }
  }

  const getEstimatedTime = () => {
    if (!order?.estimatedDelivery) return ''
    const deliveryTime = new Date(order.estimatedDelivery)
    const now = new Date()
    if (deliveryTime <= now) return 'Delivered'
    return formatDistanceToNow(deliveryTime, { addSuffix: false })
  }

  const getStatusColor = (index) => {
    if (index < currentStep) return 'bg-green-500'
    if (index === currentStep) return 'bg-blue-600'
    return 'bg-gray-300'
  }

  const getStatusBadge = () => {
    if (currentStep >= trackingSteps.length - 1) return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    if (currentStep >= 3) return <Badge className="bg-blue-100 text-blue-800">Out for Delivery</Badge>
    return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
  }

  const formatTimeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })
  const contactSupport = () => { window.location.href = 'tel:18004762379' }
  const reportIssue = () => { toast({ title: 'Issue reported', description: 'Our team will reach out shortly.' }) }
  const handleRateOrder = (stars) => setOrderRating(stars)
  const handleSubmitFeedback = () => { toast({ title: 'Thanks for your feedback!', description: 'We appreciate your time.' }); setFeedback(''); setOrderRating(0) }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-gray-800 font-medium mb-4">{error}</p>
          <Button onClick={() => navigate('/orders')} className="bg-black text-white">Back to Orders</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/orders')} 
            className="mb-6 text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Track Your Order</h1>
              <p className="text-lg text-gray-500">Order #{order.id}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={refreshing} 
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Delivery Estimate Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 hover:shadow-xl transition-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === trackingSteps.length - 1 ? '🎉 Delivered!' : 'Estimated Delivery'}
              </h3>
              <p className="text-base text-gray-600">
                {currentStep === trackingSteps.length - 1 
                  ? 'Your order has been delivered successfully' 
                  : `Arriving in ${getEstimatedTime()}`}
              </p>
            </div>
            
            {currentStep >= 3 && currentStep < trackingSteps.length - 1 && (
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl shadow-md transition-all">
                <Navigation className="h-4 w-4 mr-2" />
                Track Live
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="relative pt-4">
            <div className="flex items-center justify-between mb-8">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex flex-col items-center gap-3 relative">
                    <div className={`w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center ${getStatusColor(index)} relative z-10 transition-all duration-300`}>
                      <Icon className={`h-5 w-5 ${index <= currentStep ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <span className={`text-xs font-medium text-center max-w-[80px] ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="absolute top-10 left-6 right-6 h-1 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-10">
          <div className="bg-white p-2 shadow-lg border border-gray-200 rounded-full">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'details', label: 'Order Details', icon: Package },
                { id: 'support', label: 'Support', icon: Headphones }
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Order Timeline</h3>
            </div>
            
            <div className="space-y-6">
              {trackingHistory.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">No updates yet. We'll notify you when things progress.</p>
                </div>
              )}
              
              {trackingHistory.map((event, index) => (
                <div key={index} className="flex items-start gap-5 relative">
                  {/* Vertical line connector */}
                  {index < trackingHistory.length - 1 && (
                    <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200" />
                  )}
                  
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full shadow-md relative z-10 ${
                    index === trackingHistory.length - 1 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 ring-4 ring-blue-100' 
                      : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    {index === trackingHistory.length - 1 ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{event.status}</h4>
                        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full">
                          {formatTimeAgo(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{event.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Delivery Address */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">Delivery Address</h4>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-semibold">{order?.shippingInfo?.firstName} {order?.shippingInfo?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-gray-700">{order?.shippingInfo?.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-gray-700">{order?.shippingInfo?.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="font-medium">{order?.shippingInfo?.address}</p>
                      <p className="text-gray-600 mt-1">{order?.shippingInfo?.city}, {order?.shippingInfo?.state} {order?.shippingInfo?.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-5">Order Summary</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <span className="text-gray-600 font-medium">Items ({order?.items?.length || 0})</span>
                    <span className="font-semibold text-gray-900">${(order?.subtotal ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <span className="text-gray-600 font-medium">Delivery Fee</span>
                    <span className="font-semibold text-gray-900">${(order?.deliveryFee ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="font-semibold text-gray-900">${(order?.tax ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-4 mt-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                      <span className="font-bold text-gray-900 text-lg">Total</span>
                      <span className="font-bold text-2xl text-blue-600">${(order?.total ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Items in this order</h4>
              <div className="grid gap-4">
                {(order?.items || []).map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all border border-gray-200"
                  >
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-xl shadow-sm" 
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 bg-white px-3 py-1 rounded-full">
                          Qty: <span className="font-semibold text-gray-900">{item.quantity}</span>
                        </span>
                        <span className="text-gray-600">
                          ${item.price.toFixed(2)} <span className="text-xs">each</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Headphones className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Customer Support</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-green-900 text-lg">Call Support</span>
                  </div>
                  <p className="text-sm text-green-800 mb-5 leading-relaxed">
                    Speak directly with our support team for immediate assistance.
                  </p>
                  <Button 
                    onClick={contactSupport} 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white w-full rounded-xl shadow-md py-6 text-base font-semibold transition-all"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call 1-800-GROCERY
                  </Button>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-md">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-orange-900 text-lg">Report Issue</span>
                  </div>
                  <p className="text-sm text-orange-800 mb-5 leading-relaxed">
                    Missing items, damaged goods, or delivery concerns.
                  </p>
                  <Button 
                    onClick={reportIssue} 
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white w-full rounded-xl shadow-md py-6 text-base font-semibold transition-all"
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Report Problem
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {currentStep === trackingSteps.length - 1 ? (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-5 text-lg">Rate Your Experience</h4>
                    
                    <div className="flex items-center justify-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          onClick={() => handleRateOrder(star)} 
                          className={`transition-all transform hover:scale-110 ${
                            star <= orderRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        >
                          <Star className={`h-10 w-10 ${star <= orderRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    
                    <textarea 
                      value={feedback} 
                      onChange={(e) => setFeedback(e.target.value)} 
                      placeholder="Tell us about your experience..." 
                      className="w-full p-4 border-2 border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none rounded-xl shadow-sm transition-all" 
                      rows={5} 
                    />
                    
                    <Button 
                      onClick={handleSubmitFeedback} 
                      className="mt-5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white w-full rounded-xl shadow-md py-6 text-base font-semibold transition-all"
                    >
                      Submit Feedback
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Order in Progress</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You'll be able to rate your experience once your order is delivered.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder