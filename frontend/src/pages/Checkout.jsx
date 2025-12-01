import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { 
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Check,
  ArrowLeft,
  Shield,
  Apple,
  Chrome,
  DollarSign,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, total, itemCount, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [step, setStep] = useState(1) // 1: Details, 2: Payment, 3: Review
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card', // card, paypal, apple, google, bnpl
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  })
  
  const [deliveryOption, setDeliveryOption] = useState('standard')
  
  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      navigate('/products')
    }
  }, [itemCount, navigate])
  
  // Delivery options
  const deliveryOptions = [
    {
      id: 'express',
      name: 'Express Delivery',
      description: '30 minutes - 1 hour',
      price: 4.99,
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '2-4 hours',
      price: 2.99,
      icon: <Truck className="h-5 w-5" />
    },
    {
      id: 'scheduled',
      name: 'Scheduled Delivery',
      description: 'Choose your time slot',
      price: 1.99,
      icon: <Calendar className="h-5 w-5" />
    }
  ]
  
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      description: 'Touch ID or Face ID',
      icon: <Apple className="h-5 w-5" />
    },
    {
      id: 'google',
      name: 'Google Pay',
      description: 'Pay with Google',
      icon: <Chrome className="h-5 w-5" />
    },
    {
      id: 'bnpl',
      name: 'Buy Now, Pay Later',
      description: 'Split into 4 interest-free payments',
      icon: <DollarSign className="h-5 w-5" />
    }
  ]
  
  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryOption)
  const subtotal = total
  const deliveryFee = selectedDelivery?.price || 0
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal + deliveryFee + tax
  
  const validateStep = (stepNumber) => {
    const newErrors = {}
    
    if (stepNumber >= 1) {
      // Validate shipping info
      if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!shippingInfo.email.trim()) newErrors.email = 'Email is required'
      if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!shippingInfo.address.trim()) newErrors.address = 'Address is required'
      if (!shippingInfo.city.trim()) newErrors.city = 'City is required'
      if (!shippingInfo.state.trim()) newErrors.state = 'State is required'
      if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    }
    
    if (stepNumber >= 2 && paymentInfo.method === 'card') {
      // Validate card info
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
      if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required'
      if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }
  
  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return
    
    setIsLoading(true)
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order object
      const estimatedDeliveryTime = deliveryOption === 'express' ? 3600000 : deliveryOption === 'standard' ? 14400000 : 86400000
      const order = {
        id: `ORD-${Date.now()}`,
        items,
        subtotal,
        deliveryFee,
        tax,
        total: finalTotal,
        shippingInfo,
        billingInfo: billingInfo.sameAsShipping ? shippingInfo : billingInfo,
        paymentMethod: paymentInfo.method,
        deliveryOption,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + estimatedDeliveryTime).toISOString(),
        createdAt: new Date().toISOString()
      }
      
      // Store order in localStorage (in real app, send to backend)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))
      
      // Clear cart
      clearCart()
      
      // Redirect to success page
      navigate(`/order-success/${order.id}`)
      
    } catch (error) {
      console.error('Order failed:', error)
      setErrors({ submit: 'Failed to process order. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }
  
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-10">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Button
            onClick={() => navigate('/cart')}
            className="mb-6 text-gray-600 hover:text-black border-2 border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 transition-colors"
            style={{borderRadius: '25px'}}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Complete your order and get your groceries delivered
              </p>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 sm:gap-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md transition-all duration-200 ${
                    step >= stepNum ? 'bg-black text-white' : 'bg-white text-gray-500 border-2 border-gray-300'
                  }`} style={{borderRadius: '25px'}}>
                    {step > stepNum ? <Check className="h-4 w-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 sm:w-12 h-1 mx-2 transition-all duration-200 ${
                      step > stepNum ? 'bg-black' : 'bg-gray-200'
                    }`} style={{borderRadius: '50px'}} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 sm:gap-8 text-sm text-gray-600 mt-4 sm:mt-6">
            <span className={`transition-colors ${step === 1 ? 'text-black font-semibold' : 'hover:text-gray-900'}`}>
              1. Shipping Details
            </span>
            <span className={`transition-colors ${step === 2 ? 'text-black font-semibold' : 'hover:text-gray-900'}`}>
              2. Payment Method
            </span>
            <span className={`transition-colors ${step === 3 ? 'text-black font-semibold' : 'hover:text-gray-900'}`}>
              3. Review Order
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Step 1: Shipping Details */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white p-6 sm:p-8 shadow-lg border border-gray-100" style={{borderRadius: '25px'}}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3" style={{borderRadius: '50%'}}>
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className={`px-4 py-3 border-2 focus:outline-none focus:border-black transition-colors ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        style={{borderRadius: '12px'}}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className={errors.lastName ? 'border-red-500' : ''}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className={`px-4 py-3 border-2 focus:outline-none focus:border-black transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        style={{borderRadius: '12px'}}
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className={`px-4 py-3 border-2 focus:outline-none focus:border-black transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        style={{borderRadius: '12px'}}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 sm:p-8 shadow-lg border border-gray-100" style={{borderRadius: '25px'}}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                    <div className="w-8 h-8 bg-green-100 flex items-center justify-center mr-3" style={{borderRadius: '50%'}}>
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    Shipping Address
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <Input
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className={`px-4 py-3 border-2 focus:outline-none focus:border-black transition-colors ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        style={{borderRadius: '12px'}}
                        placeholder="Enter street address"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <Input
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className={`px-4 py-3 border-2 focus:outline-none focus:border-black transition-colors ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                          style={{borderRadius: '12px'}}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <Input
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          className={errors.state ? 'border-red-500' : ''}
                          placeholder="State"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <Input
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          className={errors.zipCode ? 'border-red-500' : ''}
                          placeholder="ZIP Code"
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-white p-6 sm:p-8 shadow-lg border border-gray-100" style={{borderRadius: '25px'}}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                    <div className="w-8 h-8 bg-orange-100 flex items-center justify-center mr-3" style={{borderRadius: '50%'}}>
                      <Truck className="h-4 w-4 text-orange-600" />
                    </div>
                    Delivery Options
                  </h2>
                  
                  <div className="space-y-4">
                    {deliveryOptions.map((option) => (
                      <label key={option.id} className={`flex items-center p-4 sm:p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        deliveryOption === option.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                      }`} style={{borderRadius: '16px'}}>
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                          className="mr-4 w-5 h-5 text-black focus:ring-black"
                        />
                        <div className="flex items-center flex-1">
                          <div className="mr-4 p-2 bg-gray-100" style={{borderRadius: '50%'}}>
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-base">{option.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                          </div>
                          <div className="font-bold text-gray-900 text-lg">${option.price.toFixed(2)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method - Continuing in next part due to length */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="bg-white p-6 sm:p-8 shadow-lg border border-gray-100" style={{borderRadius: '25px'}}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 flex items-center justify-center mr-3" style={{borderRadius: '50%'}}>
                      <CreditCard className="h-4 w-4 text-purple-600" />
                    </div>
                    Payment Method
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className={`flex items-center p-4 sm:p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        paymentInfo.method === method.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                      }`} style={{borderRadius: '16px'}}>
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentInfo.method === method.id}
                          onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value})}
                          className="mr-4 w-5 h-5 text-black focus:ring-black"
                        />
                        <div className="flex items-center flex-1">
                          <div className="mr-4 p-2 bg-gray-100" style={{borderRadius: '50%'}}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-base">{method.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Card Details */}
                  {paymentInfo.method === 'card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <Input
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          className={errors.cardName ? 'border-red-500' : ''}
                          placeholder="Name on card"
                        />
                        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <Input
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                          className={errors.cardNumber ? 'border-red-500' : ''}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <Input
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                            className={errors.expiryDate ? 'border-red-500' : ''}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <Input
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                            className={errors.cvv ? 'border-red-500' : ''}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentInfo.saveCard}
                          onChange={(e) => setPaymentInfo({...paymentInfo, saveCard: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Save this card for future purchases</span>
                      </label>
                    </div>
                  )}

                  {paymentInfo.method !== 'card' && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You'll be redirected to complete your payment securely with {paymentMethods.find(m => m.id === paymentInfo.method)?.name}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-black mb-6">Billing Address</h2>
                  
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={billingInfo.sameAsShipping}
                      onChange={(e) => setBillingInfo({...billingInfo, sameAsShipping: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Same as shipping address</span>
                  </label>
                  
                  {!billingInfo.sameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={billingInfo.firstName}
                          onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                          placeholder="First Name"
                        />
                        <Input
                          value={billingInfo.lastName}
                          onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                          placeholder="Last Name"
                        />
                      </div>
                      <Input
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                        placeholder="Address"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                          placeholder="City"
                        />
                        <Input
                          value={billingInfo.state}
                          onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                          placeholder="State"
                        />
                        <Input
                          value={billingInfo.zipCode}
                          onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                          placeholder="ZIP"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white p-6 sm:p-8 shadow-lg border border-gray-100" style={{borderRadius: '25px'}}>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3" style={{borderRadius: '50%'}}>
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  Review Your Order
                </h2>
                
                {/* Order Summary */}
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 sm:p-5 border-2 border-gray-100 bg-gray-50 hover:bg-white transition-colors" style={{borderRadius: '16px'}}>
                      <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover shadow-sm" style={{borderRadius: '12px'}} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-black">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-black mb-3">Shipping Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-black mb-3">Payment & Delivery</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{paymentMethods.find(m => m.id === paymentInfo.method)?.name}</p>
                      <p>{selectedDelivery?.name} - ${selectedDelivery?.price.toFixed(2)}</p>
                      <p>{selectedDelivery?.description}</p>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200" style={{borderRadius: '16px'}}>
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center" style={{borderRadius: '50%'}}>
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-green-800 block">Secure Transaction Guaranteed</span>
                    <p className="text-green-700 mt-1">Your payment information is encrypted with 256-bit SSL security.</p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg mt-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-12">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 font-semibold transition-all"
                  style={{borderRadius: '25px'}}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Step
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  onClick={handleNextStep}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 font-semibold transition-all shadow-lg hover:shadow-xl ml-auto"
                  style={{borderRadius: '25px'}}
                >
                  Continue to {step === 1 ? 'Payment' : 'Review'}
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 px-8 py-3 font-semibold transition-all shadow-lg hover:shadow-xl ml-auto"
                  style={{borderRadius: '25px'}}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Secure Order - ${finalTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-8" style={{borderRadius: '25px'}}>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">Order Summary</h3>
              
              <div className="space-y-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors" style={{borderRadius: '12px'}}>
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover shadow-sm" style={{borderRadius: '8px'}} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs font-medium" style={{borderRadius: '8px'}}>
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <p className="text-xs text-gray-600 text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-black">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-black">${deliveryFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-black">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-lg font-bold text-black">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold text-black">Estimated Delivery</span>
                </div>
                <p className="text-xs text-gray-600">
                  {selectedDelivery?.description} • Free delivery on orders over $35
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout