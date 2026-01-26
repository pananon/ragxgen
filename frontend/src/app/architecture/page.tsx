"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Scissors,
    Sparkles,
    Database,
    Search,
    MessageSquare,
    Brain,
    ArrowRight,
    X,
    Clock,
    DollarSign,
    Target,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PipelineStep {
    id: string;
    number: number;
    title: string;
    icon: React.ElementType;
    description: string;
    why: string;
    tradeoffs: {
        title: string;
        description: string;
        icon: React.ElementType;
    }[];
    technicalDetails: string[];
}

const pipelineSteps: PipelineStep[] = [
    {
        id: "query",
        number: 1,
        title: "User Query",
        icon: MessageSquare,
        description: "User submits a natural language question about their documents.",
        why: "The entry point to the RAG system. The quality of the query affects retrieval quality.",
        tradeoffs: [
            {
                title: "Query Length",
                description: "Longer queries provide more context but may reduce precision.",
                icon: Target,
            },
        ],
        technicalDetails: [
            "Accepts natural language input",
            "No special syntax required",
            "UTF-8 encoded text",
        ],
    },
    {
        id: "embedding",
        number: 2,
        title: "Query Embedding",
        icon: Sparkles,
        description: "The query is converted into a dense vector representation using an embedding model.",
        why: "Embeddings capture semantic meaning, enabling fuzzy matching beyond keyword search.",
        tradeoffs: [
            {
                title: "Latency",
                description: "API call to embedding model adds ~100-300ms.",
                icon: Clock,
            },
            {
                title: "Cost",
                description: "Each query incurs embedding API costs (~$0.0001/query).",
                icon: DollarSign,
            },
        ],
        technicalDetails: [
            "Model: text-embedding-3-small",
            "Vector dimension: 1536",
            "Same model used for documents",
        ],
    },
    {
        id: "vectordb",
        number: 3,
        title: "Vector Database",
        icon: Database,
        description: "FAISS vector store contains all document chunk embeddings, indexed for fast similarity search.",
        why: "Vector databases enable semantic search at scale with sub-linear time complexity.",
        tradeoffs: [
            {
                title: "Memory",
                description: "Stores all embeddings in RAM (~6KB per chunk).",
                icon: Target,
            },
            {
                title: "Accuracy vs Speed",
                description: "Approximate search is faster but may miss some matches.",
                icon: Clock,
            },
        ],
        technicalDetails: [
            "FAISS IndexFlatIP (exact search)",
            "Cosine similarity metric",
            "Session-isolated stores",
        ],
    },
    {
        id: "retrieval",
        number: 4,
        title: "Top-K Retrieval",
        icon: Search,
        description: "The most similar document chunks are retrieved based on cosine similarity with the query.",
        why: "Selecting the most relevant context ensures the LLM has the best information to work with.",
        tradeoffs: [
            {
                title: "Recall vs Precision",
                description: "Higher K = more context but potentially less relevant.",
                icon: Target,
            },
            {
                title: "Token Budget",
                description: "More chunks = more tokens = higher cost and latency.",
                icon: DollarSign,
            },
        ],
        technicalDetails: [
            "Default K=4 chunks",
            "Returns similarity scores",
            "Ordered by relevance",
        ],
    },
    {
        id: "augmentation",
        number: 5,
        title: "Prompt Augmentation",
        icon: FileText,
        description: "Retrieved chunks are injected into a structured prompt with the original question.",
        why: "Context placement and formatting directly affects LLM response quality.",
        tradeoffs: [
            {
                title: "Context Window",
                description: "Limited by model's max tokens (e.g., 8K, 128K).",
                icon: Target,
            },
            {
                title: "Prompt Engineering",
                description: "Template design affects answer quality significantly.",
                icon: Target,
            },
        ],
        technicalDetails: [
            "System prompt with instructions",
            "Context block with sources",
            "User question at end",
        ],
    },
    {
        id: "generation",
        number: 6,
        title: "LLM Response",
        icon: Brain,
        description: "The LLM generates an answer grounded in the retrieved context, citing sources.",
        why: "The LLM synthesizes retrieved information into a coherent, helpful response.",
        tradeoffs: [
            {
                title: "Latency",
                description: "LLM generation is the slowest step (~1-5 seconds).",
                icon: Clock,
            },
            {
                title: "Cost",
                description: "Token-based pricing for input + output (~$0.01-0.10/query).",
                icon: DollarSign,
            },
            {
                title: "Accuracy",
                description: "Model may still hallucinate despite context.",
                icon: Target,
            },
        ],
        technicalDetails: [
            "Model: GPT-4o-mini",
            "Temperature: 0.1 (factual)",
            "Structured output format",
        ],
    },
];

