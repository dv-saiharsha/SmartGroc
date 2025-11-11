# SmartGrocer Cloud - System Design

## Architecture Overview

SmartGrocer Cloud follows a modern microservices architecture with the following components:

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│    │  FastAPI        │    │   MongoDB       │
│   (Port 3000)   │◄──►│  Backend        │◄──►│   Database      │
│                 │    │  (Port 8000)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   AWS S3        │    │   Redis Cache   │    │   Payment       │
│   File Storage  │    │   (Optional)    │    │   Gateway       │
│                 │    │                 │    │   (Stripe/Razor)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **ShadCN UI** - Component library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Query** - Data fetching and caching

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Motor** - Async MongoDB driver
- **Python-Jose** - JWT handling
- **Passlib** - Password hashing
- **Boto3** - AWS SDK

### Database & Storage
- **MongoDB Atlas** - Primary database
- **Redis** - Caching (optional)
- **AWS S3** - File storage

### External Services
- **Stripe/Razorpay** - Payment processing
- **AWS SES** - Email notifications
- **Twilio** - SMS notifications (optional)

## Data Models

### User Model
```python
{
  "_id": ObjectId,
  "email": String,
  "full_name": String,
  "phone": String (optional),
  "hashed_password": String,
  "is_seller": Boolean,
  "is_active": Boolean,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

### Product Model
```python
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "price": Decimal,
  "category": String,
  "images": [String],
  "stock": Integer,
  "seller_id": ObjectId,
  "is_active": Boolean,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

### Order Model
```python
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "items": [{
    "product_id": ObjectId,
    "quantity": Integer,
    "price": Decimal
  }],
  "total_amount": Decimal,
  "status": String,
  "payment_status": String,
  "shipping_address": Object,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

## API Design

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Product Endpoints
- `GET /products` - List products
- `GET /products/{id}` - Get product details
- `POST /products` - Create product (sellers only)
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Order Endpoints
- `POST /orders` - Create order
- `GET /orders/my-orders` - Get user orders
- `GET /orders/{id}` - Get order details
- `PATCH /orders/{id}/status` - Update order status

## Security Considerations

1. **Authentication**: JWT-based authentication with refresh tokens
2. **Authorization**: Role-based access control (buyer/seller/admin)
3. **Data Validation**: Pydantic models for request/response validation
4. **Password Security**: Bcrypt hashing with salt
5. **CORS**: Configured for frontend-backend communication
6. **Rate Limiting**: To be implemented for API endpoints
7. **Input Sanitization**: XSS protection
8. **HTTPS**: SSL/TLS encryption in production

## Scalability & Performance

### Horizontal Scaling
- Frontend: CDN distribution
- Backend: Load balancer with multiple instances
- Database: MongoDB sharding and replicas

### Caching Strategy
- Redis for session management
- Browser caching for static assets
- API response caching for product listings

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling
- Read replicas for read-heavy operations

## Deployment Architecture

### Development
- Local development with Docker Compose
- Hot reloading for both frontend and backend

### Production
- Frontend: Vercel or AWS CloudFront
- Backend: AWS EC2 with Auto Scaling Groups
- Database: MongoDB Atlas
- File Storage: AWS S3 with CloudFront
- Monitoring: AWS CloudWatch

## Error Handling & Logging

### Error Handling
- Centralized error handling in FastAPI
- User-friendly error messages
- Proper HTTP status codes

### Logging
- Structured logging with JSON format
- Different log levels (DEBUG, INFO, WARNING, ERROR)
- Log aggregation for production monitoring

## Testing Strategy

### Frontend Testing
- Unit tests with Jest/Vitest
- Component testing with React Testing Library
- E2E tests with Playwright

### Backend Testing
- Unit tests with pytest
- API integration tests
- Database testing with test fixtures

## Monitoring & Analytics

### Application Monitoring
- Health check endpoints
- Performance metrics
- Error tracking

### Business Analytics
- User behavior tracking
- Sales analytics
- Inventory management

This system design provides a robust, scalable foundation for the SmartGrocer Cloud application while maintaining flexibility for future enhancements.