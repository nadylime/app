/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { brandPeach:'#fda085', brandPink:'#f6d365', brandInk:'#1f2937' },
      boxShadow: { soft: '0 10px 25px rgba(0,0,0,0.08)' },
      fontFamily: { sans: ['Inter','system-ui','Arial','sans-serif'] }
    }
  },
  plugins: []
}
