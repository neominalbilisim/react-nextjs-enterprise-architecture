import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0F1923",
        card: "#1A2E3F",
        card2: "#1E2D40",
        cyan: "#00B4D8",
        yellow: "#FFD166",
        text: "#E8F4FD",
        muted: "#8BAAB8",
      },
    },
  },
  plugins: [],
};

export default config;
