/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'vox-red': '#E60012',
                'vox-black': '#1A1A1A',
            },
            fontFamily: {
                serif: ['Georgia', 'serif'],
                sans: ['system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};