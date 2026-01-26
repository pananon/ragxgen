"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/what-is-rag", label: "What is RAG?" },
    { href: "/architecture", label: "Architecture" },
    { href: "/demo", label: "Live Demo" },
    { href: "/evaluation", label: "Evaluation" },
    { href: "/about", label: "About" },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border"
                    : "bg-transparent"
            )}
        >
            <nav className="section-container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">
                            RAG <span className="text-primary">Lab</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    pathname === link.href
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Demo CTA Button */}
                    <div className="hidden md:block">
                        <Link
                            href="/demo"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Try Demo
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-background-tertiary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
                    >
                        <div className="section-container py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                        pathname === link.href
                                            ? "text-primary bg-primary/10"
                                            : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/demo"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn-primary w-full text-center mt-4 block"
                            >
                                Try Demo
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
