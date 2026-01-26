"""
Embedding service for generating text embeddings.

This service wraps the OpenAI-compatible embeddings API to provide consistent
embedding generation for both document indexing and query time.
Supports OpenAI, DeepSeek, and other OpenAI-compatible APIs.
"""

from typing import List
from langchain_openai import OpenAIEmbeddings
from app.config import get_settings


class EmbeddingService:
    """
    Service for generating text embeddings using OpenAI-compatible APIs.
    
    The same embedding model must be used for both document indexing and
    query embedding to ensure vectors are in the same space.
    
    Attributes:
        embeddings: LangChain OpenAI embeddings wrapper
        model_name: Name of the embedding model being used
    """
    
    def __init__(self):
        """Initialize the embedding service with configured model."""
        settings = get_settings()
        
        self.model_name = settings.embedding_model
        
        # Build kwargs for embeddings - supports OpenAI, DeepSeek, etc.
        embed_kwargs = {
            "model": self.model_name,
            "openai_api_key": settings.openai_api_key,
        }
        
        # Add base URL if configured (for DeepSeek or other providers)
        if settings.openai_api_base:
            embed_kwargs["openai_api_base"] = settings.openai_api_base
        
        self.embeddings = OpenAIEmbeddings(**embed_kwargs)
    
    def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        
        Args:
            text: The text to embed
            
        Returns:
            List of floats representing the embedding vector
        """
        return self.embeddings.embed_query(text)
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts in batch.
        
        More efficient than calling embed_text multiple times as it
        batches the API calls.
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors, one per input text
        """
        return self.embeddings.embed_documents(texts)
    
    def get_langchain_embeddings(self) -> OpenAIEmbeddings:
        """
        Get the underlying LangChain embeddings object.
        
        Useful when integrating with other LangChain components
        that expect an embeddings instance.
        """
        return self.embeddings
