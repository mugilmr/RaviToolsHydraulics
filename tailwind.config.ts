import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        steel: {
          50: "#eef4f8",
          100: "#d6e6ef",
          200: "#adc9dd",
          300: "#83abca",
          400: "#5c8fb8",
          500: "#3d729d",
          600: "#2f5c81",
          700: "#284a65",
          800: "#1f3a4f",
          900: "#152736",
        },
        safety: {
          50: "#fff3ea",
          100: "#ffe1c7",
          200: "#ffbe85",
          300: "#ff9a42",
          400: "#ff7f14",
          500: "#f76a00",
          600: "#d65900",
          700: "#a84500",
          800: "#7a3200",
          900: "#4d1f00",
        },
        charcoal: {
          50: "#f4f5f6",
          100: "#e5e7e9",
          200: "#c7cbcf",
          300: "#a2a8ae",
          400: "#767e86",
          500: "#5a626a",
          600: "#454c53",
          700: "#333940",
          800: "#22262b",
          900: "#15171a",
        },
      },
      fontFamily: {
        heading: ["var(--font-oswald)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,23,26,0.06), 0 1px 12px rgba(21,23,26,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
