from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/app"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PRIVATE_KEY_PATH: str = "keys/private.pem"
    PUBLIC_KEY_PATH: str = "keys/public.pem"
    ALGORITHM: str = "RS256"

settings = Settings()

