import api from './api'

export const productService = {
  async getAllProducts(params = {}) {
    const response = await api.get('/products', { params })
    return response.data
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async searchProducts(query, filters = {}) {
    const response = await api.get('/products/search', {
      params: { q: query, ...filters }
    })
    return response.data
  },

  async getProductsByCategory(category) {
    const response = await api.get(`/products/category/${category}`)
    return response.data
  },

  async getCategories() {
    const response = await api.get('/products/categories')
    return response.data
  },

  async getFeaturedProducts() {
    const response = await api.get('/products/featured')
    return response.data
  },

  async getProductReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`)
    return response.data
  },

  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  }
}