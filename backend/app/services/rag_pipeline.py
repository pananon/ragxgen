"""
RAG Pipeline - Core retrieval-augmented generation implementation.

This module orchestrates the complete RAG workflow:
1. Document ingestion and chunking
2. Query processing and retrieval
3. Context-augmented prompt construction
4. LLM response generation

Design Philosophy:
- Configurable chunking for different use cases
- Clear separation between retrieval and generation
- Detailed metadata for transparency and debugging
"""

import os
from typing import List, Optional, Tuple

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from pypdf import PdfReader

from app.config import get_settings
from app.services.vector_store import VectorStoreService
from app.models.schemas import (
    RetrievedContext,
    QueryResponse,
    DocumentUploadResponse,
)


class RAGPipeline:
    """
    Complete RAG pipeline for document Q&A.
    
    This class handles the entire RAG workflow from document ingestion
    to answer generation. It uses:
    - RecursiveCharacterTextSplitter for intelligent chunking
    - FAISS for vector similarity search
    - OpenAI for embeddings and generation
    
    Trade-offs implemented:
    - Chunk size: Larger chunks = more context but less precise retrieval
    - Overlap: Prevents losing context at chunk boundaries
    - Top-K: More chunks = more context but higher latency and cost
    """
    
    # System prompt template for RAG
    SYSTEM_PROMPT = """You are a helpful assistant that answers questions based on the provided context.
    
INSTRUCTIONS:
1. Answer the question using ONLY the information provided in the context below
2. If the context doesn't contain enough information to answer, say so clearly
3. Cite your sources by mentioning which document the information came from
4. Be concise but thorough
5. If you're uncertain about something, indicate your uncertainty

CONTEXT:
{context}

Remember: Only use information from the context above. Do not make up information."""

    USER_PROMPT = """Question: {question}

Please provide a clear, well-structured answer based on the context provided."""

    def __init__(self):
        """Initialize the RAG pipeline with configured components."""
        self.settings = get_settings()
        self.vector_store_service = VectorStoreService()
        
        # Initialize text splitter with configured parameters
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
        # Build kwargs for LLM - supports OpenAI, DeepSeek, etc.
        llm_kwargs = {
            "model": self.settings.model_name,
            "openai_api_key": self.settings.openai_api_key,
            "temperature": 0.1,  # Low temperature for factual responses
        }
        
        # Add base URL if configured (for DeepSeek or other providers)
        if self.settings.openai_api_base:
            llm_kwargs["openai_api_base"] = self.settings.openai_api_base
        
        # Initialize LLM for generation
        self.llm = ChatOpenAI(**llm_kwargs)
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.SYSTEM_PROMPT),
            ("user", self.USER_PROMPT),
        ])
    
    def create_session(self) -> str:
        """
        Create a new RAG session for document storage.
        
        Returns:
            New session ID
        """
        return self.vector_store_service.create_session()
    
    def process_document(
        self,
        session_id: str,
        file_content: bytes,
        filename: str
    ) -> DocumentUploadResponse:
        """
        Process and index a document for RAG.
        
        Handles PDF and TXT files, chunks them appropriately,
        and stores in the session's vector store.
        
        Args:
            session_id: Target session
            file_content: Raw file bytes
            filename: Original filename (used to determine file type)
            
        Returns:
            DocumentUploadResponse with processing details
            
        Raises:
            ValueError: If file type is not supported
        """
        # Extract text based on file type
        text = self._extract_text(file_content, filename)
        
        # Create chunks with metadata
        chunks = self.text_splitter.split_text(text)
        
        # Convert to LangChain Document objects with metadata
        documents = [
            Document(
                page_content=chunk,
                metadata={
                    "source": filename,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                }
            )
            for i, chunk in enumerate(chunks)
        ]
        
        # Add to vector store
        num_added = self.vector_store_service.add_documents(
            session_id=session_id,
            documents=documents,
            source_name=filename
        )
        
        return DocumentUploadResponse(
            session_id=session_id,
            filename=filename,
            num_chunks=num_added,
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
            message=f"Successfully processed {filename} into {num_added} chunks"
        )
    
    def _extract_text(self, file_content: bytes, filename: str) -> str:
        """
        Extract text content from uploaded file.
        
        Args:
            file_content: Raw file bytes
            filename: Filename to determine type
            
        Returns:
            Extracted text content
            
        Raises:
            ValueError: If file type not supported
        """
        filename_lower = filename.lower()
        
        if filename_lower.endswith('.pdf'):
            return self._extract_pdf_text(file_content)
        elif filename_lower.endswith('.txt'):
            return file_content.decode('utf-8', errors='ignore')
        else:
            raise ValueError(
                f"Unsupported file type. Supported: .pdf, .txt"
            )
    
    def _extract_pdf_text(self, file_content: bytes) -> str:
        """Extract text from PDF bytes."""
        import io
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        
        return "\n\n".join(text_parts)
    
    def query(
        self,
        session_id: str,
        question: str,
        top_k: Optional[int] = None
    ) -> QueryResponse:
        """
        Execute a RAG query and generate an answer.
        
        The complete RAG flow:
        1. Retrieve relevant chunks using similarity search
        2. Construct prompt with retrieved context
        3. Generate response with LLM
        4. Package response with sources
        
        Args:
            session_id: Session with indexed documents
            question: User's natural language question
            top_k: Override for number of chunks to retrieve
            
        Returns:
            QueryResponse with answer and source information
        """
        # Step 1: Retrieve relevant documents
        k = top_k or self.settings.top_k
        results = self.vector_store_service.similarity_search(
            session_id=session_id,
            query=question,
            top_k=k
        )
        
        # Step 2: Format retrieved contexts
        retrieved_contexts = []
        context_texts = []
        sources = set()
        
        for doc, score in results:
            source = doc.metadata.get("source", "Unknown")
            chunk_index = doc.metadata.get("chunk_index", 0)
            
            retrieved_contexts.append(RetrievedContext(
                content=doc.page_content,
                source=source,
                chunk_index=chunk_index,
                similarity_score=round(score, 4)
            ))
            
            # Format context for prompt
            context_texts.append(
                f"[Source: {source}, Chunk {chunk_index}]\n{doc.page_content}"
            )
            sources.add(source)
        
        # Step 3: Construct and execute prompt
        combined_context = "\n\n---\n\n".join(context_texts)
        
        messages = self.prompt.format_messages(
            context=combined_context,
            question=question
        )
        
        # Step 4: Generate response
        response = self.llm.invoke(messages)
        
        # Extract token usage if available
        tokens_used = None
        if hasattr(response, 'response_metadata'):
            usage = response.response_metadata.get('token_usage', {})
            tokens_used = usage.get('total_tokens')
        
        return QueryResponse(
            answer=response.content,
            retrieved_contexts=retrieved_contexts,
            sources=list(sources),
            model_used=self.settings.model_name,
            tokens_used=tokens_used
        )
    
    def get_configuration(self) -> dict:
        """Get current RAG configuration for display."""
        return {
            "chunk_size": self.settings.chunk_size,
            "chunk_overlap": self.settings.chunk_overlap,
            "top_k": self.settings.top_k,
            "model_name": self.settings.model_name,
            "embedding_model": self.settings.embedding_model,
        }
