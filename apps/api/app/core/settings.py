from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the root directory (5 levels up from this file)
ROOT_DIR = Path(__file__).parent.parent.parent.parent.parent


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/dbname"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/auth/google/callback"

    github_client_id: str = ""
    github_client_secret: str = ""
    github_redirect_uri: str = "http://localhost:8000/auth/github/callback"

    frontend_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"), env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
