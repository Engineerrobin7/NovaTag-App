/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066cc",
        background: "#ffffff",
        parchment: "#f5f5f7",
        darkSurface: "#272729",
        black: "#000000",
        textPrimary: "#1d1d1f",
        textSecondary: "#7a7a7a",
      },
      fontFamily: {
        sfProDisplay: ["SF-Pro-Display-Semibold"],
        sfProText: ["SF-Pro-Text-Regular"],
      },
    },
  },
  plugins: [],
};
