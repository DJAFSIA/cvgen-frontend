/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        ink: '#0a2540',        // titres
        body: '#425466',       // texte courant
        muted: '#697386',      // texte secondaire
        line: '#e3e8ee',       // bordures
        surface: '#f6f9fc',    // fonds de section
        brand: {
          DEFAULT: '#635bff',
          dark: '#4f46e5',
          soft: '#efeeff',
        },
        success: { DEFAULT: '#0e6245', soft: '#d7f7c2' },
        warn: { DEFAULT: '#8a5100', soft: '#fff3d6' },
        danger: { DEFAULT: '#b3133a', soft: '#ffe5ea' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,37,64,.06), 0 2px 8px rgba(10,37,64,.04)',
        pop: '0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3)',
      },
      borderRadius: { xl2: '14px' },
    },
  },
  plugins: [],
}
