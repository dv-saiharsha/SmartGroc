import api from './api'

export const paymentService = {
  async createPaymentIntent(amount, currency = 'usd') {
    const response = await api.post('/payments/create-intent', { amount, currency })
    return response.data
  },

  async confirmPayment(paymentIntentId, paymentMethodId) {
    const response = await api.post('/payments/confirm', {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentMethodId
    })
    return response.data
  },

  async processRazorpayPayment(orderId, paymentId, signature) {
    const response = await api.post('/payments/razorpay/verify', {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    })
    return response.data
  },

  async getPaymentHistory() {
    const response = await api.get('/payments/history')
    return response.data
  },

  async refundPayment(paymentId, amount) {
    const response = await api.post('/payments/refund', {
      payment_id: paymentId,
      amount
    })
    return response.data
  }
}