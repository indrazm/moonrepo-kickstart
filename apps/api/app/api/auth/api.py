from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_db
from app.models.user import User
from app.modules.auth.service import (
    create_user,
    authenticate_user,
    create_tokens_for_user,
    refresh_access_token,
    get_current_user,
)
from .serializer import (
    UserCreate,
    UserResponse,
    Token,
    RefreshTokenRequest,
    AccessTokenResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await create_user(
        db, user_data.email, user_data.username, user_data.password
    )
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    tokens = await create_tokens_for_user(db, user)
    return tokens


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    tokens = await refresh_access_token(db, refresh_data.refresh_token)
    return tokens
