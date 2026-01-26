import Link from "next/link";
import { Github, Twitter, Linkedin, Sparkles } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Live Demo", href: "/demo" },
        { label: "Architecture", href: "/architecture" },
        { label: "Evaluation", href: "/evaluation" },
    ],
    learn: [
        { label: "What is RAG?", href: "/what-is-rag" },
        { label: "About", href: "/about" },
    ],
    resources: [
        { label: "GitHub", href: "https://github.com" },
        { label: "Documentation", href: "/docs" },
    ],
};

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background-secondary/50">
            <div className="section-container py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">
                                RAG <span className="text-primary">Lab</span>
                            </span>
                        </Link>
                        <p className="text-foreground-muted text-sm leading-relaxed">
                            A hands-on implementation of Retrieval-Augmented Generation.
                            Built to educate and demonstrate real RAG pipelines.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground-muted hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Learn Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Learn</h4>
                        <ul className="space-y-3">
                            {footerLinks.learn.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground-muted hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground-muted hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-foreground-muted text-sm">
                        © {new Date().getFullYear()} RAG Lab. Built for learning and demonstration.
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-foreground transition-all"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-foreground transition-all"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-foreground transition-all"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
