/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                emerald: {
                    DEFAULT: 'hsl(134, 61%, 41%)',
                    dark: 'hsl(134, 61%, 31%)',
                    light: 'hsl(134, 61%, 51%)',
                },
                gold: {
                    DEFAULT: 'hsl(45, 100%, 51%)',
                    dark: 'hsl(45, 100%, 41%)',
                },
                cream: 'hsl(45, 29%, 97%)',
                navy: 'hsl(210, 100%, 15%)',
            },
            fontFamily: {
                arabic: ['Traditional Arabic', 'Amiri', 'Scheherazade New', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(20, 83, 45, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(20, 83, 45, 0.6)' },
                },
            },
        },
    },
    plugins: [],
}
