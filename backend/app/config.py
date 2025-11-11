import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "smartgrocer"
    
    # JWT Settings
    jwt_secret_key: str = "your-super-secret-jwt-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # AWS Settings
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "us-east-1"
    s3_bucket_name: Optional[str] = None
    
    # Email Settings
    aws_ses_region: str = "us-east-1"
    from_email: Optional[str] = None
    
    # Payment Settings
    stripe_publishable_key: Optional[str] = None
    stripe_secret_key: Optional[str] = None
    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None
    
    # OAuth Settings
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # Redis Settings
    redis_url: str = "redis://localhost:6379"
    
    # Development Settings
    debug: bool = True
    log_level: str = "INFO"
    
    # Twilio Settings (optional)
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_phone_number: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()