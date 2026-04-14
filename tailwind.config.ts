import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eceef2",
          200: "#d7dbe3",
          500: "#697386",
          700: "#2f3642",
          900: "#131722"
        },
        accent: {
          500: "#2f3642",
          600: "#131722"
        }
      },
      boxShadow: {
        soft: "0 18px 42px -24px rgba(17, 24, 39, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
