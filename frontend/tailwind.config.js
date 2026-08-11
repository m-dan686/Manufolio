/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                orange: 'var(--orange)',
                green: 'var(--green)',
                'brand-green': 'var(--green)',
                'text-dim': 'var(--text-muted)',
                dark: 'var(--bg-dark)',
                light: 'var(--bg-light)',
                'bg-dark': 'var(--bg-dark)', // Ensure this exists if used directly
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}
