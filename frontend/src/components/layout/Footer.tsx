import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Wordmark } from "@/components/layout/Navigation";

const columns = [
    {
        title: "Product",
        links: [
            { label: "Live demo", href: "/demo" },
            { label: "Architecture", href: "/architecture" },
            { label: "Evaluation", href: "/evaluation" },
        ],
    },
    {
        title: "Learn",
        links: [
            { label: "What is RAG?", href: "/what-is-rag" },
            { label: "About the build", href: "/about" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="wrap">
                <div className="footer-grid">
                    <div>
                        <Link href="/" className="wordmark" aria-label="RagXGen home"><Wordmark /></Link>
                        <p className="footer-statement">
                            A hands-on implementation of Retrieval-Augmented Generation, built to explain the pipeline by showing it working.
                        </p>
                    </div>
                    {columns.map((column) => (
                        <div key={column.title} className="footer-col">
                            <h2>{column.title}</h2>
                            <ul>
                                {column.links.map((link) => (
                                    <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="footer-col">
                        <h2>Source</h2>
                        <ul>
                            <li>
                                <a href="https://github.com/pananon/ragxgen" target="_blank" rel="noopener noreferrer" className="text-link">
                                    <Icon name="logos:github-icon" size={14} className="footer-gh" /> GitHub
                                    <span className="sr-only">(opens in a new tab)</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} RagXGen. Built for learning and demonstration.</p>
                    <p>
                        Built by <a href="https://mangalcore.com" target="_blank" rel="noopener noreferrer">Hari Mangal Pandey</a>.
                        Icons: Solar by 480 Design (CC BY 4.0).
                    </p>
                </div>
            </div>
        </footer>
    );
}
