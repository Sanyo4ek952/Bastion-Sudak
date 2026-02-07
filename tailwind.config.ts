import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        header: "hsl(var(--header))",
        gold: "hsl(var(--gold))"
      },
      fontFamily: {
        sans: ["Arial", "system-ui", "sans-serif"],
        display: ["\"Century Gothic\"", "\"Trebuchet MS\"", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
