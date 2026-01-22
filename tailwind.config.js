/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#ffb7b2',
          purple: '#b28dff',
          blue: '#a2d2ff',
          green: '#b2e2f2',
          yellow: '#fdfd96',
        }
      },
      animation: {
        highlight: 'highlight 1.5s ease-out forwards',
      },
      keyframes: {
        highlight: {
          '0%': { backgroundColor: 'rgba(253, 253, 150, 0.2)' },
          '100%': { backgroundColor: 'transparent' },
        }
      }
    },
  },
  plugins: [],
}
