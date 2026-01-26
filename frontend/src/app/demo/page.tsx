"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Send,
    FileText,
    Loader2,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Trash2,
    Settings,
    X,
} from "lucide-react";
import {
    uploadDocument,
    queryRAG,
    type QueryResponse,
    type DocumentUploadResponse,
    type RetrievedContext,
} from "@/lib/api";
import { cn, formatScore, getScoreColor } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    contexts?: RetrievedContext[];
    sources?: string[];
    tokensUsed?: number | null;
}

interface UploadedDoc {
    filename: string;
    chunks: number;
}

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

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const response: DocumentUploadResponse = await uploadDocument(file, sessionId || undefined);

            setSessionId(response.session_id);
            setUploadedDocs((prev) => [
                ...prev,
                { filename: response.filename, chunks: response.num_chunks },
            ]);

            // Add system message
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: `✓ Successfully uploaded **${response.filename}**\n\nProcessed into ${response.num_chunks} chunks (${response.chunk_size} chars each, ${response.chunk_overlap} overlap). You can now ask questions about this document.`,
                },
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload document");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Handle query submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !sessionId || isQuerying) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: inputValue.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsQuerying(true);
        setError(null);

        try {
            const response: QueryResponse = await queryRAG(sessionId, userMessage.content, topK);

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response.answer,
                contexts: response.retrieved_contexts,
                sources: response.sources,
                tokensUsed: response.tokens_used,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get response");
        } finally {
            setIsQuerying(false);
        }
    };

    // Toggle context expansion
    const toggleContext = (messageId: string) => {
        setExpandedContexts((prev) => {
            const next = new Set(prev);
            if (next.has(messageId)) {
                next.delete(messageId);
            } else {
                next.add(messageId);
            }
            return next;
        });
    };

    // Clear session
    const clearSession = () => {
        setSessionId(null);
        setUploadedDocs([]);
        setMessages([]);
        setError(null);
    };

    return (
        <div className="section-container py-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2">
                        Live <span className="gradient-text">RAG Demo</span>
                    </h1>
                    <p className="text-foreground-muted">
                        Upload documents and ask questions. See retrieval and generation in action.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-[1fr,320px] gap-6">
                    {/* Main Chat Area */}
                    <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
                                <span className="font-medium">RAG Assistant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-foreground"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                {uploadedDocs.length > 0 && (
                                    <button
                                        onClick={clearSession}
                                        className="p-2 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Settings Panel */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-b border-border overflow-hidden"
                                >
                                    <div className="p-4 bg-background-tertiary/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium">Top-K Retrieval</label>
                                                <p className="text-xs text-foreground-muted">Number of chunks to retrieve</p>
                                            </div>
                                            <select
                                                value={topK}
                                                onChange={(e) => setTopK(Number(e.target.value))}
                                                className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                                            >
                                                {[2, 3, 4, 5, 6, 8, 10].map((k) => (
                                                    <option key={k} value={k}>{k} chunks</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && uploadedDocs.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                        <Upload className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Upload a document to start</h3>
                                    <p className="text-foreground-muted text-sm max-w-sm mb-6">
                                        Upload a PDF or TXT file, then ask questions about its content.
                                        The RAG system will find relevant passages and generate grounded answers.
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="btn-primary inline-flex items-center gap-2"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Upload className="w-5 h-5" />
                                        )}
                                        Choose File
                                    </button>
                                </div>
                            )}

                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex",
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "chat-message",
                                            message.role === "user"
                                                ? "chat-message-user"
                                                : "chat-message-assistant"
                                        )}
                                    >
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            {message.content.split('\n').map((line, i) => (
                                                <p key={i} className="mb-1 last:mb-0">{line}</p>
                                            ))}
                                        </div>

                                        {/* Retrieved Contexts */}
                                        {message.contexts && message.contexts.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-border/50">
                                                <button
                                                    onClick={() => toggleContext(message.id)}
                                                    className="flex items-center gap-2 text-xs text-foreground-muted hover:text-foreground"
                                                >
                                                    {expandedContexts.has(message.id) ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                    {message.contexts.length} Retrieved Chunks
                                                    {message.tokensUsed && (
                                                        <span className="ml-2 opacity-60">
                                                            ({message.tokensUsed} tokens)
                                                        </span>
                                                    )}
                                                </button>

                                                <AnimatePresence>
                                                    {expandedContexts.has(message.id) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="mt-3 space-y-3 overflow-hidden"
                                                        >
                                                            {message.contexts.map((ctx, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="p-3 bg-background rounded-lg border border-border text-sm"
                                                                >
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-xs text-foreground-muted">
                                                                            {ctx.source} (Chunk {ctx.chunk_index})
                                                                        </span>
                                                                        <span className={cn("score-badge", getScoreColor(ctx.similarity_score))}>
                                                                            {formatScore(ctx.similarity_score)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-foreground-muted text-xs leading-relaxed">
                                                                        {ctx.content.length > 300
                                                                            ? ctx.content.slice(0, 300) + "..."
                                                                            : ctx.content}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Sources */}
                                                {message.sources && message.sources.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {message.sources.map((source) => (
                                                            <span
                                                                key={source}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                                                            >
                                                                <FileText className="w-3 h-3" />
                                                                {source}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isQuerying && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="chat-message chat-message-assistant">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-sm text-foreground-muted">
                                                Retrieving and generating...
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="px-4 pb-2">
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                    <button onClick={() => setError(null)} className="ml-auto">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-border">
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={
                                        uploadedDocs.length === 0
                                            ? "Upload a document first..."
                                            : "Ask a question about your documents..."
                                    }
                                    disabled={uploadedDocs.length === 0 || isQuerying}
                                    className="input-field flex-1"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || uploadedDocs.length === 0 || isQuerying}
                                    className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isQuerying ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Upload Card */}
                        <div className="glass-card p-5 rounded-2xl">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary" />
                                Upload Documents
                            </h3>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full p-4 border-2 border-dashed border-border hover:border-primary/50 rounded-xl 
                         text-center transition-colors disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm">Processing...</span>
                                    </div>
                                ) : (
                                    <div>
                                        <FileText className="w-8 h-8 mx-auto mb-2 text-foreground-muted" />
                                        <p className="text-sm font-medium">Click to upload</p>
                                        <p className="text-xs text-foreground-muted">PDF or TXT</p>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Uploaded Documents */}
                        {uploadedDocs.length > 0 && (
                            <div className="glass-card p-5 rounded-2xl">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-accent-green" />
                                    Indexed Documents
                                </h3>
                                <ul className="space-y-2">
                                    {uploadedDocs.map((doc, idx) => (
                                        <li
                                            key={idx}
                                            className="p-3 bg-background rounded-lg border border-border"
                                        >
                                            <p className="font-medium text-sm truncate">{doc.filename}</p>
                                            <p className="text-xs text-foreground-muted">
                                                {doc.chunks} chunks indexed
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Session Info */}
                        {sessionId && (
                            <div className="glass-card p-5 rounded-2xl">
                                <h3 className="font-semibold mb-3 text-sm text-foreground-muted">
                                    Session Info
                                </h3>
                                <p className="font-mono text-xs text-foreground-muted break-all">
                                    {sessionId}
                                </p>
                            </div>
                        )}

                        {/* Tips */}
                        <div className="glass-card p-5 rounded-2xl">
                            <h3 className="font-semibold mb-3">💡 Tips</h3>
                            <ul className="space-y-2 text-sm text-foreground-muted">
                                <li>• Upload multiple documents for richer context</li>
                                <li>• Ask specific questions for better results</li>
                                <li>• Expand retrieved chunks to see sources</li>
                                <li>• Adjust Top-K in settings for more/less context</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
