"use client";

import { motion } from "framer-motion";
import {
    Code2,
    Database,
    Globe,
    Zap,
    ArrowRight,
    CheckCircle,
    Lightbulb,
    Wrench,
    AlertTriangle,
    Github,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

const techStack = [
    {
        category: "Frontend",
        items: [
            { name: "Next.js 14", description: "App Router for modern React patterns" },
            { name: "TypeScript", description: "Type safety and better DX" },
            { name: "Tailwind CSS", description: "Utility-first styling" },
            { name: "Framer Motion", description: "Smooth animations" },
        ],
    },
    {
        category: "Backend",
        items: [
            { name: "FastAPI", description: "High-performance async Python API" },
            { name: "Pydantic", description: "Data validation and settings" },
            { name: "LangChain", description: "RAG pipeline orchestration" },
            { name: "FAISS", description: "Vector similarity search" },
        ],
    },
    {
        category: "AI/ML",
        items: [
            { name: "OpenAI GPT-4o-mini", description: "Response generation" },
            { name: "text-embedding-3-small", description: "Document embeddings" },
            { name: "RecursiveCharacterTextSplitter", description: "Smart chunking" },
        ],
    },
];

const designDecisions = [
    {
        decision: "Session-based Vector Stores",
        why: "Each user gets an isolated FAISS index",
        tradeoff: "Uses more memory but prevents data leakage between users",
        alternative: "Shared store with tenant filtering (more complex)",
    },
    {
        decision: "In-memory Storage",
        why: "Simplicity for demo purposes",
        tradeoff: "Data lost on server restart",
        alternative: "Persist FAISS indices to disk or use managed vector DB",
    },
    {
        decision: "RecursiveCharacterTextSplitter",
        why: "Handles various content types well",
        tradeoff: "May not be optimal for highly structured documents",
        alternative: "Semantic chunking or document-specific splitters",
    },
    {
        decision: "Low Temperature (0.1)",
        why: "Prioritizes factual, consistent responses",
        tradeoff: "Less creative, may be repetitive",
        alternative: "Higher temperature for creative tasks",
    },
];

const productionImprovements = [
    {
        category: "Retrieval Quality",
        items: [
            "Add reranking with a cross-encoder model",
            "Implement hybrid search (semantic + keyword)",
            "Use HyDE (Hypothetical Document Embeddings)",
            "Add query expansion/reformulation",
        ],
    },
    {
        category: "Scalability",
        items: [
            "Use managed vector DB (Pinecone, Weaviate, Qdrant)",
            "Add Redis caching for frequent queries",
            "Implement connection pooling",
            "Deploy with auto-scaling",
        ],
    },
    {
        category: "Reliability",
        items: [
            "Add comprehensive error handling",
            "Implement retry logic with exponential backoff",
            "Add health checks and monitoring",
            "Set up structured logging",
        ],
    },
    {
        category: "User Experience",
        items: [
            "Streaming responses for faster perceived latency",
            "Add conversation history and memory",
            "Implement feedback collection",
            "Support more file formats (DOCX, HTML, etc.)",
        ],
    },
];

const lessonsLearned = [
    {
        icon: CheckCircle,
        title: "Start Simple",
        description: "Basic RAG works surprisingly well. Add complexity only when needed.",
        color: "text-accent-green",
    },
    {
        icon: AlertTriangle,
        title: "Chunk Size Matters",
        description: "Too small = no context. Too large = noise. 1000 chars is a good starting point.",
        color: "text-yellow-400",
    },
    {
        icon: Lightbulb,
        title: "Prompt Engineering is Key",
        description: "The system prompt significantly affects response quality and grounding.",
        color: "text-accent-cyan",
    },
    {
        icon: Wrench,
        title: "Observability is Essential",
        description: "Log retrieved chunks and scores to debug and improve the pipeline.",
        color: "text-accent-purple",
    },
];

export default function AboutPage() {
    return (
        <div className="section-container py-16">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mb-16"
            >
                <h1 className="page-title">
                    About <span className="gradient-text">RagXGen</span>
                </h1>
                <p className="page-subtitle">
                    A deep dive into the design decisions, technical choices, and lessons
                    learned from building this RAG implementation.
                </p>
            </motion.div>

            {/* Project Overview */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="glass-card p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-foreground-muted mb-4">
                                RagXGen is a portfolio project designed to demonstrate deep understanding
                                of Retrieval-Augmented Generation. It&apos;s not just a demo—it&apos;s a
                                complete, production-style implementation with clear architecture and
                                honest discussion of trade-offs.
                            </p>
                            <p className="text-foreground-muted">
                                The goal is to show potential employers, collaborators, and AI leads
                                that I understand RAG beyond tutorials—I can build, evaluate, and
                                improve real systems.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Code2 className="w-5 h-5 text-primary" />
                                <span>Full-stack implementation (Next.js + FastAPI)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-primary" />
                                <span>Real RAG pipeline with FAISS + LangChain</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-primary" />
                                <span>Interactive demo with live document processing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-primary" />
                                <span>Production-ready code patterns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Tech Stack */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">Tech Stack</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {techStack.map((category) => (
                        <div key={category.category} className="glass-card p-6 rounded-2xl">
                            <h3 className="font-semibold text-lg mb-4 text-primary">
                                {category.category}
                            </h3>
                            <ul className="space-y-3">
                                {category.items.map((item) => (
                                    <li key={item.name}>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-foreground-muted">{item.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Design Decisions */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">Design Decisions</h2>
                <div className="space-y-4">
                    {designDecisions.map((item, index) => (
                        <motion.div
                            key={item.decision}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="font-semibold text-lg mb-3">{item.decision}</h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-foreground-muted mb-1">Why</p>
                                    <p>{item.why}</p>
                                </div>
                                <div>
                                    <p className="text-foreground-muted mb-1">Trade-off</p>
                                    <p>{item.tradeoff}</p>
                                </div>
                                <div>
                                    <p className="text-foreground-muted mb-1">Alternative</p>
                                    <p className="text-accent-cyan">{item.alternative}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Lessons Learned */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">Lessons Learned</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {lessonsLearned.map((lesson, index) => (
                        <motion.div
                            key={lesson.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${lesson.color}`}>
                                    <lesson.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{lesson.title}</h3>
                                    <p className="text-foreground-muted text-sm">{lesson.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Production Improvements */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">Production Improvements</h2>
                <p className="text-foreground-muted mb-6">
                    If deploying this to production, here&apos;s what I&apos;d add:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    {productionImprovements.map((category) => (
                        <div key={category.category} className="glass-card p-6 rounded-2xl">
                            <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
                            <ul className="space-y-2">
                                {category.items.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-foreground-muted">
                                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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
                    <h2 className="text-2xl font-bold mb-4">
                        Let&apos;s Connect
                    </h2>
                    <p className="text-foreground-muted mb-8 max-w-xl mx-auto">
                        Interested in discussing RAG, AI/ML engineering, or potential opportunities?
                        I&apos;d love to hear from you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </a>
                        <Link href="/demo" className="btn-secondary inline-flex items-center gap-2">
                            Try the Demo
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
