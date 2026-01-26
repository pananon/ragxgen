import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "RAG Lab — Retrieval-Augmented Generation Explained",
    description:
        "A hands-on implementation of Retrieval-Augmented Generation. Ask questions, get answers grounded in your data.",
    keywords: [
        "RAG",
        "Retrieval-Augmented Generation",
        "LLM",
        "AI",
        "Machine Learning",
        "Vector Database",
        "FAISS",
        "LangChain",
    ],
    authors: [{ name: "RAG Lab" }],
    openGraph: {
        title: "RAG Lab — Retrieval-Augmented Generation Explained",
        description: "A hands-on implementation of Retrieval-Augmented Generation.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen flex flex-col">
                {/* Animated background */}
                <div className="animated-bg" />

                {/* Navigation */}
                <Navigation />

                {/* Main content */}
                <main className="flex-1 pt-20">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </body>
        </html>
    );
}
