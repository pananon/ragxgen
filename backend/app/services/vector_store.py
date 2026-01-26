"""
Vector store service for managing FAISS indices.

This service handles creation, storage, and querying of FAISS vector stores.
Each user session gets its own isolated vector store to prevent data leakage.
"""

import os
import uuid
from typing import Dict, List, Optional, Tuple
from datetime import datetime

import faiss
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from app.services.embeddings import EmbeddingService
from app.config import get_settings


class SessionStore:
    """
    Container for a session's vector store and metadata.
    
    Attributes:
        session_id: Unique identifier for this session
        vector_store: FAISS vector store instance
        documents: List of original document names
        total_chunks: Number of chunks indexed
        created_at: Session creation timestamp
    """
    
    def __init__(self, session_id: str, vector_store: FAISS):
        self.session_id = session_id
        self.vector_store = vector_store
        self.documents: List[str] = []
        self.total_chunks: int = 0
        self.created_at: datetime = datetime.utcnow()


class VectorStoreService:
    """
    Service for managing session-based FAISS vector stores.
    
    Each session maintains an isolated vector store, allowing multiple
    users to upload different documents without interference. Vector
    stores are kept in memory for simplicity but could be persisted.
    
    Design decisions:
    - Session-based isolation for multi-user safety
    - In-memory storage for demo simplicity
    - FAISS IndexFlatIP for exact cosine similarity
    """
    
    # Class-level storage for session vector stores
    _sessions: Dict[str, SessionStore] = {}
    
    def __init__(self):
        """Initialize the vector store service."""
        self.embedding_service = EmbeddingService()
        self.settings = get_settings()
    
    def create_session(self) -> str:
        """
        Create a new session with an empty vector store.
        
        Returns:
            New session ID
        """
        session_id = str(uuid.uuid4())
        
        # Get embedding dimension by embedding a test string
        embeddings = self.embedding_service.get_langchain_embeddings()
        
        # Create FAISS vector store - will be populated when documents are added
        # We use a placeholder that will be replaced on first add
        VectorStoreService._sessions[session_id] = SessionStore(
            session_id=session_id,
            vector_store=None  # Will be created on first document add
        )
        
        return session_id
    
    def add_documents(
        self, 
        session_id: str,
        documents: List[Document],
        source_name: str
    ) -> int:
        """
        Add documents to a session's vector store.
        
        Args:
            session_id: Target session ID
            documents: List of LangChain Document objects
            source_name: Name of the source file
            
        Returns:
            Number of documents added
            
        Raises:
            ValueError: If session doesn't exist
        """
        if session_id not in VectorStoreService._sessions:
            raise ValueError(f"Session {session_id} not found")
        
        session = VectorStoreService._sessions[session_id]
        embeddings = self.embedding_service.get_langchain_embeddings()
        
        if session.vector_store is None:
            # Create new vector store with first documents
            session.vector_store = FAISS.from_documents(
                documents=documents,
                embedding=embeddings
            )
        else:
            # Add to existing vector store
            session.vector_store.add_documents(documents)
        
        # Update session metadata
        if source_name not in session.documents:
            session.documents.append(source_name)
        session.total_chunks += len(documents)
        
        return len(documents)
    
    def similarity_search(
        self,
        session_id: str,
        query: str,
        top_k: Optional[int] = None
    ) -> List[Tuple[Document, float]]:
        """
        Search for similar documents in a session's vector store.
        
        Uses cosine similarity to find the most relevant chunks.
        
        Args:
            session_id: Session to search in
            query: User's question
            top_k: Number of results (defaults to config value)
            
        Returns:
            List of (Document, similarity_score) tuples, sorted by relevance
            
        Raises:
            ValueError: If session doesn't exist or has no documents
        """
        if session_id not in VectorStoreService._sessions:
            raise ValueError(f"Session {session_id} not found")
        
        session = VectorStoreService._sessions[session_id]
        
        if session.vector_store is None:
            raise ValueError("No documents have been uploaded to this session")
        
        k = top_k or self.settings.top_k
        
        # FAISS returns (document, score) tuples
        # Note: FAISS uses L2 distance by default; we normalize for cosine similarity
        results = session.vector_store.similarity_search_with_score(query, k=k)
        
        # Convert distance to similarity score (0-1 range)
        # Lower distance = higher similarity
        processed_results = []
        for doc, distance in results:
            # Normalize score: use exponential decay for intuitive 0-1 range
            similarity = 1 / (1 + distance)
            processed_results.append((doc, similarity))
        
        return processed_results
    
    def get_session_info(self, session_id: str) -> Optional[SessionStore]:
        """Get session metadata if it exists."""
        return VectorStoreService._sessions.get(session_id)
    
    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session and its vector store.
        
        Args:
            session_id: Session to delete
            
        Returns:
            True if session was deleted, False if it didn't exist
        """
        if session_id in VectorStoreService._sessions:
            del VectorStoreService._sessions[session_id]
            return True
        return False
    
    def session_exists(self, session_id: str) -> bool:
        """Check if a session exists."""
        return session_id in VectorStoreService._sessions
    
    @classmethod
    def get_active_sessions(cls) -> int:
        """Get count of active sessions."""
        return len(cls._sessions)
