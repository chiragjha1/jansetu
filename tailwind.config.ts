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
        gov: {
          blue: "#1e3a8a",
          amber: "#d97706",
          green: "#059669",
          red: "#dc2626",
          surface: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0"
        }
      }
    },
  },
  plugins: [],
};
export default config;
