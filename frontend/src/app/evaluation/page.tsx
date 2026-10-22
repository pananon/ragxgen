"use client";

import Icon from "@/components/ui/Icon";
import { Chapter, FinalCta, PageHead } from "@/components/page/Chapter";

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
            answer: "I don't have information about events after my training cutoff in early 2024. Please check the official documentation or announcements.",
            issues: ["No access to recent data", "Cannot help with current info"],
        },
        good: {
            answer: "According to the Q4 2024 release notes, the latest feature is the AI-powered search enhancement, launched on December 15th. This includes semantic search and auto-complete functionality. (Source: release-notes-q4.pdf)",
            strengths: ["Access to current data", "Cites specific sources", "Provides accurate details"],
        },
    },
    {
        scenario: "Company-specific information",
        question: "What is our company's refund policy?",
        bad: {
            answer: "Typically, refund policies vary by company. Most companies offer 30-day return windows. Please check your specific company's policy documentation for accurate information.",
            issues: ["Generic answer", "No specific details", "User must look elsewhere"],
        },
        good: {
            answer: "According to the customer policy document, refunds are available within 14 days of purchase for digital products and 30 days for physical items. Refund requests must be submitted through the support portal. (Source: customer-policies.pdf, Chunk 12)",
            strengths: ["Company-specific answer", "Accurate policy details", "Actionable information"],
        },
    },
];

const failureCases = [
    {
        title: "Insufficient Context",
        description: "When retrieved chunks don't contain the answer",
        cause: "Document doesn't contain relevant information, or chunks are too small/large",
        solution: "Adjust chunk size, improve document coverage, or acknowledge uncertainty",
        example: "Q: What's the CEO's phone number? → If not in documents, RAG can't help",
    },
    {
        title: "Wrong Document Retrieved",
        description: "Similar embeddings but irrelevant content",
        cause: "Embedding model captures wrong semantic aspects, or documents have similar vocabulary",
        solution: "Use reranking, hybrid search, or better embedding models",
        example: "Q: Python snake care → Retrieves Python programming docs instead",
    },
    {
        title: "Hallucination Despite Context",
        description: "LLM generates incorrect info even with good context",
        cause: "LLM may still rely on training data or misinterpret context",
        solution: "Lower temperature, use structured prompts, add verification steps",
        example: "Context mentions 'up to 30 days' but LLM says 'exactly 30 days'",
    },
    {
        title: "Context Window Overflow",
        description: "Too much retrieved context exceeds model limits",
        cause: "High top-K or large chunks with long queries",
        solution: "Limit context length, use summarization, or chunked generation",
        example: "10 chunks × 1000 chars approaches context limits with long prompts",
    },
];

export default function EvaluationPage() {
    return (
        <>
            <PageHead
                label="Guide 03 — Evaluation"
                title={["Evaluation &", "trade-offs."]}
                lede="RAG is a set of dials, not a switch. These are the parameters that matter, what good and bad answers look like, and the ways the pipeline fails."
                meta={["3 parameters", "4 failure modes"]}
            />

            <Chapter id="tradeoffs" label="01 — Key trade-offs" title="Three dials that shape every answer.">
                <div>
                    {tradeoffs.map((tradeoff) => (
                        <article key={tradeoff.name} className="spec" data-reveal>
                            <div className="spec-head">
                                <h3>{tradeoff.name}</h3>
                                <p className="muted">{tradeoff.description}</p>
                            </div>
                            <dl className="spec-range">
                                <div>
                                    <dt className="mono muted">Low value</dt>
                                    <dd className="code">{tradeoff.low.value}</dd>
                                    <dd><p>{tradeoff.low.effect}</p></dd>
                                </div>
                                <div>
                                    <dt className="mono muted">High value</dt>
                                    <dd className="code">{tradeoff.high.value}</dd>
                                    <dd><p>{tradeoff.high.effect}</p></dd>
                                </div>
                            </dl>
                            <p className="spec-rec"><strong>Recommendation:</strong> {tradeoff.recommendation}</p>
                            <div className="spec-impact">
                                <p className="mono">Impacts</p>
                                <ul className="tag-row">{tradeoff.impact.map((item) => <li key={item}>{item}</li>)}</ul>
                            </div>
                        </article>
                    ))}
                </div>
            </Chapter>

            <Chapter id="examples" label="02 — RAG vs non-RAG" title="The same question, two answers." note="Illustrative examples of how retrieval changes an answer.">
                <div>
                    {exampleComparisons.map((example) => (
                        <article key={example.scenario} className="compare" data-reveal>
                            <div className="compare-head">
                                <p className="mono muted">Scenario</p>
                                <h3>{example.scenario}</h3>
                                <q>{example.question}</q>
                            </div>
                            <div className="compare-grid">
                                <div className="answer-card answer-bad">
                                    <p className="mono">Without RAG</p>
                                    <blockquote>{example.bad.answer}</blockquote>
                                    <ul>
                                        {example.bad.issues.map((issue) => (
                                            <li key={issue}><Icon name="close-circle-linear" size={16} />{issue}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="answer-card answer-good">
                                    <p className="mono">With RAG</p>
                                    <blockquote>{example.good.answer}</blockquote>
                                    <ul>
                                        {example.good.strengths.map((strength) => (
                                            <li key={strength}><Icon name="check-circle-linear" size={16} />{strength}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </Chapter>

            <Chapter id="failures" dark label="03 — Failure modes" title="Where RAG breaks, and what to do about it.">
                <div className="failures" data-reveal-stagger>
                    {failureCases.map((failure) => (
                        <article key={failure.title} className="failure">
                            <h3>{failure.title}</h3>
                            <p>{failure.description}</p>
                            <dl>
                                <div><dt>Cause</dt><dd>{failure.cause}</dd></div>
                                <div><dt>Solution</dt><dd>{failure.solution}</dd></div>
                            </dl>
                            <p className="code">{failure.example}</p>
                        </article>
                    ))}
                </div>
            </Chapter>

            <FinalCta
                label="Next"
                title="See how it was built."
                text="The design decisions, the stack, and what this project would need before it ran in production."
                href="/about"
                action="Read the case study"
                secondary={{ href: "/demo", label: "Try the demo" }}
            />
        </>
    );
}
