"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { getLenis } from "@/lib/motion";

const navLinks = [
    { href: "/what-is-rag", label: "What is RAG?" },
    { href: "/architecture", label: "Architecture" },
    { href: "/evaluation", label: "Evaluation" },
    { href: "/about", label: "About" },
];

export function Wordmark() {
    return <>Rag<span>XGen</span></>;
}

export default function Navigation() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const wasOpen = useRef(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) {
            if (wasOpen.current) toggleRef.current?.focus();
            wasOpen.current = false;
            return undefined;
        }
        wasOpen.current = true;
        const lenis = getLenis();
        lenis?.stop();
        document.body.style.overflow = "hidden";
        menuRef.current?.querySelector<HTMLElement>("a")?.focus();
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key !== "Tab" || !menuRef.current) return;
            const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
            lenis?.start();
        };
    }, [open]);

    const current = (href: string) => (pathname === href ? "page" : undefined);

    return (
        <header className="site-header" data-scrolled={scrolled || undefined}>
            <div className="wrap site-header-inner">
                <Link href="/" className="wordmark" aria-label="RagXGen home"><Wordmark /></Link>
                <nav className="site-nav" aria-label="Primary">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} aria-current={current(link.href)}>{link.label}</Link>
                    ))}
                </nav>
                <Link href="/demo" className="btn btn-ink" aria-current={current("/demo")}>
                    Try the demo <Icon name="arrow-right-linear" size={16} />
                </Link>
                <button
                    ref={toggleRef}
                    type="button"
                    className="menu-toggle"
                    aria-expanded={open}
                    aria-controls="site-menu"
                    onClick={() => setOpen(true)}
                >
                    <span className="mono">Menu</span>
                    <Icon name="hamburger-menu-linear" size={22} />
                </button>
            </div>
            {open && (
                <div id="site-menu" ref={menuRef} className="site-menu" role="dialog" aria-modal="true" aria-label="Site menu">
                    <nav aria-label="Mobile">
                        {[{ href: "/", label: "Home" }, ...navLinks, { href: "/demo", label: "Live demo" }].map((link, index) => (
                            <Link key={link.href} href={link.href} aria-current={current(link.href)} onClick={() => setOpen(false)}>
                                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <button type="button" className="menu-toggle site-menu-close" onClick={() => setOpen(false)}>
                        <span className="mono">Close</span>
                        <Icon name="close-circle-linear" size={22} />
                    </button>
                </div>
            )}
        </header>
    );
}
