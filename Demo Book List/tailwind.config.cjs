/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#64748B",
        background: "#F3F4F6",
        text: "#111827",
      },
    },
  },
  plugins: [],
};
