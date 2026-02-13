import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saubh: {
          dark: "#0C0F0A",
          card: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.1)",
          text: "#F0EDE8",
          muted: "#9CA39C",
          green: "#8FD45E",
          "green-dark": "#6DB33F",
          orange: "#F0960E",
          red: "#E8553A",
          yellow: "#F0C808"
        }
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"]
      },
      borderRadius: {
        card: "24px",
        btn: "10px"
      }
    }
  },
  plugins: []
};

export default config;
