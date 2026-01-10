from datetime import timedelta
from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.user import User, UserRole
from app.models.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.core.settings import settings
from app.core.exceptions import (
    AuthenticationException,
    UserAlreadyExistsException,
    InactiveUserException,
)
from fastapi import HTTPException, status as http_status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    """Get user by username."""
    result = await db.exec(select(User).where(User.username == username))
    return result.one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Get user by email."""
    result = await db.exec(select(User).where(User.email == email))
    return result.one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    """Get user by ID."""
    result = await db.exec(select(User).where(User.id == user_id))
    return result.one_or_none()


async def check_user_exists(db: AsyncSession, email: str, username: str) -> bool:
    """Check if user with email or username already exists."""
    result = await db.exec(
        select(User).where((User.email == email) | (User.username == username))
    )
    return result.one_or_none() is not None


async def create_user(
    db: AsyncSession,
    email: str,
    username: str,
    password: str,
    role: UserRole = UserRole.USER,
) -> User:
    """Create a new user with specified role (defaults to USER)."""
    # Check if user already exists
    if await check_user_exists(db, email, username):
        raise UserAlreadyExistsException()

    # Create new user
    hashed_password = get_password_hash(password)
    new_user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        role=role,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def authenticate_user(db: AsyncSession, username: str, password: str) -> User:
    """Authenticate user with username and password."""
    user = await get_user_by_username(db, username)

    if (
        not user
        or not user.hashed_password
        or not verify_password(password, user.hashed_password)
    ):
        raise AuthenticationException(detail="Incorrect username or password")

    if not user.is_active:
        raise InactiveUserException()

    return user


def create_user_access_token(username: str, role: UserRole) -> str:
    """Create access token for user with role."""
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": username, "role": role.value}, expires_delta=access_token_expires
    )
    return access_token


def create_user_refresh_token(username: str) -> str:
    """Create refresh token for user."""
    refresh_token_expires = timedelta(days=settings.refresh_token_expire_days)
    refresh_token = create_refresh_token(
        data={"sub": username}, expires_delta=refresh_token_expires
    )
    return refresh_token


async def create_tokens_for_user(db: AsyncSession, user: User) -> dict:
    """Create both access and refresh tokens for user and store refresh token."""
    access_token = create_user_access_token(user.username, user.role)
    refresh_token = create_user_refresh_token(user.username)

    # Store refresh token in database
    user.refresh_token = refresh_token
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


async def refresh_access_token(db: AsyncSession, refresh_token: str) -> dict:
    """Generate new access token from refresh token."""
    payload = decode_refresh_token(refresh_token)
    if payload is None:
        raise AuthenticationException(detail="Invalid refresh token")

    username: str | None = payload.get("sub")  # type: ignore[assignment]
    if username is None:
        raise AuthenticationException(detail="Invalid refresh token")

    user = await get_user_by_username(db, username)
    if user is None or user.refresh_token != refresh_token:
        raise AuthenticationException(detail="Invalid refresh token")

    if not user.is_active:
        raise InactiveUserException()

    # Create new access token
    access_token = create_user_access_token(user.username, user.role)

    return {"access_token": access_token, "token_type": "bearer"}


async def get_current_user_from_token(db: AsyncSession, token: str) -> User:
    """Get current user from JWT token."""
    payload = decode_access_token(token)
    if payload is None:
        raise AuthenticationException()

    username: str | None = payload.get("sub")  # type: ignore[assignment]
    if username is None:
        raise AuthenticationException()

    user = await get_user_by_username(db, username)
    if user is None:
        raise AuthenticationException()

    return user


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI dependency to get current authenticated user from request."""
    return await get_current_user_from_token(db, token)


async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """FastAPI dependency to verify user is an admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_current_moderator(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """FastAPI dependency to verify user is a moderator or admin."""
    if current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Moderator or admin access required",
        )
    return current_user


def require_role(required_role: UserRole):
    """Factory function to create a role check dependency."""

    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if not current_user.has_role(required_role):
            raise HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail=f"Role {required_role.value} or higher required",
            )
        return current_user

    return role_checker
