/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#534AB7",
        "primary-light": "#7F77DD",
        "primary-dark": "#3C3489",
        dark: "#0a0a1a",
        "dark-card": "rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
}