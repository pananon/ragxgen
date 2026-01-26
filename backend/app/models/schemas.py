"""
Pydantic schemas for API request/response validation.

These models define the contract between frontend and backend,
ensuring type safety and automatic documentation generation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class DocumentChunk(BaseModel):
    """Represents a chunk of text extracted from a document."""
    
    content: str = Field(..., description="The text content of the chunk")
    chunk_index: int = Field(..., description="Position of chunk within document")
    source: str = Field(..., description="Original document filename")
    metadata: dict = Field(default_factory=dict, description="Additional metadata")


class DocumentUploadResponse(BaseModel):
    """Response after successfully uploading and processing a document."""
    
    session_id: str = Field(..., description="Unique session identifier")
    filename: str = Field(..., description="Name of uploaded file")
    num_chunks: int = Field(..., description="Number of chunks created")
    chunk_size: int = Field(..., description="Character size per chunk")
    chunk_overlap: int = Field(..., description="Overlap between chunks")
    message: str = Field(..., description="Status message")


class RetrievedContext(BaseModel):
    """A retrieved document chunk with its similarity score."""
    
    content: str = Field(..., description="Retrieved text content")
    source: str = Field(..., description="Source document name")
    chunk_index: int = Field(..., description="Chunk position in original document")
    similarity_score: float = Field(..., ge=0, le=1, description="Cosine similarity score (0-1)")
    

class QueryRequest(BaseModel):
    """Request to query the RAG system."""
    
    session_id: str = Field(..., description="Session ID from document upload")
    question: str = Field(..., min_length=1, max_length=2000, description="User's question")
    top_k: Optional[int] = Field(None, ge=1, le=10, description="Override default top-k retrieval")
    

class QueryResponse(BaseModel):
    """Response from the RAG system including answer and sources."""
    
    answer: str = Field(..., description="LLM-generated answer grounded in retrieved context")
    retrieved_contexts: List[RetrievedContext] = Field(
        ..., 
        description="Document chunks used to generate the answer"
    )
    sources: List[str] = Field(..., description="List of source document names cited")
    model_used: str = Field(..., description="LLM model that generated the response")
    tokens_used: Optional[int] = Field(None, description="Total tokens consumed")


class HealthResponse(BaseModel):
    """API health check response."""
    
    status: str = Field(..., description="Service status")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = Field(default="1.0.0", description="API version")


class SessionInfo(BaseModel):
    """Information about an active session."""
    
    session_id: str = Field(..., description="Session identifier")
    documents: List[str] = Field(..., description="Uploaded document names")
    total_chunks: int = Field(..., description="Total chunks in vector store")
    created_at: datetime = Field(..., description="Session creation time")


class ConfigurationResponse(BaseModel):
    """Current RAG configuration for display in UI."""
    
    chunk_size: int = Field(..., description="Characters per chunk")
    chunk_overlap: int = Field(..., description="Overlap between chunks")
    top_k: int = Field(..., description="Default chunks to retrieve")
    model_name: str = Field(..., description="LLM model name")
    embedding_model: str = Field(..., description="Embedding model name")
