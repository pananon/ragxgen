"use client";

import { useLayoutEffect, useSyncExternalStore, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Closest GSAP ease to cubic-bezier(.22,.61,.36,1), the site's entrance curve.
export const EASE = "power3.out";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;

const subscribeReduced = (callback: () => void) => {
    const query = window.matchMedia(REDUCED_QUERY);
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
};

export const useReducedMotion = () =>
    useSyncExternalStore(subscribeReduced, prefersReducedMotion, () => false);

// Lenis is the only smooth-scroll engine; SmoothScroll registers the live instance here.
let lenisInstance: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => {
    lenisInstance = instance;
};
export const getLenis = () => lenisInstance;

// Section choreography: headings rise word by word, supporting blocks follow.
// Markup is complete and visible; GSAP only applies start states when motion is allowed.
export function useReveal(ref: RefObject<HTMLElement>) {
    useLayoutEffect(() => {
        if (prefersReducedMotion() || !ref.current) return undefined;
        const root = ref.current;
        const ctx = gsap.context(() => {
            root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
                gsap.from(el.querySelectorAll(".split-inner"), {
                    yPercent: 110,
                    duration: 0.76,
                    ease: EASE,
                    stagger: 0.055,
                    scrollTrigger: { trigger: el, start: "top 88%", once: true },
                });
            });
            root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
                gsap.from(el, {
                    y: 22,
                    autoAlpha: 0,
                    duration: 0.6,
                    ease: EASE,
                    delay: 0.1,
                    scrollTrigger: { trigger: el, start: "top 90%", once: true },
                });
            });
            root.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((el) => {
                gsap.from(el.children, {
                    y: 18,
                    autoAlpha: 0,
                    duration: 0.56,
                    ease: EASE,
                    stagger: 0.06,
                    scrollTrigger: { trigger: el, start: "top 90%", once: true },
                });
            });
        }, root);
        return () => ctx.revert();
    }, [ref]);
}
