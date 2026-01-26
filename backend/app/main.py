"""
RAG Lab Backend - FastAPI Application

This is the main entry point for the RAG Lab backend API.
It provides endpoints for document upload, processing, and RAG-powered Q&A.

Architecture:
- /documents: Document upload and session management
- /query: RAG query execution
- /health: Health check endpoint

The backend uses:
- LangChain for RAG orchestration
- FAISS for vector similarity search
- OpenAI for embeddings and LLM generation
"""

from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import documents, query
from app.models.schemas import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    
    Runs startup and shutdown logic.
    """
    # Startup
    print("🚀 RAG Lab Backend starting...")
    settings = get_settings()
    print(f"📊 Configuration loaded:")
    print(f"   - Chunk size: {settings.chunk_size}")
    print(f"   - Chunk overlap: {settings.chunk_overlap}")
    print(f"   - Top-K: {settings.top_k}")
    print(f"   - Model: {settings.model_name}")
    print(f"   - Embeddings: {settings.embedding_model}")
    
    yield
    
    # Shutdown
    print("👋 RAG Lab Backend shutting down...")


# Create FastAPI application
app = FastAPI(
    title="RAG Lab API",
    description="""
    ## RAG Lab - Retrieval-Augmented Generation API
    
    This API powers the RAG Lab demo, providing:
    
    ### Document Processing
    - Upload PDF and TXT documents
    - Automatic text extraction and chunking
    - Embedding generation and FAISS indexing
    
    ### RAG Query
    - Natural language question answering
    - Context retrieval with similarity scores
    - Source citation and transparency
    
    ### How it works:
    1. Upload documents to create a session
    2. Documents are chunked and embedded
    3. Ask questions - relevant chunks are retrieved
    4. LLM generates answers grounded in your documents
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for frontend access
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router)
app.include_router(query.router)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API information.
    """
    return {
        "name": "RAG Lab API",
        "version": "1.0.0",
        "description": "Retrieval-Augmented Generation Demo API",
        "docs_url": "/docs",
        "health_url": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns current service status and timestamp.
    Useful for monitoring and load balancer checks.
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0"
    )


# Run with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
