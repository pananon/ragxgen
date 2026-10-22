"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import RetrievalSpecimen from "@/components/home/RetrievalSpecimen";
import { Chapter, FinalCta } from "@/components/page/Chapter";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const moves = [
    {
        title: "Upload & chunk",
        text: "Drop in a PDF or text file. It is split into overlapping chunks so no idea is cut off at a boundary.",
        spec: "RecursiveCharacterTextSplitter · 1000 chars",
    },
    {
        title: "Embed & index",
        text: "Each chunk becomes a vector that captures its meaning, stored in an index built for similarity search.",
        spec: "text-embedding-3-small · FAISS",
    },
    {
        title: "Retrieve top-K",
        text: "Your question is embedded the same way, and the closest chunks come back with their similarity scores.",
        spec: "Cosine similarity · K = 4 default",
    },
    {
        title: "Generate with sources",
        text: "The model answers using only the retrieved passages, and the answer lists which documents it drew on.",
        spec: "GPT-4o-mini · temperature 0.1",
    },
];

const claims = [
    {
        label: "Grounding",
        title: "Fewer made-up answers",
        text: "Responses are built from your documents, not the model's memory, which cuts down on confident fabrication.",
    },
    {
        label: "Freshness",
        title: "Data the model never saw",
        text: "Ask about last week's release notes or a private policy file. Retrieval reaches past the training cutoff.",
    },
    {
        label: "Attribution",
        title: "Every answer shows its sources",
        text: "Retrieved chunks, their scores and source files are visible, so an answer can be checked, not just trusted.",
    },
];

const stack = [
    { key: "Frontend", value: "Next.js 14", note: "App Router, TypeScript, Tailwind CSS" },
    { key: "Backend", value: "FastAPI", note: "Async Python API with Pydantic validation" },
    { key: "Orchestration", value: "LangChain", note: "Loading, splitting, retrieval and prompting" },
    { key: "Vector store", value: "FAISS", note: "Exact inner-product search, one index per session" },
    { key: "Models", value: "OpenAI-compatible", note: "GPT-4o-mini by default; DeepSeek and similar APIs supported" },
];

const guides = [
    { href: "/what-is-rag", name: "What is RAG?", desc: "The problem it solves and the six-step pipeline." },
    { href: "/architecture", name: "Architecture", desc: "Each component, why it exists, and its trade-offs." },
    { href: "/evaluation", name: "Evaluation", desc: "Tuning parameters and the ways RAG fails." },
    { href: "/about", name: "About the build", desc: "Design decisions and what production would add." },
];

const TITLE: { word: string; mark?: boolean }[] = [
    { word: "Answers" }, { word: "you" }, { word: "can" }, { word: "trace" }, { word: "back" }, { word: "to" },
    { word: "the", mark: true }, { word: "page.", mark: true },
];

export default function HomePage() {
    const hero = useRef<HTMLElement>(null);

    // Intro: the headline rises word by word, then the highlighter strokes "the page".
    // Copy and actions are never hidden, so the page is usable from the first frame.
    useLayoutEffect(() => {
        if (prefersReducedMotion() || !hero.current) return undefined;
        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .fromTo(".hero-title .split-inner", { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.06, ease: "power4.out" }, 0.1)
                .fromTo(".hero-title .mark-word .split-inner", { "--mark-size": "0%" }, { "--mark-size": "100%", duration: 0.6, stagger: 0.12, ease: "power2.inOut" }, 0.95)
                .fromTo(".hero-copy .chapter-label", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2);
        }, hero);
        return () => ctx.revert();
    }, []);

    return (
        <>
            <section ref={hero} className="hero" aria-labelledby="hero-title">
                <div className="wrap grid-12">
                    <div className="hero-copy">
                        <p className="chapter-label mono">Retrieval-augmented generation, built in the open</p>
                        <h1 id="hero-title" className="hero-title" data-split>
                            <span className="sr-only">Answers you can trace back to the page.</span>
                            <span aria-hidden="true">
                                {TITLE.map(({ word, mark }, index) => (
                                    <Fragment key={word}>
                                        <span className={`split-word ${mark ? "mark-word" : ""}`}><span className="split-inner">{word}</span></span>
                                        {index < TITLE.length - 1 ? " " : ""}
                                    </Fragment>
                                ))}
                            </span>
                        </h1>
                        <p className="hero-lede">
                            RagXGen is a working RAG system. Upload a PDF or text file, ask a question, and see which passages were
                            retrieved, how closely they matched, and where the answer came from.
                        </p>
                        <div className="hero-ctas">
                            <Link href="/demo" className="btn btn-ink">Try the live demo <Icon name="arrow-right-linear" size={16} /></Link>
                            <Link href="/what-is-rag" className="btn btn-line">How RAG works</Link>
                        </div>
                    </div>
                    <div className="hero-specimen">
                        <RetrievalSpecimen />
                    </div>
                </div>
            </section>

            <Chapter id="pipeline" label="01 — The pipeline" title="Four moves from file to grounded answer." note="The same steps run behind every question in the demo.">
                <ol className="moves" data-reveal-stagger>
                    {moves.map((move, index) => (
                        <li key={move.title} className="move">
                            <span className="move-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            <h3 className="move-title">{move.title}</h3>
                            <p className="move-text">{move.text}</p>
                            <p className="move-spec mono">{move.spec}</p>
                        </li>
                    ))}
                </ol>
            </Chapter>

            <Chapter id="why" dark label="02 — Why retrieval" title="A model that reads before it answers.">
                <div className="claims" data-reveal-stagger>
                    {claims.map((claim) => (
                        <article key={claim.title} className="claim">
                            <p className="mono">{claim.label}</p>
                            <h3>{claim.title}</h3>
                            <p>{claim.text}</p>
                        </article>
                    ))}
                </div>
            </Chapter>

            <Chapter id="stack" label="03 — Built with" title="A small, honest stack." note="Every piece is swappable; the trade-offs are written up in the About page.">
                <dl className="ledger" data-reveal-stagger>
                    {stack.map((row) => (
                        <div key={row.key} className="ledger-row">
                            <dt className="ledger-key mono">{row.key}</dt>
                            <dd className="ledger-value">{row.value}</dd>
                            <dd className="ledger-note">{row.note}</dd>
                        </div>
                    ))}
                </dl>
            </Chapter>

            <Chapter id="guides" label="04 — Read further" title="Understand it, then break it.">
                <nav aria-label="Guides" className="index-list" data-reveal-stagger>
                    {guides.map((guide, index) => (
                        <Link key={guide.href} href={guide.href} className="index-link">
                            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                            <span className="index-name">
                                <span>{guide.name}</span>
                                <span className="index-desc">{guide.desc}</span>
                            </span>
                            <Icon name="arrow-right-linear" size={32} />
                        </Link>
                    ))}
                </nav>
            </Chapter>

            <FinalCta
                label="05 — Live demo"
                title="Bring a document. Ask it anything."
                text="Upload a PDF or TXT file and question it. Every answer comes with the chunks it was built from."
                href="/demo"
                action="Open the demo"
            />
        </>
    );
}
