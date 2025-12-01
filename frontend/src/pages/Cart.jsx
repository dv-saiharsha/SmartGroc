import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useCart } from '../context/CartContext'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag
} from 'lucide-react'

const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    total, 
    itemCount 
  } = useCart()
  
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const deliveryFee = 2.99
  const discount = promoApplied ? 5.00 : 0
  const finalTotal = total + deliveryFee - discount

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true)
      setPromoCode('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 flex items-center justify-center mx-auto mb-6 sm:mb-8" style={{borderRadius: '50%'}}>
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Your cart is empty
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link to="/products">
              <Button className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 transition-colors" style={{borderRadius: '25px'}}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <Link to="/products" className="text-primary hover:text-primary-dark flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 shadow-lg" style={{borderRadius: '25px'}}>
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex items-center space-x-4">
                    
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0" style={{borderRadius: '25px'}}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 bg-gray-100 p-1" style={{borderRadius: '25px'}}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 hover:bg-white border border-gray-300"
                        style={{borderRadius: '50%'}}
                      >
                        <Minus className="h-4 w-4 text-gray-700" />
                      </Button>
                      
                      <span className="w-10 text-center font-semibold text-gray-900 text-sm">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 hover:bg-white border border-gray-300"
                        style={{borderRadius: '50%'}}
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-lg font-bold text-gray-900 w-24 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-200 hover:bg-red-50 border-2 px-4 py-2 bg-white transition-colors"
                  style={{borderRadius: '25px'}}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 shadow-lg sticky top-8" style={{borderRadius: '25px'}}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    style={{borderRadius: '5px'}}
                    disabled={promoApplied}
                  />
                  <Button
                    onClick={handleApplyPromo}
                    disabled={promoApplied}
                    className="border-2 border-gray-300 bg-white hover:bg-gray-50 text-black px-4 py-2 transition-colors"
                    style={{borderRadius: '25px'}}
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Promo code applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout">
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-medium text-lg py-3 px-6 transition-colors" style={{borderRadius: '25px'}}>
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              {/* Security Info */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>🔒 Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart