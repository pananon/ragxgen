"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Database,
    Brain,
    Search,
    FileText,
    Zap,
    Shield,
    Sparkles,
    ChevronRight,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Document Upload",
        description: "Upload PDFs and text files. Watch them transform into searchable vectors.",
    },
    {
        icon: Search,
        title: "Semantic Search",
        description: "Ask natural language questions. Find relevant context instantly.",
    },
    {
        icon: Brain,
        title: "Grounded Answers",
        description: "LLM responses backed by your actual documents. No hallucinations.",
    },
    {
        icon: Database,
        title: "Vector Storage",
        description: "FAISS-powered similarity search. Fast and efficient retrieval.",
    },
];

const techStack = [
    { name: "Next.js", category: "Frontend" },
    { name: "FastAPI", category: "Backend" },
    { name: "LangChain", category: "RAG" },
    { name: "FAISS", category: "Vector DB" },
    { name: "OpenAI", category: "LLM" },
];

export default function HomePage() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="section-container pt-20 pb-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        Hands-on RAG Implementation
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold leading-tight mb-6"
                    >
                        Ask questions.{" "}
                        <span className="gradient-text">Get answers grounded</span> in your data.
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-foreground-muted mb-10 max-w-2xl mx-auto"
                    >
                        A hands-on implementation of Retrieval-Augmented Generation.
                        Upload documents, ask questions, see the magic happen.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/demo" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                            Try Live Demo
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/architecture" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                            View Architecture
                        </Link>
                        <Link href="/what-is-rag" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                            Learn How It Works
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-20 relative"
                >
                    <div className="glass-card p-8 rounded-3xl glow max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Query Input */}
                            <div className="flex-1 w-full">
                                <div className="bg-background rounded-xl p-4 border border-border">
                                    <div className="flex items-center gap-3 text-foreground-muted">
                                        <Search className="w-5 h-5" />
                                        <span className="font-mono text-sm">
                                            &quot;What are the key features of the product?&quot;
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:flex items-center">
                                <ChevronRight className="w-8 h-8 text-primary animate-pulse" />
                            </div>

                            {/* Response Preview */}
                            <div className="flex-1 w-full">
                                <div className="bg-background rounded-xl p-4 border border-primary/30">
                                    <p className="text-sm">
                                        <span className="text-accent-green">✓</span> Based on product-docs.pdf:
                                        <span className="text-foreground-muted ml-2">
                                            &quot;The key features include real-time sync, AI-powered search...&quot;
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="section-container py-24 border-t border-border">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How RagXGen Works
                    </h2>
                    <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
                        A complete RAG pipeline from document upload to grounded answers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 card-hover"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-foreground-muted text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why RAG Section */}
            <section className="section-container py-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Why Retrieval-Augmented Generation?
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-accent-green" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Reduce Hallucinations</h3>
                                    <p className="text-foreground-muted text-sm">
                                        Ground LLM responses in actual documents, not training data fantasies.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-accent-cyan" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Access Fresh Data</h3>
                                    <p className="text-foreground-muted text-sm">
                                        Query documents from today, not just the LLM&apos;s training cutoff.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                                    <Database className="w-5 h-5 text-accent-purple" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Cite Your Sources</h3>
                                    <p className="text-foreground-muted text-sm">
                                        Know exactly which documents informed each answer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-3xl">
                        <h4 className="font-semibold mb-4 text-sm text-foreground-muted uppercase tracking-wider">
                            Tech Stack
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {techStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className="p-4 rounded-xl bg-background border border-border"
                                >
                                    <p className="font-semibold">{tech.name}</p>
                                    <p className="text-sm text-foreground-muted">{tech.category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-container py-24">
                <div className="glass-card p-12 rounded-3xl text-center glow">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to see RAG in action?
                    </h2>
                    <p className="text-foreground-muted text-lg mb-8 max-w-xl mx-auto">
                        Upload your documents and ask questions. Experience the power of
                        retrieval-augmented generation first-hand.
                    </p>
                    <Link href="/demo" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                        Launch Live Demo
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
