import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
    return `${(score * 100).toFixed(1)}%`;
}

export function getScoreLevel(score: number): "high" | "medium" | "low" {
    if (score >= 0.7) return "high";
    if (score >= 0.4) return "medium";
    return "low";
}
