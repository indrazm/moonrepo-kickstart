from pydantic_settings import BaseSettings
from pathlib import Path

# Get the root directory (2 levels up from this file)
ROOT_DIR = Path(__file__).parent.parent.parent.parent


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/dbname"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    class Config:
        env_file = str(ROOT_DIR / ".env")


settings = Settings()
