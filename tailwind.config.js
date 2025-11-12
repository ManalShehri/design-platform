/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#00406B",
          800: "#005D45", // Primary 30%
          600: "#1C95D6",
          500: "#46C752", // Secondary 20%
          400: "#02CCDF",
          300: "#9AEC23",
          200: "#FFC629",
        },
        accent: {
          orange: "#DB7432",
          brown: "#873518",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};