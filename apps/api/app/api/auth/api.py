from typing import Annotated
from fastapi import APIRouter, Depends, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.database import get_db
from app.models.user import User
from app.modules.auth.service import (
    create_user,
    authenticate_user,
    create_tokens_for_user,
    refresh_access_token,
    get_current_user,
)
from app.modules.auth.oauth_service import (
    handle_google_callback,
    handle_github_callback,
    get_google_auth_url,
    get_github_auth_url,
)
from .serializer import (
    UserCreate,
    UserResponse,
    Token,
    RefreshTokenRequest,
    AccessTokenResponse,
    OAuthUrlResponse,
)
from app.core.settings import settings

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


@router.get("/google", response_model=OAuthUrlResponse)
async def google_oauth_init():
    """Initiate Google OAuth flow"""
    auth_url = get_google_auth_url()
    return {"auth_url": auth_url}


@router.get("/google/callback")
async def google_oauth_callback(
    code: str = Query(...),
    state: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Handle Google OAuth callback"""
    user = await handle_google_callback(db, code)
    tokens = await create_tokens_for_user(db, user)

    redirect_url = f"{settings.frontend_url}/auth/callback?access_token={tokens['access_token']}&refresh_token={tokens['refresh_token']}"
    return RedirectResponse(url=redirect_url)


@router.get("/github", response_model=OAuthUrlResponse)
async def github_oauth_init():
    """Initiate GitHub OAuth flow"""
    auth_url = get_github_auth_url()
    return {"auth_url": auth_url}


@router.get("/github/callback")
async def github_oauth_callback(
    code: str = Query(...),
    state: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Handle GitHub OAuth callback"""
    user = await handle_github_callback(db, code)
    tokens = await create_tokens_for_user(db, user)

    redirect_url = f"{settings.frontend_url}/auth/callback?access_token={tokens['access_token']}&refresh_token={tokens['refresh_token']}"
    return RedirectResponse(url=redirect_url)
