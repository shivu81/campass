export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0f1419",
        panel: "#161b22",
        panelSoft: "#1e2631",
        ink: "#e8edf2",
        muted: "#9aa7b6",
        accent: "#24c08b",
        accentBlue: "#4da3ff",
        warning: "#f4b740"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(36, 192, 139, 0.14)"
      }
    }
  },
  plugins: []
};
