"use client";

import { Fragment, useRef, useState, type KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon";
import { Chapter, FinalCta, PageHead } from "@/components/page/Chapter";

interface PipelineStep {
    id: string;
    title: string;
    description: string;
    why: string;
    tradeoffs: { title: string; description: string }[];
    technicalDetails: string[];
}

const pipelineSteps: PipelineStep[] = [
    {
        id: "query",
        title: "User Query",
        description: "User submits a natural language question about their documents.",
        why: "The entry point to the RAG system. The quality of the query affects retrieval quality.",
        tradeoffs: [{ title: "Query Length", description: "Longer queries provide more context but may reduce precision." }],
        technicalDetails: ["Accepts natural language input", "No special syntax required", "UTF-8 encoded text"],
    },
    {
        id: "embedding",
        title: "Query Embedding",
        description: "The query is converted into a dense vector representation using an embedding model.",
        why: "Embeddings capture semantic meaning, enabling fuzzy matching beyond keyword search.",
        tradeoffs: [
            { title: "Latency", description: "API call to embedding model adds ~100-300ms." },
            { title: "Cost", description: "Each query incurs embedding API costs (~$0.0001/query)." },
        ],
        technicalDetails: ["Model: text-embedding-3-small", "Vector dimension: 1536", "Same model used for documents"],
    },
    {
        id: "vectordb",
        title: "Vector Database",
        description: "FAISS vector store contains all document chunk embeddings, indexed for fast similarity search.",
        why: "Vector databases enable semantic search at scale with sub-linear time complexity.",
        tradeoffs: [
            { title: "Memory", description: "Stores all embeddings in RAM (~6KB per chunk)." },
            { title: "Accuracy vs Speed", description: "Approximate search is faster but may miss some matches." },
        ],
        technicalDetails: ["FAISS IndexFlatIP (exact search)", "Cosine similarity metric", "Session-isolated stores"],
    },
    {
        id: "retrieval",
        title: "Top-K Retrieval",
        description: "The most similar document chunks are retrieved based on cosine similarity with the query.",
        why: "Selecting the most relevant context ensures the LLM has the best information to work with.",
        tradeoffs: [
            { title: "Recall vs Precision", description: "Higher K = more context but potentially less relevant." },
            { title: "Token Budget", description: "More chunks = more tokens = higher cost and latency." },
        ],
        technicalDetails: ["Default K=4 chunks", "Returns similarity scores", "Ordered by relevance"],
    },
    {
        id: "augmentation",
        title: "Prompt Augmentation",
        description: "Retrieved chunks are injected into a structured prompt with the original question.",
        why: "Context placement and formatting directly affects LLM response quality.",
        tradeoffs: [
            { title: "Context Window", description: "Limited by model's max tokens (e.g., 8K, 128K)." },
            { title: "Prompt Engineering", description: "Template design affects answer quality significantly." },
        ],
        technicalDetails: ["System prompt with instructions", "Context block with sources", "User question at end"],
    },
    {
        id: "generation",
        title: "LLM Response",
        description: "The LLM generates an answer grounded in the retrieved context, citing sources.",
        why: "The LLM synthesizes retrieved information into a coherent, helpful response.",
        tradeoffs: [
            { title: "Latency", description: "LLM generation is the slowest step (~1-5 seconds)." },
            { title: "Cost", description: "Token-based pricing for input + output (~$0.01-0.10/query)." },
            { title: "Accuracy", description: "Model may still hallucinate despite context." },
        ],
        technicalDetails: ["Model: GPT-4o-mini", "Temperature: 0.1 (factual)", "Structured output format"],
    },
];

const ingestFlow = [
    { name: "Documents", spec: "PDF, TXT" },
    { name: "Chunking", spec: "1000 chars" },
    { name: "Embeddings", spec: "1536-dim" },
    { name: "FAISS", spec: "Vector store" },
];

const queryFlow = [
    { name: "Query", spec: "User input" },
    { name: "Retrieve", spec: "Top-K" },
    { name: "Generate", spec: "GPT-4o-mini" },
];

function FlowLane({ title, nodes }: { title: string; nodes: { name: string; spec: string }[] }) {
    return (
        <div className="flow-lane">
            <h3 className="mono">{title}</h3>
            <ol className="flow-nodes">
                {nodes.map((node, index) => (
                    <Fragment key={node.name}>
                        <li className="flow-node"><b>{node.name}</b><span className="mono">{node.spec}</span></li>
                        {index < nodes.length - 1 && <li aria-hidden="true" className="flow-arrow"><Icon name="arrow-right-linear" size={18} /></li>}
                    </Fragment>
                ))}
            </ol>
        </div>
    );
}

export default function ArchitecturePage() {
    const [activeStep, setActiveStep] = useState<string | null>(null);
    const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
    const selected = pipelineSteps.find((step) => step.id === activeStep);
    const selectedIndex = pipelineSteps.findIndex((step) => step.id === activeStep);

    const close = () => {
        const id = activeStep;
        setActiveStep(null);
        if (id) triggers.current[id]?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && activeStep) close();
    };

    return (
        <>
            <PageHead
                label="Guide 02 — Architecture"
                title={["The", "architecture."]}
                lede="Six components between a question and a grounded answer. Open any step to see why it exists, what it costs, and how it is configured here."
                meta={["6 components", "Click to inspect"]}
            />

            <Chapter id="components" label="01 — Components" title="Open a step to inspect it.">
                <div onKeyDown={onKeyDown}>
                    <div className="steps-grid" data-reveal-stagger>
                        {pipelineSteps.map((step, index) => (
                            <button
                                key={step.id}
                                ref={(el) => { triggers.current[step.id] = el; }}
                                type="button"
                                className="step-card"
                                aria-expanded={activeStep === step.id}
                                aria-controls="step-detail"
                                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                            >
                                <span className="step-card-top">
                                    <span className="step-card-num mono">Step {String(index + 1).padStart(2, "0")}</span>
                                    <Icon name={activeStep === step.id ? "minus-circle-linear" : "add-circle-linear"} size={22} />
                                </span>
                                <span className="step-card-title">{step.title}</span>
                                <span className="step-card-text">{step.description}</span>
                            </button>
                        ))}
                    </div>

                    <div id="step-detail" aria-live="polite">
                        {selected && (
                            <section className="step-detail" aria-label={`${selected.title} details`}>
                                <div className="step-detail-head">
                                    <div>
                                        <span className="mono">Step {String(selectedIndex + 1).padStart(2, "0")}</span>
                                        <h3>{selected.title}</h3>
                                    </div>
                                    <button type="button" className="icon-btn" onClick={close} aria-label="Close details">
                                        <Icon name="close-circle-linear" size={24} />
                                    </button>
                                </div>
                                <div className="step-detail-grid">
                                    <div>
                                        <h4>Why this step exists</h4>
                                        <p>{selected.why}</p>
                                    </div>
                                    <div>
                                        <h4>Trade-offs</h4>
                                        <ul>
                                            {selected.tradeoffs.map((tradeoff) => (
                                                <li key={tradeoff.title} className="tradeoff"><b>{tradeoff.title}</b>{tradeoff.description}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4>Technical details</h4>
                                        <ul>{selected.technicalDetails.map((detail) => <li key={detail} className="code">{detail}</li>)}</ul>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </Chapter>

            <Chapter id="flow" label="02 — Data flow" title="Two lanes, one index." note="Documents are indexed once per session; every question then runs the query lane against that index.">
                <div className="flow" data-reveal>
                    <FlowLane title="Ingest · once per document" nodes={ingestFlow} />
                    <div className="flow-divider" aria-hidden="true" />
                    <FlowLane title="Query · every question" nodes={queryFlow} />
                </div>
            </Chapter>

            <FinalCta
                label="Next"
                title="Watch the pipeline run."
                text="Upload a document in the demo and every retrieved chunk, score and source is shown alongside the answer."
                href="/demo"
                action="Launch the demo"
                secondary={{ href: "/evaluation", label: "Read the trade-offs" }}
            />
        </>
    );
}
