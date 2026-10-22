"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import Icon from "@/components/ui/Icon";
import {
    uploadDocument,
    queryRAG,
    type QueryResponse,
    type DocumentUploadResponse,
    type RetrievedContext,
} from "@/lib/api";
import { formatScore, getScoreLevel } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    contexts?: RetrievedContext[];
    sources?: string[];
    tokensUsed?: number | null;
}

interface UploadedDoc {
    filename: string;
    chunks: number;
}

const ACCEPT = ".pdf,.txt";

export default function DemoPage() {
    // State
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isQuerying, setIsQuerying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedContexts, setExpandedContexts] = useState<Set<string>>(new Set());
    const [showSettings, setShowSettings] = useState(false);
    const [topK, setTopK] = useState(4);
    const [dragging, setDragging] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logRef = useRef<HTMLDivElement>(null);

    // Keep the newest message in view by scrolling the log itself, never the page.
    useEffect(() => {
        const log = logRef.current;
        if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
    }, [messages, isQuerying]);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const response: DocumentUploadResponse = await uploadDocument(file, sessionId || undefined);

            setSessionId(response.session_id);
            setUploadedDocs((prev) => [...prev, { filename: response.filename, chunks: response.num_chunks }]);
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "system",
                    content: `Indexed ${response.filename}\nProcessed into ${response.num_chunks} chunks (${response.chunk_size} chars each, ${response.chunk_overlap} overlap). You can now ask questions about this document.`,
                },
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload document");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const onDrop = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file || isUploading) return;
        if (!/\.(pdf|txt)$/i.test(file.name)) {
            setError("Only PDF and TXT files are supported.");
            return;
        }
        uploadFile(file);
    };

    // Handle query submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !sessionId || isQuerying) return;

        const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: inputValue.trim() };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsQuerying(true);
        setError(null);

        try {
            const response: QueryResponse = await queryRAG(sessionId, userMessage.content, topK);
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: response.answer,
                    contexts: response.retrieved_contexts,
                    sources: response.sources,
                    tokensUsed: response.tokens_used,
                },
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get response");
        } finally {
            setIsQuerying(false);
        }
    };

    const toggleContext = (messageId: string) => {
        setExpandedContexts((prev) => {
            const next = new Set(prev);
            if (next.has(messageId)) next.delete(messageId);
            else next.add(messageId);
            return next;
        });
    };

    const clearSession = () => {
        setSessionId(null);
        setUploadedDocs([]);
        setMessages([]);
        setError(null);
    };

    const ready = uploadedDocs.length > 0;
    const pickFile = () => fileInputRef.current?.click();

    return (
        <div className="demo wrap">
            <header className="demo-head">
                <div>
                    <p className="chapter-label mono">Live demo</p>
                    <h1>Ask your document.</h1>
                </div>
                <p>Upload a PDF or TXT file, then ask questions. Every answer shows the chunks it was retrieved from, with similarity scores and sources.</p>
            </header>

            <input ref={fileInputRef} type="file" accept={ACCEPT} onChange={handleFileUpload} className="sr-only" tabIndex={-1} aria-hidden="true" />

            <div className="demo-grid">
                <section className="chat" aria-label="RAG assistant">
                    <div className="chat-bar">
                        <p className="chat-status mono">
                            <i data-ready={ready || undefined} aria-hidden="true" />
                            {ready ? `Ready · ${uploadedDocs.length} document${uploadedDocs.length > 1 ? "s" : ""} indexed` : "Waiting for a document"}
                        </p>
                        <div>
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setShowSettings(!showSettings)}
                                aria-expanded={showSettings}
                                aria-controls="chat-settings"
                                aria-label="Retrieval settings"
                            >
                                <Icon name="tuning-2-linear" size={20} />
                            </button>
                            {ready && (
                                <button type="button" className="icon-btn" onClick={clearSession} aria-label="Clear session and documents">
                                    <Icon name="trash-bin-trash-linear" size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {showSettings && (
                        <div id="chat-settings" className="chat-settings">
                            <div>
                                <label htmlFor="top-k">Top-K retrieval</label>
                                <span className="muted" style={{ fontSize: 13 }}>Number of chunks to retrieve</span>
                            </div>
                            <select id="top-k" value={topK} onChange={(e) => setTopK(Number(e.target.value))}>
                                {[2, 3, 4, 5, 6, 8, 10].map((k) => <option key={k} value={k}>{k} chunks</option>)}
                            </select>
                        </div>
                    )}

                    <div ref={logRef} className="chat-log" data-lenis-prevent aria-live="polite">
                        {messages.length === 0 && !ready && (
                            <div className="chat-empty">
                                <h2>Upload a document to start.</h2>
                                <p>
                                    Add a PDF or TXT file, then ask about its content. The system finds the most relevant passages
                                    and writes an answer grounded in them.
                                </p>
                                <button type="button" onClick={pickFile} className="btn btn-ink" disabled={isUploading}>
                                    {isUploading ? <span className="spinner" aria-hidden="true" /> : <Icon name="upload-minimalistic-linear" size={18} />}
                                    {isUploading ? "Processing…" : "Choose a file"}
                                </button>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div key={message.id} className={`msg msg-${message.role}`}>
                                <span className="msg-role mono">{message.role === "user" ? "You" : message.role === "system" ? "Indexed" : "RagXGen"}</span>
                                <div className="msg-body">
                                    {message.content.split("\n").map((line, i) => <p key={i}>{line}</p>)}

                                    {message.contexts && message.contexts.length > 0 && (
                                        <div className="msg-meta">
                                            <button
                                                type="button"
                                                className="msg-toggle"
                                                aria-expanded={expandedContexts.has(message.id)}
                                                aria-controls={`ctx-${message.id}`}
                                                onClick={() => toggleContext(message.id)}
                                            >
                                                <Icon name="alt-arrow-down-linear" size={16} />
                                                {message.contexts.length} retrieved chunks
                                                {message.tokensUsed ? <span className="muted">· {message.tokensUsed} tokens</span> : null}
                                            </button>

                                            {expandedContexts.has(message.id) && (
                                                <ol id={`ctx-${message.id}`} className="ctx-list">
                                                    {message.contexts.map((ctx, idx) => (
                                                        <li key={idx} className="ctx">
                                                            <div className="ctx-head">
                                                                <span>{ctx.source} · chunk {ctx.chunk_index}</span>
                                                                <span className="ctx-score">{formatScore(ctx.similarity_score)}</span>
                                                            </div>
                                                            <div className="ctx-bar" data-level={getScoreLevel(ctx.similarity_score)} aria-hidden="true">
                                                                <span style={{ width: `${Math.max(0, Math.min(1, ctx.similarity_score)) * 100}%` }} />
                                                            </div>
                                                            <p>{ctx.content.length > 300 ? `${ctx.content.slice(0, 300)}…` : ctx.content}</p>
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}

                                            {message.sources && message.sources.length > 0 && (
                                                <div className="sources" aria-label="Sources">
                                                    {message.sources.map((source) => (
                                                        <span key={source}><Icon name="document-text-linear" size={13} />{source}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isQuerying && (
                            <div className="msg msg-assistant">
                                <span className="msg-role mono">RagXGen</span>
                                <div className="msg-body chat-thinking"><span className="spinner" aria-hidden="true" /> Retrieving and generating…</div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="chat-error" role="alert">
                            <Icon name="danger-triangle-linear" size={18} />
                            <span>{error}</span>
                            <button type="button" className="icon-btn" onClick={() => setError(null)} aria-label="Dismiss error">
                                <Icon name="close-circle-linear" size={18} />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="chat-form">
                        <label htmlFor="question" className="sr-only">Question</label>
                        <input
                            id="question"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={ready ? "Ask a question about your documents…" : "Upload a document first…"}
                            disabled={!ready || isQuerying}
                            autoComplete="off"
                        />
                        <button type="submit" className="btn btn-ink" disabled={!inputValue.trim() || !ready || isQuerying} aria-label="Send question">
                            {isQuerying ? <span className="spinner" aria-hidden="true" /> : <Icon name="plain-linear" size={18} />}
                        </button>
                    </form>
                </section>

                <aside className="side" aria-label="Documents and session">
                    <div className="side-card">
                        <h2>Upload</h2>
                        <button
                            type="button"
                            className="dropzone"
                            onClick={pickFile}
                            disabled={isUploading}
                            aria-disabled={isUploading}
                            data-drag={dragging || undefined}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={onDrop}
                        >
                            {isUploading ? (
                                <><span className="spinner" aria-hidden="true" /><b>Processing…</b></>
                            ) : (
                                <><Icon name="upload-minimalistic-linear" size={26} /><b>Click or drop a file</b><span>PDF or TXT</span></>
                            )}
                        </button>
                    </div>

                    {ready && (
                        <div className="side-card">
                            <h2>Indexed documents</h2>
                            <ul className="doc-list">
                                {uploadedDocs.map((doc, idx) => (
                                    <li key={idx}><b title={doc.filename}>{doc.filename}</b><span>{doc.chunks} chunks indexed</span></li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {sessionId && (
                        <div className="side-card">
                            <h2>Session</h2>
                            <p className="session-id">{sessionId}</p>
                        </div>
                    )}

                    <div className="side-card">
                        <h2>Tips</h2>
                        <ul className="tips">
                            <li>Upload several documents for richer context</li>
                            <li>Specific questions retrieve better passages</li>
                            <li>Expand retrieved chunks to check the sources</li>
                            <li>Raise or lower Top-K in settings</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
