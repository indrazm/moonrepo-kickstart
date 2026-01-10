from typing import Annotated
from fastapi import APIRouter, Depends, status, Query, HTTPException
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
    get_current_admin,
    get_user_by_id,
    update_user_profile,
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
    UserRoleUpdate,
    UserProfileUpdate,
)
from sqlmodel import select
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


@router.patch("/me", response_model=UserResponse)
async def update_users_me(
    profile_data: UserProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    """Update current user's profile"""
    updated_user = await update_user_profile(
        db, current_user, profile_data.full_name, profile_data.avatar_url
    )
    return updated_user


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


# Admin endpoints


@router.get("/admin/test", response_model=dict)
async def test_admin_access(admin_user: Annotated[User, Depends(get_current_admin)]):
    """Test endpoint to verify admin access."""
    return {
        "message": "Admin access granted",
        "user": {
            "id": admin_user.id,
            "username": admin_user.username,
            "role": admin_user.role,
        },
    }


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    admin_user: Annotated[User, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    """List all users (admin only)."""
    result = await db.exec(select(User))
    users = result.all()
    return users


@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    admin_user: Annotated[User, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    """Update user role (admin only)."""
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.role = role_update.role
    await db.commit()
    await db.refresh(user)
    return user
