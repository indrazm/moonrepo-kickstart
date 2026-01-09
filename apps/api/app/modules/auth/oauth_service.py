import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.core.settings import settings


def get_google_auth_url() -> str:
    """Generate Google OAuth authorization URL."""
    return (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.google_client_id}&"
        f"redirect_uri={settings.google_redirect_uri}&"
        f"response_type=code&"
        f"scope=openid email profile"
    )


def get_github_auth_url() -> str:
    """Generate GitHub OAuth authorization URL."""
    return (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={settings.github_client_id}&"
        f"redirect_uri={settings.github_redirect_uri}&"
        f"scope=user:email read:user"
    )


async def exchange_google_code(code: str) -> dict:
    """Exchange Google authorization code for access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": settings.google_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        response.raise_for_status()
        return response.json()


async def exchange_github_code(code: str) -> dict:
    """Exchange GitHub authorization code for access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "code": code,
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
            },
            headers={"Accept": "application/json"},
        )
        response.raise_for_status()
        return response.json()


async def get_google_user_info(access_token: str) -> dict:
    """Get user information from Google."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        return response.json()


async def get_github_user_info(access_token: str) -> dict:
    """Get user information from GitHub."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        return response.json()


async def get_github_user_email(access_token: str) -> dict:
    """Get user email from GitHub."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        emails = response.json()
        for email in emails:
            if email.get("primary"):
                return email
        return emails[0] if emails else {}


async def get_or_create_oauth_user(
    db: AsyncSession,
    provider: str,
    provider_id: str,
    email: str,
    username: str | None,
    avatar_url: str | None,
    full_name: str | None,
) -> User:
    """Get existing OAuth user or create a new one."""
    result = await db.execute(
        select(User).where(
            User.oauth_provider == provider,
            User.oauth_provider_id == provider_id,
        )
    )
    user = result.scalar_one_or_none()

    if user:
        return user

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        user.oauth_provider = provider
        user.oauth_provider_id = provider_id
        user.avatar_url = avatar_url or user.avatar_url
        user.full_name = full_name or user.full_name
        await db.commit()
        await db.refresh(user)
        return user

    if not username:
        username = f"{provider}_{provider_id}"

    original_username = username
    counter = 1
    while True:
        result = await db.execute(select(User).where(User.username == username))
        if not result.scalar_one_or_none():
            break
        username = f"{original_username}{counter}"
        counter += 1

    new_user = User(
        email=email,
        username=username,
        oauth_provider=provider,
        oauth_provider_id=provider_id,
        avatar_url=avatar_url,
        full_name=full_name,
        hashed_password=None,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def handle_google_callback(db: AsyncSession, code: str) -> User:
    """Handle Google OAuth callback."""
    token_data = await exchange_google_code(code)
    access_token = token_data.get("access_token")

    if not access_token:
        raise ValueError("No access token received from Google")

    user_info = await get_google_user_info(access_token)

    email = user_info.get("email", "")
    provider_id = user_info.get("id", "")
    username = user_info.get("given_name", "").lower()
    avatar_url = user_info.get("picture")
    full_name = user_info.get("name")

    return await get_or_create_oauth_user(
        db,
        provider="google",
        provider_id=provider_id,
        email=email,
        username=username,
        avatar_url=avatar_url,
        full_name=full_name,
    )


async def handle_github_callback(db: AsyncSession, code: str) -> User:
    """Handle GitHub OAuth callback."""
    token_data = await exchange_github_code(code)
    access_token = token_data.get("access_token")

    if not access_token:
        raise ValueError("No access token received from GitHub")

    user_info = await get_github_user_info(access_token)
    email_info = await get_github_user_email(access_token)

    email = email_info.get("email", user_info.get("email", ""))
    provider_id = str(user_info.get("id", ""))
    username = user_info.get("login", "")
    avatar_url = user_info.get("avatar_url")
    full_name = user_info.get("name")

    return await get_or_create_oauth_user(
        db,
        provider="github",
        provider_id=provider_id,
        email=email,
        username=username,
        avatar_url=avatar_url,
        full_name=full_name,
    )
