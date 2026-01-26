const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RetrievedContext {
    source: string;
    chunk_index: number;
    similarity_score: number;
    content: string;
}

export interface QueryResponse {
    answer: string;
    retrieved_contexts: RetrievedContext[];
    sources: string[];
    tokens_used: number;
}

export interface DocumentUploadResponse {
    session_id: string;
    filename: string;
    num_chunks: number;
    chunk_size: number;
    chunk_overlap: number;
}

export async function uploadDocument(file: File, sessionId?: string): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (sessionId) {
        formData.append('session_id', sessionId);
    }

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = 'Failed to upload document';
        try {
            const error = await response.json();
            errorMessage = error.detail || errorMessage;
        } catch (e) {
            // Ignore JSON parse error
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function queryRAG(sessionId: string, query: string, topK: number = 4): Promise<QueryResponse> {
    const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            query: query,
            top_k: topK,
        }),
    });

    if (!response.ok) {
        let errorMessage = 'Failed to query RAG';
        try {
            const error = await response.json();
            errorMessage = error.detail || errorMessage;
        } catch (e) {
            // Ignore JSON parse error
        }
        throw new Error(errorMessage);
    }

    return response.json();
}
