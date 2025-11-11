# SmartGrocer Cloud - API Reference

## Base URL
- Development: `http://localhost:8000`
- Production: `https://api.smartgrocer.cloud`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "securepassword",
  "phone": "+1234567890",
  "is_seller": false
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_seller": false
  },
  "access_token": "jwt_token",
  "token_type": "bearer"
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "access_token": "jwt_token",
  "token_type": "bearer"
}
```

#### GET /auth/me
Get current user information (requires authentication).

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "is_seller": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Products

#### GET /products
Get list of products with optional filtering.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20)
- `category` (str): Filter by category
- `search` (str): Search in product names and descriptions
- `min_price` (float): Minimum price filter
- `max_price` (float): Maximum price filter

**Response:**
```json
{
  "items": [
    {
      "id": "product_id",
      "name": "Fresh Bananas",
      "description": "Organic bananas",
      "price": 2.99,
      "category": "fruits",
      "images": ["image_url"],
      "stock": 50,
      "seller_id": "seller_id",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

#### GET /products/{product_id}
Get detailed product information.

**Response:**
```json
{
  "id": "product_id",
  "name": "Fresh Bananas",
  "description": "Organic bananas, perfect for breakfast",
  "price": 2.99,
  "category": "fruits",
  "images": ["image_url1", "image_url2"],
  "stock": 50,
  "seller": {
    "id": "seller_id",
    "name": "Farm Fresh Co."
  },
  "reviews": [
    {
      "user": "John D.",
      "rating": 5,
      "comment": "Great quality!",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "average_rating": 4.5,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /products
Create a new product (sellers only, requires authentication).

**Request Body:**
```json
{
  "name": "Fresh Apples",
  "description": "Crispy red apples",
  "price": 3.99,
  "category": "fruits",
  "stock": 100,
  "images": ["image_url"]
}
```

**Response:**
```json
{
  "id": "product_id",
  "name": "Fresh Apples",
  "message": "Product created successfully"
}
```

#### PUT /products/{product_id}
Update product information (seller/admin only).

**Request Body:**
```json
{
  "name": "Premium Fresh Apples",
  "price": 4.99,
  "stock": 75
}
```

### Cart

#### GET /cart
Get current user's cart (requires authentication).

**Response:**
```json
{
  "items": [
    {
      "product_id": "product_id",
      "product_name": "Fresh Bananas",
      "price": 2.99,
      "quantity": 2,
      "subtotal": 5.98
    }
  ],
  "total": 5.98,
  "item_count": 2
}
```

#### POST /cart/items
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "product_id": "product_id",
  "quantity": 2
}
```

#### PUT /cart/items/{product_id}
Update item quantity in cart.

**Request Body:**
```json
{
  "quantity": 3
}
```

#### DELETE /cart/items/{product_id}
Remove item from cart.

### Orders

#### POST /orders
Create a new order (requires authentication).

**Request Body:**
```json
{
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA"
  },
  "payment_method": "stripe",
  "payment_details": {
    "payment_method_id": "pm_stripe_id"
  }
}
```

**Response:**
```json
{
  "id": "order_id",
  "total_amount": 25.97,
  "status": "pending",
  "payment_status": "processing",
  "estimated_delivery": "2024-01-05T00:00:00Z",
  "message": "Order created successfully"
}
```

#### GET /orders/my-orders
Get user's order history (requires authentication).

**Response:**
```json
{
  "orders": [
    {
      "id": "order_id",
      "total_amount": 25.97,
      "status": "delivered",
      "payment_status": "completed",
      "item_count": 3,
      "created_at": "2024-01-01T00:00:00Z",
      "estimated_delivery": "2024-01-05T00:00:00Z"
    }
  ],
  "total": 10
}
```

#### GET /orders/{order_id}
Get detailed order information (requires authentication).

**Response:**
```json
{
  "id": "order_id",
  "items": [
    {
      "product_name": "Fresh Bananas",
      "quantity": 2,
      "price": 2.99,
      "subtotal": 5.98
    }
  ],
  "total_amount": 25.97,
  "status": "delivered",
  "payment_status": "completed",
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001"
  },
  "tracking_number": "TRK123456789",
  "created_at": "2024-01-01T00:00:00Z",
  "delivered_at": "2024-01-03T00:00:00Z"
}
```

### Seller Dashboard

#### GET /seller/dashboard
Get seller dashboard data (requires seller authentication).

**Response:**
```json
{
  "total_products": 25,
  "total_orders": 150,
  "revenue": 2500.00,
  "pending_orders": 5,
  "recent_orders": [
    {
      "id": "order_id",
      "customer": "John Doe",
      "total": 19.99,
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /seller/products
Get seller's products (requires seller authentication).

**Response:**
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Fresh Bananas",
      "price": 2.99,
      "stock": 50,
      "status": "active",
      "orders_count": 25
    }
  ],
  "total": 25
}
```

### Analytics

#### GET /analytics/sales
Get sales analytics (requires seller/admin authentication).

**Query Parameters:**
- `period` (str): "day", "week", "month", "year"
- `start_date` (date): Start date for custom period
- `end_date` (date): End date for custom period

**Response:**
```json
{
  "total_revenue": 2500.00,
  "total_orders": 150,
  "average_order_value": 16.67,
  "sales_by_period": [
    {
      "date": "2024-01-01",
      "revenue": 150.00,
      "orders": 8
    }
  ],
  "top_products": [
    {
      "product_name": "Fresh Bananas",
      "sales": 50,
      "revenue": 149.50
    }
  ]
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message",
  "status_code": 400,
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to prevent abuse:
- Anonymous users: 100 requests per hour
- Authenticated users: 1000 requests per hour
- Sellers: 5000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642780800
```

## Webhooks

### Payment Webhook
Stripe/Razorpay payment notifications are handled at:
- `POST /webhooks/payment`

### Order Updates
Real-time order status updates can be received via WebSocket:
- `ws://localhost:8000/ws/orders/{user_id}`

This API reference covers the core functionality of the SmartGrocer Cloud platform. For detailed implementation examples, see the frontend source code in the `services/` directory.