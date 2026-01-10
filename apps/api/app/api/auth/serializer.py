from sqlmodel import SQLModel
from pydantic import EmailStr
from typing import Optional
from app.models.user import UserRole


# --- User Schemas ---


class UserBase(SQLModel):
    """Base schema with shared fields"""

    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Schema for user registration"""

    password: str


class UserResponse(UserBase):
    """Schema for API responses (excludes sensitive fields)"""

    id: str
    is_active: bool
    role: UserRole
    oauth_provider: Optional[str] = None
    avatar_url: Optional[str] = None
    full_name: Optional[str] = None

    model_config = {"from_attributes": True}


# --- OAuth Schemas ---


class OAuthUrlResponse(SQLModel):
    auth_url: str


# --- Token Schemas ---


class Token(SQLModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(SQLModel):
    username: Optional[str] = None


class RefreshTokenRequest(SQLModel):
    refresh_token: str


class AccessTokenResponse(SQLModel):
    access_token: str
    token_type: str


# --- Role Management Schemas ---


class UserRoleUpdate(SQLModel):
    """Schema for updating user role (admin only)"""

    role: UserRole


# --- Profile Management Schemas ---


class UserProfileUpdate(SQLModel):
    """Schema for updating user profile"""

    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
