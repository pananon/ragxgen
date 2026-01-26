"use client";

import { motion } from "framer-motion";
import {
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowRight,
    Sliders,
    Target,
    Clock,
    DollarSign,
    Search,
    FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tradeoffs = [
    {
        name: "Chunk Size",
        description: "How many characters per document chunk",
        low: { value: "200-500", effect: "High precision, low context" },
        high: { value: "1000-2000", effect: "More context, may include irrelevant info" },
        recommendation: "Start with 1000 chars, adjust based on document type",
        impact: ["Retrieval quality", "Context richness", "Token usage"],
    },
    {
        name: "Chunk Overlap",
        description: "Characters shared between adjacent chunks",
        low: { value: "0-50", effect: "May lose context at boundaries" },
        high: { value: "200-400", effect: "Better boundary handling, more redundancy" },
        recommendation: "Use 10-20% of chunk size for overlap",
        impact: ["Context continuity", "Storage size", "Processing time"],
    },
    {
        name: "Top-K Retrieval",
        description: "Number of chunks to retrieve per query",
        low: { value: "1-2", effect: "Focused but may miss relevant info" },
        high: { value: "6-10", effect: "More comprehensive but noisier" },
        recommendation: "Default to 4, adjust based on document complexity",
        impact: ["Answer completeness", "Latency", "Cost"],
    },
];

const exampleComparisons = [
    {
        scenario: "Knowledge freshness question",
        question: "What is the latest feature released in Q4 2024?",
        bad: {
            type: "Without RAG",
            answer: "I don't have information about events after my training cutoff in early 2024. Please check the official documentation or announcements.",
            issues: ["No access to recent data", "Cannot help with current info"],
        },
        good: {
            type: "With RAG",
            answer: "According to the Q4 2024 release notes, the latest feature is the AI-powered search enhancement, launched on December 15th. This includes semantic search and auto-complete functionality. (Source: release-notes-q4.pdf)",
            strengths: ["Access to current data", "Cites specific sources", "Provides accurate details"],
        },
    },
    {
        scenario: "Company-specific information",
        question: "What is our company's refund policy?",
        bad: {
            type: "Without RAG",
            answer: "Typically, refund policies vary by company. Most companies offer 30-day return windows. Please check your specific company's policy documentation for accurate information.",
            issues: ["Generic answer", "No specific details", "User must look elsewhere"],
        },
        good: {
            type: "With RAG",
            answer: "According to the customer policy document, refunds are available within 14 days of purchase for digital products and 30 days for physical items. Refund requests must be submitted through the support portal. (Source: customer-policies.pdf, Chunk 12)",
            strengths: ["Company-specific answer", "Accurate policy details", "Actionable information"],
        },
    },
];

const failureCases = [
    {
        title: "Insufficient Context",
        icon: Search,
        description: "When retrieved chunks don't contain the answer",
        cause: "Document doesn't contain relevant information, or chunks are too small/large",
        solution: "Adjust chunk size, improve document coverage, or acknowledge uncertainty",
        example: "Q: What's the CEO's phone number? → If not in documents, RAG can't help",
    },
    {
        title: "Wrong Document Retrieved",
        icon: FileText,
        description: "Similar embeddings but irrelevant content",
        cause: "Embedding model captures wrong semantic aspects, or documents have similar vocabulary",
        solution: "Use reranking, hybrid search, or better embedding models",
        example: "Q: Python snake care → Retrieves Python programming docs instead",
    },
    {
        title: "Hallucination Despite Context",
        icon: AlertTriangle,
        description: "LLM generates incorrect info even with good context",
        cause: "LLM may still rely on training data or misinterpret context",
        solution: "Lower temperature, use structured prompts, add verification steps",
        example: "Context mentions 'up to 30 days' but LLM says 'exactly 30 days'",
    },
    {
        title: "Context Window Overflow",
        icon: Sliders,
        description: "Too much retrieved context exceeds model limits",
        cause: "High top-K or large chunks with long queries",
        solution: "Limit context length, use summarization, or chunked generation",
        example: "10 chunks × 1000 chars approaches context limits with long prompts",
    },
];

export default function EvaluationPage() {
    return (
        <div className="section-container py-16">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mb-16"
            >
                <h1 className="page-title">
                    Evaluation & <span className="gradient-text">Trade-offs</span>
                </h1>
                <p className="page-subtitle">
                    Understanding RAG parameters, failure modes, and tuning strategies
                    is crucial for production deployment.
                </p>
            </motion.div>

            {/* Trade-offs Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Sliders className="w-6 h-6 text-primary" />
                    Key Trade-offs
                </h2>

                <div className="space-y-6">
                    {tradeoffs.map((tradeoff, index) => (
                        <motion.div
                            key={tradeoff.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">{tradeoff.name}</h3>
                                    <p className="text-foreground-muted text-sm mb-4">
                                        {tradeoff.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 bg-background rounded-lg border border-border">
                                            <p className="text-xs text-foreground-muted mb-1">Low Value</p>
                                            <p className="font-mono text-sm text-accent-cyan">{tradeoff.low.value}</p>
                                            <p className="text-xs text-foreground-muted mt-1">{tradeoff.low.effect}</p>
                                        </div>
                                        <div className="p-3 bg-background rounded-lg border border-border">
                                            <p className="text-xs text-foreground-muted mb-1">High Value</p>
                                            <p className="font-mono text-sm text-accent-purple">{tradeoff.high.value}</p>
                                            <p className="text-xs text-foreground-muted mt-1">{tradeoff.high.effect}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-accent-green/10 rounded-lg border border-accent-green/20">
                                        <p className="text-sm text-accent-green">
                                            <strong>Recommendation:</strong> {tradeoff.recommendation}
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:w-48">
                                    <p className="text-xs text-foreground-muted uppercase tracking-wider mb-2">
                                        Impacts
                                    </p>
                                    <ul className="space-y-2">
                                        {tradeoff.impact.map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm">
                                                <Target className="w-4 h-4 text-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Good vs Bad Examples */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8">
                    RAG vs Non-RAG: Real Examples
                </h2>

                <div className="space-y-8">
                    {exampleComparisons.map((example, index) => (
                        <motion.div
                            key={example.scenario}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="mb-4">
                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                                    Scenario
                                </span>
                                <h3 className="text-lg font-semibold mt-2">{example.scenario}</h3>
                                <p className="text-foreground-muted text-sm mt-1">
                                    <strong>Question:</strong> &quot;{example.question}&quot;
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Bad Answer */}
                                <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        <span className="font-medium text-red-400">{example.bad.type}</span>
                                    </div>
                                    <p className="text-sm text-foreground-muted mb-3 italic">
                                        &quot;{example.bad.answer}&quot;
                                    </p>
                                    <ul className="space-y-1">
                                        {example.bad.issues.map((issue) => (
                                            <li key={issue} className="flex items-center gap-2 text-xs text-red-400">
                                                <XCircle className="w-3 h-3" />
                                                {issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Good Answer */}
                                <div className="p-4 bg-accent-green/5 rounded-xl border border-accent-green/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-accent-green" />
                                        <span className="font-medium text-accent-green">{example.good.type}</span>
                                    </div>
                                    <p className="text-sm text-foreground-muted mb-3 italic">
                                        &quot;{example.good.answer}&quot;
                                    </p>
                                    <ul className="space-y-1">
                                        {example.good.strengths.map((strength) => (
                                            <li key={strength} className="flex items-center gap-2 text-xs text-accent-green">
                                                <CheckCircle className="w-3 h-3" />
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Failure Cases */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    Common Failure Cases
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {failureCases.map((failure, index) => (
                        <motion.div
                            key={failure.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                    <failure.icon className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{failure.title}</h3>
                                    <p className="text-foreground-muted text-sm mb-3">
                                        {failure.description}
                                    </p>

                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-red-400 font-medium">Cause:</span>{" "}
                                            <span className="text-foreground-muted">{failure.cause}</span>
                                        </p>
                                        <p>
                                            <span className="text-accent-green font-medium">Solution:</span>{" "}
                                            <span className="text-foreground-muted">{failure.solution}</span>
                                        </p>
                                    </div>

                                    <div className="mt-3 p-2 bg-background rounded border border-border">
                                        <p className="text-xs text-foreground-muted font-mono">
                                            {failure.example}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
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
                        Ready to see how this was built?
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Explore the design decisions and technical choices behind RAG Lab.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/about" className="btn-primary inline-flex items-center gap-2">
                            Read Case Study
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/demo" className="btn-secondary inline-flex items-center gap-2">
                            Try the Demo
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
