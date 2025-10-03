"""Application configuration."""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "RAG-Anything Studio"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_BASE_URL: Optional[str] = None
    DEFAULT_LLM_MODEL: str = "gpt-4o-mini"
    DEFAULT_VISION_MODEL: str = "gpt-4o"
    DEFAULT_EMBEDDING_MODEL: str = "text-embedding-3-large"

    # RAG-Anything Configuration
    WORKING_DIR: str = "./rag_storage"
    PARSER: str = "mineru"
    PARSE_METHOD: str = "auto"
    OUTPUT_DIR: str = "./output"

    ENABLE_IMAGE_PROCESSING: bool = True
    ENABLE_TABLE_PROCESSING: bool = True
    ENABLE_EQUATION_PROCESSING: bool = True

    # File Upload
    MAX_UPLOAD_SIZE: int = 52428800  # 50MB in bytes
    ALLOWED_EXTENSIONS: set[str] = {
        ".pdf", ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif",
        ".gif", ".webp", ".doc", ".docx", ".ppt", ".pptx",
        ".xls", ".xlsx", ".txt", ".md"
    }

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # PostgreSQL (future)
    DATABASE_URL: Optional[str] = None

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100


settings = Settings()
