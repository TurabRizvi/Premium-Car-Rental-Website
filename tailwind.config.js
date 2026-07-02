/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'rgb(var(--color-ink-950) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          800: 'rgb(var(--color-ink-800) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
        },
        champagne: {
          DEFAULT: 'rgb(var(--color-champagne) / <alpha-value>)',
          light: 'rgb(var(--color-champagne-light) / <alpha-value>)',
          dark: 'rgb(var(--color-champagne-dark) / <alpha-value>)',
        },
        ivory: 'rgb(var(--color-ivory) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(201,161,90,0.35)',
      },
    },
  },
  plugins: [],
}