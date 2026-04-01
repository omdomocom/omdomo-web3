import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0c0906",
        surface: "#140f0a",
        border: "#2a1f14",
        cream: {
          DEFAULT: "#f5f0e8",
          "2": "#ede8df",
          text: "#1a1510",
          muted: "#6b6057",
        },
        accent: {
          purple: "#7c3aed",
          cyan: "#0891b2",
          pink: "#ec4899",
          gold: "#c9973a",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
