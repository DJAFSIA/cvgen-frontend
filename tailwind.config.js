/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // SF Pro sur les appareils Apple, Inter (sa plus proche cousine) ailleurs
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        ink: '#1d1d1f',        // titres (noir Apple)
        body: '#424245',       // texte courant
        muted: '#6e6e73',      // texte secondaire
        line: '#d2d2d7',       // bordures
        surface: '#f5f5f7',    // fonds de section (gris Apple)
        brand: {
          DEFAULT: '#0071e3',  // bleu Apple
          dark: '#0077ed',
          soft: '#e8f1fc',
          link: '#2997ff',     // liens sur fond noir
        },
        success: { DEFAULT: '#0e6245', soft: '#d7f7c2' },
        warn: { DEFAULT: '#8a5100', soft: '#fff3d6' },
        danger: { DEFAULT: '#b3133a', soft: '#ffe5ea' },
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,.05)',
        pop: '0 20px 50px -12px rgba(0,0,0,.22)',
        window: '0 40px 100px -20px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.06)',
      },
      borderRadius: { xl2: '18px', bento: '28px' },
    },
  },
  plugins: [],
}
