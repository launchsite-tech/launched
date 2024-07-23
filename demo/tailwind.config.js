/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./*.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        text: {
          primary: "#FFFFFF",
          secondary: "#E0EBFF",
        },
        brand: {
          light: "#FF9524",
          mid: "#FF7F24",
          dark: "#FF6924",
        },
        bg: "#2F3C54",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "hover-in-place": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-0.25rem)" },
        },
      },
      animation: {
        "hover-in-place": "hover-in-place 3s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
