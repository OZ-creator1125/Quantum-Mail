import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./client/src/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        display: [
          "Orbitron",
          "Rajdhani",
          "system-ui",
          "sans-serif"
        ],
        ui: [
          "Rajdhani",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },

  plugins: []
} satisfies Config;
