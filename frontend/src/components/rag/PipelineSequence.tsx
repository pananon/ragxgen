"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis, prefersReducedMotion } from "@/lib/motion";

export interface PipelineStepData {
    title: string;
    description: string;
    details: string[];
}

// Scroll distance per step, as a share of the viewport height.
const STEP_SVH = 70;

// A pinned chapter: the stage sticks while scrolling advances through the steps.
// The rail doubles as navigation, so every step is reachable without scrolling.
export default function PipelineSequence({ steps }: { steps: PipelineStepData[] }) {
    const section = useRef<HTMLElement>(null);
    const progressBar = useRef<HTMLDivElement>(null);
    const rail = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);

    const stepLength = () => {
        const el = section.current!;
        return (el.offsetHeight - (el.firstElementChild as HTMLElement).offsetHeight) / steps.length;
    };

    useEffect(() => {
        let frame = 0;
        const update = () => {
            const el = section.current;
            if (!el) return;
            const progress = Math.max(0, Math.min(steps.length - 0.001, -el.getBoundingClientRect().top / stepLength()));
            setActive(Math.floor(progress));
            progressBar.current?.style.setProperty("--p", String(progress / steps.length));
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
        // stepLength reads the DOM each call, so it does not need to be a dependency.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps.length]);

    // On narrow screens the rail scrolls sideways; keep the active step in view without moving the page.
    useEffect(() => {
        const el = rail.current;
        const button = el?.children[active] as HTMLElement | undefined;
        if (!el || !button || el.scrollWidth <= el.clientWidth) return;
        el.scrollTo({ left: button.offsetLeft - 16, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }, [active]);

    const goTo = (index: number) => {
        const el = section.current!;
        const top = window.scrollY + el.getBoundingClientRect().top + index * stepLength() + 1;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(top, { duration: 0.8 });
        else window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };

    return (
        <section
            ref={section}
            className="chapter-dark pipeline-pin"
            aria-labelledby="pipeline-title"
            style={{ height: `calc(${steps.length * STEP_SVH}svh + 100svh)` }}
        >
            <div className="wrap pipeline-stage" style={{ position: "sticky", top: 0 }}>
                <header style={{ gridColumn: "1 / -1" }}>
                    <p className="chapter-label mono">03 — Step by step</p>
                    <h2 id="pipeline-title" className="sr-only">The RAG pipeline, step by step</h2>
                </header>
                <nav ref={rail} className="pipeline-rail" aria-label="Pipeline steps">
                    {steps.map((step, index) => (
                        <button
                            key={step.title}
                            type="button"
                            aria-current={index === active ? "step" : undefined}
                            onClick={() => goTo(index)}
                        >
                            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                            {step.title}
                        </button>
                    ))}
                </nav>
                <div className="pipeline-panel">
                    {steps.map((step, index) => (
                        <article key={step.title} className="pipeline-step" hidden={index !== active} aria-live="off">
                            <span className="pipeline-step-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            <ul>{step.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                        </article>
                    ))}
                </div>
                <div ref={progressBar} className="pipeline-progress" aria-hidden="true"><span /></div>
            </div>
        </section>
    );
}