export default function ArchitecturePage() {
    const [activeStep, setActiveStep] = useState<string | null>(null);

    const selectedStep = pipelineSteps.find((s) => s.id === activeStep);

    return (
        <div className="section-container py-16">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mb-16"
            >
                <h1 className="page-title">
                    RAG <span className="gradient-text">Architecture</span>
                </h1>
                <p className="page-subtitle">
                    An interactive visualization of the RAG pipeline. Click on each step
                    to understand why it exists and the trade-offs involved.
                </p>
            </motion.div>

            {/* Pipeline Visualization */}
            <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pipelineSteps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                                className={cn(
                                    "w-full text-left pipeline-node group",
                                    activeStep === step.id && "active"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                        activeStep === step.id
                                            ? "bg-primary text-white"
                                            : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                    )}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-primary">Step {step.number}</span>
                                        </div>
                                        <h3 className="font-semibold mb-2">{step.title}</h3>
                                        <p className="text-sm text-foreground-muted">{step.description}</p>
                                    </div>
                                </div>

                                {/* Connector line */}
                                {index < pipelineSteps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-4 h-4 text-border" />
                                    </div>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
                {selectedStep && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-16"
                    >
                        <div className="glass-card p-8 rounded-3xl">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                                        <selectedStep.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-primary font-medium">
                                            Step {selectedStep.number}
                                        </span>
                                        <h3 className="text-2xl font-bold">{selectedStep.title}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveStep(null)}
                                    className="p-2 rounded-lg hover:bg-background-tertiary"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Why */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-foreground-muted">
                                        Why This Step Exists
                                    </h4>
                                    <p className="text-foreground-muted">{selectedStep.why}</p>
                                </div>

                                {/* Trade-offs */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-foreground-muted">
                                        Trade-offs
                                    </h4>
                                    <ul className="space-y-3">
                                        {selectedStep.tradeoffs.map((tradeoff) => (
                                            <li key={tradeoff.title} className="flex items-start gap-3">
                                                <tradeoff.icon className="w-5 h-5 text-accent-purple flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">{tradeoff.title}</p>
                                                    <p className="text-sm text-foreground-muted">{tradeoff.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Technical Details */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-foreground-muted">
                                        Technical Details
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedStep.technicalDetails.map((detail) => (
                                            <li key={detail} className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                                                <span className="text-foreground-muted font-mono">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Data Flow Diagram */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <h2 className="text-2xl font-bold mb-8">Data Flow Overview</h2>
                <div className="glass-card p-8 rounded-3xl overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[800px] gap-4">
                        {/* Document Processing Flow */}
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-2">
                                    <FileText className="w-8 h-8 text-accent-cyan" />
                                </div>
                                <p className="text-sm font-medium">Documents</p>
                                <p className="text-xs text-foreground-muted">PDF, TXT</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-border" />
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-2">
                                    <Scissors className="w-8 h-8 text-accent-purple" />
                                </div>
                                <p className="text-sm font-medium">Chunking</p>
                                <p className="text-xs text-foreground-muted">1000 chars</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-border" />
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-accent-pink/10 flex items-center justify-center mx-auto mb-2">
                                    <Sparkles className="w-8 h-8 text-accent-pink" />
                                </div>
                                <p className="text-sm font-medium">Embeddings</p>
                                <p className="text-xs text-foreground-muted">1536-dim</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-border" />
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                    <Database className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-sm font-medium">FAISS</p>
                                <p className="text-xs text-foreground-muted">Vector Store</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-20 w-px bg-border" />

                        {/* Query Flow */}
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-accent-green/10 flex items-center justify-center mx-auto mb-2">
                                    <MessageSquare className="w-8 h-8 text-accent-green" />
                                </div>
                                <p className="text-sm font-medium">Query</p>
                                <p className="text-xs text-foreground-muted">User input</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-border" />
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-2">
                                    <Search className="w-8 h-8 text-yellow-500" />
                                </div>
                                <p className="text-sm font-medium">Retrieve</p>
                                <p className="text-xs text-foreground-muted">Top-K</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-border" />
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-2">
                                    <Brain className="w-8 h-8 text-accent-cyan" />
                                </div>
                                <p className="text-sm font-medium">Generate</p>
                                <p className="text-xs text-foreground-muted">GPT-4o-mini</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <div className="glass-card p-12 rounded-3xl glow">
                    <h2 className="text-2xl font-bold mb-4">See it in action</h2>
                    <p className="text-foreground-muted mb-8">
                        Try the live demo to see this architecture working in real-time.
                    </p>
                    <Link href="/demo" className="btn-primary inline-flex items-center gap-2">
                        Launch Live Demo
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
