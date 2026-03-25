import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF", // Blue
        "primary-hover": "#005bb5",
        accent: "#FFB6C1", // Baby Pink
        "accent-hover": "#ff9eb0",
        surface: "#1A1A1A", // Satyam77 Surface
        background: "#0D0D0D", // Deep Black
        border: "#2A2A2A",
        "text-muted": "#888888",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
