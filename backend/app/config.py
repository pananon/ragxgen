"""
Configuration module for RagXGen backend.

Uses Pydantic Settings for environment variable management with validation
and type coercion. All RAG pipeline parameters are configurable here.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Attributes:
        openai_api_key: API key for OpenAI or compatible service (DeepSeek, etc.)
        openai_api_base: Base URL for API (change for DeepSeek or other providers)
        chunk_size: Number of characters per document chunk (affects retrieval granularity)
        chunk_overlap: Overlap between chunks to preserve context at boundaries
        top_k: Number of chunks to retrieve for each query
        model_name: Model for response generation
        embedding_model: Model for text embeddings
        cors_origins: Allowed origins for CORS (comma-separated)
    """
    
    # API Configuration (supports OpenAI, DeepSeek, or any OpenAI-compatible API)
    openai_api_key: str = ""
    openai_api_base: Optional[str] = None  # None = use default OpenAI URL
    
    # RAG Pipeline Configuration
    chunk_size: int = 1000
    chunk_overlap: int = 200
    top_k: int = 4
    
    # Model Configuration
    model_name: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"
    
    # Server Configuration
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    
    Uses LRU cache to avoid reloading environment variables on every call.
    Clear cache with get_settings.cache_clear() if needed.
    """
    return Settings()
