/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // biru modern
        secondary: "#1e293b", // abu tua
        accent: "#38bdf8", // biru terang
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
