from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from app.models.user_model import UserCreate, UserLogin, User, Token
from app.controllers.user_controller import UserController
from app.database.connection import get_database

router = APIRouter()
security = HTTPBearer()
user_controller = UserController()

@router.post("/signup", response_model=dict)
async def signup(user_data: UserCreate, db = Depends(get_database)):
    """Create a new user account"""
    try:
        result = await user_controller.create_user(user_data, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=dict)
async def login(user_credentials: UserLogin, db = Depends(get_database)):
    """Authenticate user and return access token"""
    try:
        result = await user_controller.authenticate_user(user_credentials, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

@router.get("/me", response_model=User)
async def get_current_user(token: str = Depends(security), db = Depends(get_database)):
    """Get current user information"""
    try:
        user = await user_controller.get_current_user(token.credentials, db)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(token: str = Depends(security), db = Depends(get_database)):
    """Refresh access token"""
    try:
        result = await user_controller.refresh_token(token.credentials, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )