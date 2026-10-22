"use client";

import { Chapter, FinalCta, PageHead } from "@/components/page/Chapter";
import PipelineSequence, { type PipelineStepData } from "@/components/rag/PipelineSequence";

const ragSteps: PipelineStepData[] = [
    {
        title: "Document Ingestion",
        description: "Documents are loaded and split into smaller chunks for processing.",
        details: ["Split documents into overlapping chunks", "Preserve context at boundaries", "Handle multiple file formats (PDF, TXT)"],
    },
    {
        title: "Embedding Generation",
        description: "Each chunk is converted into a vector embedding.",
        details: ["Use embedding models (e.g., text-embedding-3-small)", "Capture semantic meaning in vectors", "Enable similarity comparisons"],
    },
    {
        title: "Vector Storage",
        description: "Embeddings are stored in a vector database for fast retrieval.",
        details: ["Index vectors for similarity search", "Use FAISS for efficient storage", "Support approximate nearest neighbors"],
    },
    {
        title: "Query Processing",
        description: "User questions are embedded using the same model.",
        details: ["Convert question to vector", "Match vector space with documents", "Prepare for similarity search"],
    },
    {
        title: "Context Retrieval",
        description: "Most similar document chunks are retrieved from the vector store.",
        details: ["Find top-k most similar chunks", "Rank by cosine similarity", "Return with similarity scores"],
    },
    {
        title: "Augmented Generation",
        description: "The LLM generates an answer using the retrieved context.",
        details: ["Inject context into prompt", "Generate grounded response", "Cite sources in answer"],
    },
];

const problems = [
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
        description: "There is no way to trace where information came from.",
        example: "Users have no way to verify claims made by the model.",
    },
];

const useCases = [
    "Customer support chatbots with company documentation",
    "Internal knowledge bases for employees",
    "Legal document search and analysis",
    "Medical literature review systems",
    "Code documentation assistants",
];

const benefits = [
    "Answers grounded in real documents",
    "Access to private and proprietary data",
    "Up-to-date information beyond the training cutoff",
    "Auditable responses with source citations",
    "Lower cost than fine-tuning models",
];

export default function WhatIsRAGPage() {
    return (
        <>
            <PageHead
                label="Guide 01 — Fundamentals"
                title={["What is", "RAG?"]}
                lede="Retrieval-Augmented Generation combines a large language model with retrieval from your own documents, so answers are grounded in real sources instead of the model's memory."
                meta={["6 steps", "1 pipeline"]}
            />

            <Chapter id="problem" label="01 — The problem" title="Language models answer from memory.">
                <div className="problems" data-reveal-stagger>
                    {problems.map((item) => (
                        <article key={item.problem} className="problem">
                            <h3>{item.problem}</h3>
                            <p className="muted">{item.description}</p>
                            <blockquote>{item.example}</blockquote>
                        </article>
                    ))}
                </div>
            </Chapter>

            <Chapter id="insight" label="02 — The core insight" title="Look it up first, then answer.">
                <div className="insight">
                    <div className="insight-copy" data-reveal>
                        <p>
                            Instead of relying only on what an LLM learned during training, <strong>RAG retrieves relevant
                            passages from your own documents</strong> and hands them to the model as context for its answer.
                        </p>
                        <p>
                            That grounds responses in actual data, reduces hallucination, and opens up private or recent
                            information the model never saw.
                        </p>
                    </div>
                    <pre className="codeblock" data-reveal aria-label="RAG in pseudocode">
                        <code>
                            <span className="c"># Pseudocode</span>{"\n"}
                            <span className="k">def</span> <span className="f">rag_query</span>(question, documents):{"\n"}
                            {"    "}<span className="c"># 1. Find relevant context</span>{"\n"}
                            {"    "}context = <span className="f">retrieve</span>(question, documents){"\n"}
                            {"    "}<span className="c"># 2. Augment the prompt with context</span>{"\n"}
                            {"    "}prompt = <span className="f">build_prompt</span>(question, context){"\n"}
                            {"    "}<span className="c"># 3. Generate a grounded answer</span>{"\n"}
                            {"    "}<span className="k">return</span> <span className="f">llm</span>(prompt)
                        </code>
                    </pre>
                </div>
            </Chapter>

            <PipelineSequence steps={ragSteps} />

            <Chapter id="production" label="04 — In production" title="Why teams ship RAG.">
                <div className="two-col" data-reveal-stagger>
                    <div className="list-block">
                        <h3>Use cases</h3>
                        <ul>{useCases.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div className="list-block">
                        <h3>Benefits</h3>
                        <ul>{benefits.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                </div>
            </Chapter>

            <FinalCta
                label="Next"
                title="See every component up close."
                text="Explore the architecture step by step, or skip ahead and try the pipeline on your own document."
                href="/architecture"
                action="View the architecture"
                secondary={{ href: "/demo", label: "Try the demo" }}
            />
        </>
    );
}
