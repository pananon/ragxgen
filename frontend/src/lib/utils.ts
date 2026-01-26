import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
    return `${(score * 100).toFixed(1)}%`;
}

export function getScoreColor(score: number): string {
    if (score >= 0.7) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (score >= 0.4) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
}
