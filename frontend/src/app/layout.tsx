import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";

const display = Schibsted_Grotesk({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap", adjustFontFallback: false });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
    title: "RagXGen — Retrieval-Augmented Generation, built in the open",
    description:
        "A working RAG system: upload a document, ask a question, and see which passages were retrieved, how closely they matched, and where each answer came from.",
    keywords: ["RAG", "Retrieval-Augmented Generation", "LLM", "Vector Database", "FAISS", "LangChain", "FastAPI", "Next.js"],
    authors: [{ name: "Hari Mangal Pandey", url: "https://mangalcore.com" }],
    openGraph: {
        title: "RagXGen — Retrieval-Augmented Generation, built in the open",
        description: "Answers you can trace back to the page. A working RAG pipeline with visible retrieval and sources.",
        type: "website",
    },
};

export const viewport: Viewport = { themeColor: "#f2efe6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
            <body>
                <a className="skip-link" href="#content">Skip to content</a>
                <SmoothScroll />
                <Navigation />
                <main id="content" className="page">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
