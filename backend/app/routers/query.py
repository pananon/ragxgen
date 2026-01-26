"""
Query API endpoint for RAG-powered Q&A.

Handles user questions and returns answers grounded in uploaded documents.
"""

from fastapi import APIRouter, HTTPException
from app.services.rag_pipeline import RAGPipeline
from app.models.schemas import QueryRequest, QueryResponse

router = APIRouter(prefix="/query", tags=["Query"])

# Shared pipeline instance
pipeline = RAGPipeline()


@router.post("/", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Ask a question about uploaded documents.
    
    This endpoint executes the full RAG pipeline:
    1. Embeds the question using the same model as documents
    2. Retrieves top-k most similar chunks from FAISS
    3. Constructs a prompt with retrieved context
    4. Generates an answer using the LLM
    5. Returns answer with sources and similarity scores
    
    Request:
    - session_id: The session containing your documents
    - question: Natural language question (max 2000 chars)
    - top_k: Optional override for number of chunks (1-10)
    
    Response:
    - answer: LLM-generated response grounded in documents
    - retrieved_contexts: Chunks used with similarity scores
    - sources: Document names cited
    - model_used: LLM model that generated the response
    - tokens_used: Total tokens consumed (if available)
    
    Error Codes:
    - 400: Invalid request (empty question, invalid session)
    - 404: Session not found or no documents uploaded
    - 500: Generation error
    """
    # Validate session exists
    if not pipeline.vector_store_service.session_exists(request.session_id):
        raise HTTPException(
            status_code=404,
            detail=f"Session {request.session_id} not found. Please upload documents first."
        )
    
    # Check if session has documents
    session = pipeline.vector_store_service.get_session_info(request.session_id)
    if session.total_chunks == 0:
        raise HTTPException(
            status_code=400,
            detail="No documents in session. Please upload at least one document."
        )
    
    try:
        # Execute RAG query
        response = pipeline.query(
            session_id=request.session_id,
            question=request.question,
            top_k=request.top_k
        )
        
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )


@router.get("/config")
async def get_configuration():
    """
    Get current RAG configuration.
    
    Returns the active configuration parameters:
    - Chunk size and overlap
    - Top-k retrieval setting
    - Model names for embedding and generation
    
    Useful for displaying current settings in the UI.
    """
    return pipeline.get_configuration()
