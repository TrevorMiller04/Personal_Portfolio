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
        // Syracuse University Official Colors
        'syracuse-orange': '#C13F03',
        'syracuse-blue': '#051C3D',
        // Alias for consistency
        primary: '#051C3D',
        accent: '#C13F03',
        // Extended palette for UI elements
        orange: {
          600: '#C13F03',
          700: '#A13302',
        },
        blue: {
          900: '#051C3D',
          800: '#0A2345',
        }
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}