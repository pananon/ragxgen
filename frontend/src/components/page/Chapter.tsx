"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import SplitWords from "@/components/ui/SplitWords";
import Icon from "@/components/ui/Icon";
import { useReveal } from "@/lib/motion";

interface ChapterProps {
    id?: string;
    label?: string;
    title?: string;
    note?: ReactNode;
    dark?: boolean;
    className?: string;
    children: ReactNode;
}

// A full-width chapter with a consistent head; its contents reveal on scroll.
export function Chapter({ id, label, title, note, dark, className = "", children }: ChapterProps) {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    const headingId = id ? `${id}-title` : undefined;
    return (
        <section id={id} ref={ref} className={`chapter ${dark ? "chapter-dark" : ""} ${className}`} aria-labelledby={title ? headingId : undefined}>
            <div className="wrap">
                {(label || title) && (
                    <header className="chapter-head">
                        {label && <p className="chapter-label mono" data-reveal>{label}</p>}
                        {title && <SplitWords as="h2" id={headingId} className="chapter-title" text={title} />}
                        {note && <p className="chapter-note" data-reveal>{note}</p>}
                    </header>
                )}
                {children}
            </div>
        </section>
    );
}

interface PageHeadProps {
    label: string;
    title: string[];
    lede: ReactNode;
    meta?: string[];
}

export function PageHead({ label, title, lede, meta }: PageHeadProps) {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    return (
        <header ref={ref} className="page-head">
            <div className="wrap grid-12">
                <p className="chapter-label mono" data-reveal>{label}</p>
                <SplitWords as="h1" className="page-title" lines={title} />
                <p className="page-lede" data-reveal>{lede}</p>
                {meta && (
                    <div className="page-meta mono" data-reveal>
                        {meta.map((item) => <span key={item}>{item}</span>)}
                    </div>
                )}
            </div>
        </header>
    );
}

interface FinalCtaProps {
    label: string;
    title: string;
    text: string;
    href: string;
    action: string;
    secondary?: { href: string; label: string };
}

// The closing chapter: one signal colour, one primary action.
export function FinalCta({ label, title, text, href, action, secondary }: FinalCtaProps) {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    return (
        <section ref={ref} className="final" aria-label={label}>
            <div className="wrap">
                <span className="chapter-label mono" data-reveal>{label}</span>
                <SplitWords as="h2" className="final-title" text={title} />
                <div className="final-row" data-reveal>
                    <p>{text}</p>
                    <div className="hero-ctas">
                        <Link href={href} className="btn btn-ink">{action} <Icon name="arrow-right-linear" size={16} /></Link>
                        {secondary && <Link href={secondary.href} className="btn btn-line">{secondary.label}</Link>}
                    </div>
                </div>
            </div>
        </section>
    );
}
