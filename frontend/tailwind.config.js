/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Custom dark theme colors
                background: {
                    DEFAULT: "#0a0a0f",
                    secondary: "#12121a",
                    tertiary: "#1a1a25",
                },
                foreground: {
                    DEFAULT: "#fafafa",
                    muted: "#a1a1aa",
                },
                primary: {
                    DEFAULT: "#6366f1",
                    hover: "#818cf8",
                    muted: "#4f46e5",
                },
                accent: {
                    cyan: "#22d3ee",
                    purple: "#a855f7",
                    pink: "#ec4899",
                    green: "#10b981",
                },
                border: {
                    DEFAULT: "#27272a",
                    hover: "#3f3f46",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-down": "slideDown 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "float": "float 6s ease-in-out infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                glow: {
                    "0%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" },
                    "100%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)" },
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
        },
    },
    plugins: [],
};
