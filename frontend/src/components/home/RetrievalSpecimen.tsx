"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { gsap, prefersReducedMotion } from "@/lib/motion";

// An illustrative retrieval, using the same example as the Evaluation page. It is scripted,
// not a live query; the live system is on /demo.
const QUERY = "What is the refund window for digital products?";
const TOP_K = 3;
const CHUNKS = [
    { source: "customer-policies.pdf", chunk: 12, score: 0.86, text: "Refunds are available within 14 days of purchase for digital products. Requests must be submitted through the support portal." },
    { source: "customer-policies.pdf", chunk: 13, score: 0.74, text: "Physical items may be returned within 30 days in their original condition. Shipping costs are non-refundable." },
    { source: "faq.txt", chunk: 4, score: 0.58, text: "How do I contact support? Open a ticket from the support portal and the team will respond." },
    { source: "release-notes-q4.pdf", chunk: 2, score: 0.21, text: "The Q4 release adds semantic search and auto-complete to the dashboard." },
];
// Answer as segments: plain text, or a citation pointing at a chunk index.
const ANSWER: (string | number)[] = [
    "Digital products can be refunded within 14 days of purchase", 0,
    ". Physical items have a 30-day window", 1,
    ". Either way, requests go through the support portal", 0, ".",
];

export default function RetrievalSpecimen() {
    const root = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);
    const [active, setActive] = useState<number | null>(null);
    const [canReplay, setCanReplay] = useState(false);

    useLayoutEffect(() => {
        if (prefersReducedMotion() || !root.current) return undefined;
        const el = root.current;
        const ctx = gsap.context(() => {
            const query = el.querySelector<HTMLElement>(".specimen-query-text")!;
            const caret = el.querySelector<HTMLElement>(".caret")!;
            const chunks = gsap.utils.toArray<HTMLElement>(".chunk", el);
            const bars = gsap.utils.toArray<HTMLElement>(".chunk-bar span", el);
            const scores = gsap.utils.toArray<HTMLElement>(".chunk-score", el);
            const answer = gsap.utils.toArray<HTMLElement>(".specimen-answer-label, .answer-seg", el);
            const typed = { n: 0 };
            const setFlags = (on: boolean) => chunks.forEach((chunk, index) => {
                chunk.toggleAttribute("data-selected", on && index < TOP_K);
                chunk.toggleAttribute("data-dimmed", on && index >= TOP_K);
            });

            timeline.current = gsap.timeline({ delay: 0.5, defaults: { ease: "power3.out" } })
                .call(() => { setFlags(false); caret.style.display = ""; typed.n = 0; query.textContent = ""; })
                .to(typed, {
                    n: QUERY.length,
                    duration: 1.3,
                    ease: "none",
                    onUpdate: () => { query.textContent = QUERY.slice(0, Math.round(typed.n)); },
                })
                // Explicit start and end values keep replays and double-mounts deterministic.
                .fromTo(chunks, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 }, "+=0.15")
                .fromTo(bars, { scaleX: 0 }, { scaleX: (index: number) => CHUNKS[index].score, duration: 0.7, stagger: 0.08 }, "<0.1")
                .fromTo(scores, { textContent: 0 }, {
                    textContent: (index: number) => CHUNKS[index].score,
                    duration: 0.7,
                    stagger: 0.08,
                    snap: { textContent: 0.01 },
                    modifiers: { textContent: (value: string) => Number(value).toFixed(2) },
                }, "<")
                .call(() => setFlags(true), undefined, "+=0.1")
                .fromTo(answer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.07 }, "+=0.2")
                .call(() => { caret.style.display = "none"; setCanReplay(true); });
        }, el);
        return () => {
            timeline.current = null;
            ctx.revert();
        };
    }, []);

    const replay = () => {
        setActive(null);
        timeline.current?.restart(true);
    };

    return (
        <div ref={root} className="specimen">
            <div className="specimen-bar mono">
                <span>Example retrieval · illustrative</span>
                {canReplay && (
                    <button type="button" className="specimen-replay mono" onClick={replay}>
                        <Icon name="arrow-right-linear" size={14} /> Replay
                    </button>
                )}
            </div>
            <p className="specimen-query">
                <Icon name="magnifer-linear" size={18} />
                <span className="specimen-query-text">{QUERY}</span>
                <span className="caret" aria-hidden="true" style={{ display: "none" }} />
            </p>
            <ol className="specimen-chunks" aria-label={`Retrieved chunks, top ${TOP_K} of ${CHUNKS.length} kept`}>
                {CHUNKS.map((chunk, index) => (
                    <li
                        key={chunk.chunk + chunk.source}
                        className="chunk"
                        data-selected={index < TOP_K || undefined}
                        data-dimmed={index >= TOP_K || undefined}
                        data-cited={active === index || undefined}
                    >
                        <span className="chunk-meta mono">
                            <span>[{index + 1}]</span>
                            <span>{chunk.source} · chunk {chunk.chunk}</span>
                            {index >= TOP_K && <span>below top-k</span>}
                        </span>
                        <span className="chunk-score">{chunk.score.toFixed(2)}</span>
                        <span className="chunk-bar" aria-hidden="true"><span style={{ transform: `scaleX(${chunk.score})` }} /></span>
                        <span className="chunk-text">{chunk.text}</span>
                    </li>
                ))}
            </ol>
            <div className="specimen-answer">
                <span className="specimen-answer-label mono">Generated answer</span>
                <p>
                    {ANSWER.map((segment, index) =>
                        typeof segment === "number" ? (
                            <button
                                key={index}
                                type="button"
                                className="cite answer-seg"
                                aria-label={`Source ${segment + 1}: ${CHUNKS[segment].source}, chunk ${CHUNKS[segment].chunk}`}
                                data-active={active === segment || undefined}
                                onMouseEnter={() => setActive(segment)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(segment)}
                                onBlur={() => setActive(null)}
                            >
                                {segment + 1}
                            </button>
                        ) : (
                            <Fragment key={index}><span className="answer-seg">{segment}</span></Fragment>
                        )
                    )}
                </p>
            </div>
            <div className="specimen-foot mono">
                <span>top_k = {TOP_K} · cosine similarity</span>
                <span>Hover a citation</span>
            </div>
        </div>
    );
}
