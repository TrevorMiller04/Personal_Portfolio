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
        primary: '#0077B6',
        accent: '#C13F03',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}