"use client";

import { Chapter, FinalCta, PageHead } from "@/components/page/Chapter";

const highlights = [
    "Full-stack implementation (Next.js + FastAPI)",
    "Real RAG pipeline with FAISS + LangChain",
    "Interactive demo with live document processing",
    "Production-style code patterns",
];

const techStack = [
    {
        category: "Frontend",
        items: [
            { name: "Next.js 14", description: "App Router for modern React patterns" },
            { name: "TypeScript", description: "Type safety and better DX" },
            { name: "Tailwind CSS", description: "Reset and utility layer" },
            { name: "GSAP + Lenis", description: "Scroll choreography and smooth scrolling" },
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
        category: "AI / ML",
        items: [
            { name: "GPT-4o-mini", description: "Response generation (any OpenAI-compatible API)" },
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

const lessons = [
    { title: "Start Simple", description: "Basic RAG works surprisingly well. Add complexity only when needed." },
    { title: "Chunk Size Matters", description: "Too small = no context. Too large = noise. 1000 chars is a good starting point." },
    { title: "Prompt Engineering is Key", description: "The system prompt significantly affects response quality and grounding." },
    { title: "Observability is Essential", description: "Log retrieved chunks and scores to debug and improve the pipeline." },
];

const improvements = [
    {
        category: "Retrieval Quality",
        items: ["Add reranking with a cross-encoder model", "Implement hybrid search (semantic + keyword)", "Use HyDE (Hypothetical Document Embeddings)", "Add query expansion/reformulation"],
    },
    {
        category: "Scalability",
        items: ["Use managed vector DB (Pinecone, Weaviate, Qdrant)", "Add Redis caching for frequent queries", "Implement connection pooling", "Deploy with auto-scaling"],
    },
    {
        category: "Reliability",
        items: ["Add comprehensive error handling", "Implement retry logic with exponential backoff", "Add health checks and monitoring", "Set up structured logging"],
    },
    {
        category: "User Experience",
        items: ["Streaming responses for faster perceived latency", "Add conversation history and memory", "Implement feedback collection", "Support more file formats (DOCX, HTML, etc.)"],
    },
];

export default function AboutPage() {
    return (
        <>
            <PageHead
                label="Guide 04 — Case study"
                title={["About", "the build."]}
                lede="The design decisions, technical choices and lessons behind this RAG implementation, plus an honest list of what production would still need."
                meta={["Next.js + FastAPI", "Open source"]}
            />

            <Chapter id="overview" label="01 — Overview" title="Beyond the tutorial.">
                <div className="overview">
                    <div className="overview-copy" data-reveal>
                        <p>
                            RagXGen is a portfolio project built to demonstrate a working understanding of Retrieval-Augmented
                            Generation: a complete implementation with clear architecture and an honest discussion of trade-offs.
                        </p>
                        <p>
                            The goal is to show employers, collaborators and AI leads the ability to build, evaluate and improve
                            real systems, not just follow a guide.
                        </p>
                    </div>
                    <ul className="overview-points" data-reveal-stagger>
                        {highlights.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            </Chapter>

            <Chapter id="stack" label="02 — Tech stack" title="What it runs on.">
                <div className="stack-cols" data-reveal-stagger>
                    {techStack.map((column) => (
                        <div key={column.category} className="stack-col">
                            <h3>{column.category}</h3>
                            <ul>
                                {column.items.map((item) => (
                                    <li key={item.name}><b>{item.name}</b><span>{item.description}</span></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Chapter>

            <Chapter id="decisions" label="03 — Design decisions" title="Each choice, and its cost.">
                <div>
                    {designDecisions.map((item) => (
                        <article key={item.decision} className="decision" data-reveal>
                            <h3>{item.decision}</h3>
                            <dl>
                                <div><dt>Why</dt><dd>{item.why}</dd></div>
                                <div><dt>Trade-off</dt><dd>{item.tradeoff}</dd></div>
                                <div><dt>Alternative</dt><dd>{item.alternative}</dd></div>
                            </dl>
                        </article>
                    ))}
                </div>
            </Chapter>

            <Chapter id="lessons" dark label="04 — Lessons learned" title="What building it taught.">
                <div className="lessons" data-reveal-stagger>
                    {lessons.map((lesson, index) => (
                        <article key={lesson.title} className="lesson">
                            <p className="mono">Lesson {String(index + 1).padStart(2, "0")}</p>
                            <h3>{lesson.title}</h3>
                            <p>{lesson.description}</p>
                        </article>
                    ))}
                </div>
            </Chapter>

            <Chapter id="production" label="05 — Production" title="What production would add." note="If this were deployed for real users, these come next.">
                <div className="improvements" data-reveal-stagger>
                    {improvements.map((group) => (
                        <div key={group.category} className="list-block">
                            <h3>{group.category}</h3>
                            <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </Chapter>

            <FinalCta
                label="Let's connect"
                title="Talk RAG, or try it."
                text="Interested in RAG, AI engineering, or working together? The source is on GitHub, and the demo is one click away."
                href="/demo"
                action="Try the demo"
                secondary={{ href: "https://github.com/pananon/ragxgen", label: "View on GitHub" }}
            />
        </>
    );
}
