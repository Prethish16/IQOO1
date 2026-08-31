/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], mono: ['JetBrains Mono','monospace'] },
      colors: {
        brand: { 50:'#f0fdfa',100:'#ccfbf1',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a',950:'#042f2e' },
        ink: '#0f172a',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15,118,110,0.08)',
        card: '0 10px 40px rgba(2,6,23,0.12)',
        glow: '0 0 40px rgba(16,185,129,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [],
}
