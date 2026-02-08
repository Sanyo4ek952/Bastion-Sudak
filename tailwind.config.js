/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sand-50": "#F7F4EF",
        "sand-100": "#EFE9DF",
        "stone-600": "#6B6258",
        "stone-900": "#2B2A28",
        "sea-500": "#5FA8A3",
        "sea-600": "#4C918C",
        "gold-500": "#C6A15B",
        "gold-soft": "#E9D9B6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        heading: ["var(--font-manrope)", "Manrope", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
