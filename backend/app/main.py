from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn

# Import routes
from app.routes import auth_routes, product_routes, cart_routes, order_routes, seller_routes, offer_routes, analytics_routes
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.config import settings

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

# Create FastAPI app
app = FastAPI(
    title="SmartGrocer Cloud API",
    description="A comprehensive grocery management API with cloud integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "SmartGrocer Cloud API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(product_routes.router, prefix="/products", tags=["Products"])
app.include_router(cart_routes.router, prefix="/cart", tags=["Cart"])
app.include_router(order_routes.router, prefix="/orders", tags=["Orders"])
app.include_router(seller_routes.router, prefix="/seller", tags=["Seller"])
app.include_router(offer_routes.router, prefix="/offers", tags=["Offers"])
app.include_router(analytics_routes.router, prefix="/analytics", tags=["Analytics"])

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {"error": exc.detail, "status_code": exc.status_code}

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {"error": "Internal server error", "status_code": 500}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )