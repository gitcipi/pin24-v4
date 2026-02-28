/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)", 
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        serif: ['"Cormorant Garamond"', "serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: {
        '2rem': '2rem',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
        '4rem': '4rem',
      }
    },
  },
  plugins: [],
}
