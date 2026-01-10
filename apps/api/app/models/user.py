from sqlmodel import SQLModel, Field
from typing import Optional
from ulid import ULID


class User(SQLModel, table=True):
    """
    User model for authentication and profile.

    This single model serves as both:
    - Database table model (via table=True)
    - Pydantic schema for validation
    """

    __tablename__ = "users"

    # Primary key
    id: str = Field(
        default_factory=lambda: str(ULID()),
        primary_key=True,
        index=True,
        max_length=26,
    )

    # Required fields
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)

    # Optional fields
    hashed_password: Optional[str] = Field(default=None)
    refresh_token: Optional[str] = Field(default=None)

    # OAuth fields
    oauth_provider: Optional[str] = Field(default=None)
    oauth_provider_id: Optional[str] = Field(default=None, index=True)
    avatar_url: Optional[str] = Field(default=None)
    full_name: Optional[str] = Field(default=None)
