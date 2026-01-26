"""
Document upload and management API endpoints.

Handles document upload, processing, and session management.
Supports PDF and TXT files with configurable chunking.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional

from app.services.rag_pipeline import RAGPipeline
from app.models.schemas import DocumentUploadResponse, SessionInfo

router = APIRouter(prefix="/documents", tags=["Documents"])

# Shared pipeline instance
pipeline = RAGPipeline()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(..., description="PDF or TXT file to upload"),
    session_id: Optional[str] = Query(None, description="Existing session ID, or leave empty to create new")
):
    """
    Upload and process a document for RAG.
    
    This endpoint:
    1. Creates a new session if none provided
    2. Extracts text from the uploaded file
    3. Chunks the text with configured parameters
    4. Generates embeddings and stores in FAISS
    
    Supported file types: PDF, TXT
    
    Request:
    - file: The document file to upload
    - session_id: Optional existing session to add to
    
    Response:
    - session_id: Use this for subsequent queries
    - num_chunks: How many chunks were created
    - chunk_size/overlap: Chunking parameters used
    """
    # Validate file type
    filename = file.filename or "document.txt"
    if not (filename.lower().endswith('.pdf') or filename.lower().endswith('.txt')):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF or TXT file."
        )
    
    # Create or validate session
    if session_id is None:
        session_id = pipeline.create_session()
    elif not pipeline.vector_store_service.session_exists(session_id):
        # Create the session if it doesn't exist
        session_id = pipeline.create_session()
    
    try:
        # Read file content
        content = await file.read()
        
        if len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )
        
        # Process document
        result = pipeline.process_document(
            session_id=session_id,
            file_content=content,
            filename=filename
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}"
        )


@router.get("/session/{session_id}", response_model=SessionInfo)
async def get_session_info(session_id: str):
    """
    Get information about a session's documents.
    
    Returns:
    - List of uploaded documents
    - Total chunks indexed
    - Session creation time
    """
    session = pipeline.vector_store_service.get_session_info(session_id)
    
    if session is None:
        raise HTTPException(
            status_code=404,
            detail=f"Session {session_id} not found"
        )
    
    return SessionInfo(
        session_id=session.session_id,
        documents=session.documents,
        total_chunks=session.total_chunks,
        created_at=session.created_at
    )


@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a session and all its documents.
    
    Frees up memory by removing the session's vector store.
    This action cannot be undone.
    """
    deleted = pipeline.vector_store_service.delete_session(session_id)
    
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail=f"Session {session_id} not found"
        )
    
    return JSONResponse(
        content={"message": f"Session {session_id} deleted successfully"}
    )


@router.post("/session/create")
async def create_session():
    """
    Create a new empty session.
    
    Use this to get a session ID before uploading documents.
    Useful for preparing the UI before file selection.
    """
    session_id = pipeline.create_session()
    return {"session_id": session_id}
