"use client";

import { motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Database,
    Brain,
    Search,
    FileText,
    MessageSquare,
    Zap,
} from "lucide-react";
import Link from "next/link";

const ragSteps = [
    {
        step: 1,
        title: "Document Ingestion",
        description: "Documents are loaded and split into smaller chunks for processing.",
        icon: FileText,
        details: [
            "Split documents into overlapping chunks",
            "Preserve context at boundaries",
            "Handle multiple file formats (PDF, TXT)",
        ],
    },
    {
        step: 2,
        title: "Embedding Generation",
        description: "Each chunk is converted into a vector embedding.",
        icon: Zap,
        details: [
            "Use embedding models (e.g., text-embedding-3-small)",
            "Capture semantic meaning in vectors",
            "Enable similarity comparisons",
        ],
    },
    {
        step: 3,
        title: "Vector Storage",
        description: "Embeddings are stored in a vector database for fast retrieval.",
        icon: Database,
        details: [
            "Index vectors for similarity search",
            "Use FAISS for efficient storage",
            "Support approximate nearest neighbors",
        ],
    },
    {
        step: 4,
        title: "Query Processing",
        description: "User questions are embedded using the same model.",
        icon: Search,
        details: [
            "Convert question to vector",
            "Match vector space with documents",
            "Prepare for similarity search",
        ],
    },
    {
        step: 5,
        title: "Context Retrieval",
        description: "Most similar document chunks are retrieved from the vector store.",
        icon: MessageSquare,
        details: [
            "Find top-k most similar chunks",
            "Rank by cosine similarity",
            "Return with similarity scores",
        ],
    },
    {
        step: 6,
        title: "Augmented Generation",
        description: "LLM generates an answer using retrieved context.",
        icon: Brain,
        details: [
            "Inject context into prompt",
            "Generate grounded response",
            "Cite sources in answer",
        ],
    },
];

const problemsWithLLMs = [
    {
        problem: "Hallucinations",
        description: "LLMs confidently generate false information based on training patterns.",
        example: "Citing non-existent research papers or making up statistics.",
    },
    {
        problem: "Stale Knowledge",
        description: "LLM training has a cutoff date, missing recent information.",
        example: "Unable to answer questions about events after training.",
    },
    {
        problem: "No Source Attribution",
        description: "Can't trace where information came from.",
        example: "Users have no way to verify claims made by the model.",
    },
];

export default function WhatIsRAGPage() {
    return (
        <div className="section-container py-16">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mb-16"
            >
                <h1 className="page-title">
                    What is <span className="gradient-text">RAG</span>?
                </h1>
                <p className="page-subtitle">
                    Retrieval-Augmented Generation is a technique that combines the power
                    of large language models with external knowledge retrieval to provide
                    accurate, grounded responses.
                </p>
            </motion.div>

            {/* The Problem Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    The Problem with Traditional LLMs
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {problemsWithLLMs.map((item, index) => (
                        <motion.div
                            key={item.problem}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-lg mb-2 text-red-400">{item.problem}</h3>
                            <p className="text-foreground-muted text-sm mb-4">{item.description}</p>
                            <div className="bg-background rounded-lg p-3 border border-border">
                                <p className="text-xs text-foreground-muted italic">&quot;{item.example}&quot;</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* The Solution Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-accent-green" />
                    How RAG Solves These Problems
                </h2>

                <div className="glass-card p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">The Core Insight</h3>
                            <p className="text-foreground-muted mb-4">
                                Instead of relying solely on what an LLM learned during training,
                                RAG retrieves relevant information from your own documents and
                                provides it as context for the LLM to use when generating responses.
                            </p>
                            <p className="text-foreground-muted">
                                This grounds the LLM&apos;s responses in actual data, reducing
                                hallucinations and enabling access to private or recent information.
                            </p>
                        </div>
                        <div className="bg-background rounded-xl p-6 border border-border font-mono text-sm">
                            <p className="text-foreground-muted mb-2"># Pseudocode</p>
                            <p><span className="text-accent-purple">def</span> <span className="text-accent-cyan">rag_query</span>(question, documents):</p>
                            <p className="pl-4 text-foreground-muted"># 1. Find relevant context</p>
                            <p className="pl-4">context = <span className="text-accent-cyan">retrieve</span>(question, documents)</p>
                            <p className="pl-4 text-foreground-muted"># 2. Augment prompt with context</p>
                            <p className="pl-4">prompt = <span className="text-accent-cyan">build_prompt</span>(question, context)</p>
                            <p className="pl-4 text-foreground-muted"># 3. Generate grounded answer</p>
                            <p className="pl-4"><span className="text-accent-purple">return</span> <span className="text-accent-cyan">llm</span>(prompt)</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Step by Step Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">The RAG Pipeline: Step by Step</h2>

                <div className="space-y-6">
                    {ragSteps.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="glass-card p-6"
                        >
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <step.icon className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                            Step {step.step}
                                        </span>
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                    </div>
                                    <p className="text-foreground-muted mb-4">{step.description}</p>
                                    <ul className="grid md:grid-cols-3 gap-2">
                                        {step.details.map((detail) => (
                                            <li key={detail} className="flex items-center gap-2 text-sm text-foreground-muted">
                                                <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Why Companies Use RAG */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">Why Companies Use RAG in Production</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-lg mb-4">Use Cases</h3>
                        <ul className="space-y-3">
                            {[
                                "Customer support chatbots with company documentation",
                                "Internal knowledge bases for employees",
                                "Legal document search and analysis",
                                "Medical literature review systems",
                                "Code documentation assistants",
                            ].map((useCase) => (
                                <li key={useCase} className="flex items-center gap-3 text-foreground-muted">
                                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                                    {useCase}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-lg mb-4">Benefits</h3>
                        <ul className="space-y-3">
                            {[
                                "Accurate answers grounded in real documents",
                                "Access to private and proprietary data",
                                "Up-to-date information beyond training cutoff",
                                "Auditable responses with source citations",
                                "Lower cost than fine-tuning models",
                            ].map((benefit) => (
                                <li key={benefit} className="flex items-center gap-3 text-foreground-muted">
                                    <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
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
                    <h2 className="text-2xl font-bold mb-4">Ready to learn more?</h2>
                    <p className="text-foreground-muted mb-8">
                        Explore the architecture in detail or try the live demo.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/architecture" className="btn-primary inline-flex items-center gap-2">
                            View Architecture
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/demo" className="btn-secondary inline-flex items-center gap-2">
                            Try Live Demo
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
