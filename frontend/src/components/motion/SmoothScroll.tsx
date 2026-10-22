"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, setLenis, getLenis } from "@/lib/motion";

// Initialises Lenis once for the app, drives it from GSAP's ticker so ScrollTrigger stays in
// sync, and resets scroll on route changes. Skipped entirely under reduced motion.
export default function SmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        if (prefersReducedMotion()) return undefined;
        const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
        setLenis(lenis);
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener("load", refresh);
        return () => {
            window.removeEventListener("load", refresh);
            gsap.ticker.remove(tick);
            lenis.destroy();
            setLenis(null);
        };
    }, []);

    useEffect(() => {
        getLenis()?.scrollTo(0, { immediate: true, force: true });
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    return null;
}
