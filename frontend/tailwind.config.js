/** @type {import('tailwindcss').Config} */
// Design tokens live in src/app/globals.css; Tailwind supplies the reset and a utility layer.
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: { extend: {} },
    plugins: [],
};
