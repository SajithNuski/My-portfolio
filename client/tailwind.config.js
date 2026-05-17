export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0d1117",
        overlay: "#161b22",
        subtle: "#21262d",
        elevated: "#30363d",
        accent: "#3fb950",
        "accent-hover": "#2ea043",
        "accent-dim": "rgba(63, 185, 80, 0.15)",
        blue: "#58a6ff",
        "blue-dim": "rgba(88, 166, 255, 0.12)",
        border: "#30363d",
        "border-muted": "#21262d",
        "text-primary": "#e6edf3",
        "text-secondary": "#8b949e",
        "text-muted": "#484f58",
      },
      fontFamily: {
        head: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
