/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./*.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        salmon: "#FEECE2",
        "salmon-lgt": "#FEF3ED",
        brand: "#309BA0",
        "brand-lgt": "#43CEA2",
        "brand-dark": "#185A9D",
        "gray-border": "#DADCE0",
        "gray-icon": "#AFB1B2",
        // Text colors
        home: "#665E5A",
        "home-lgt": "#B2A8A3",
        editor: "#404040",
        "editor-lgt": "#5F6366",
      },
      keyframes: {
        cta: {
          from: { "-webkit-mask-position": "0 0", "mask-position": "0 0" },
          to: { "-webkit-mask-position": "100% 0", "mask-position": "100% 0" },
        },
        "cta-rev": {
          from: {
            "-webkit-mask-position": "100% 0",
            "mask-position": "100% 0",
          },
          to: { "-webkit-mask-position": "0 0", "mask-position": "0 0" },
        },
        "scroll-left": {
          from: { "background-position": "100% 0" },
          to: { "background-position": "0 0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        cta: "cta 700ms steps(29) forwards",
        "cta-rev": "cta-rev 700ms steps(29) forwards",
        "scroll-left": "scroll-left 500ms linear infinite",
        "fade-in": "fade-in 500ms ease-out forwards",
      },
      boxShadow: {
        default: "0px 2px 4px 2px rgba(60, 64, 67, .149)",
        secondary: "0px 1px 4px 0px rgba(60, 64, 67, .15)",
      },
      fontSize: {
        h1: "3.375rem",
        h2: "2.625rem",
        h3: "1.125rem",
      },
      lineHeight: {
        h1: "64.8px",
        h2: "50.4px",
        h3: "27px",
      },
    },
    fontFamily: {
      display: ["Gilda Display", "serif"],
      logo: ["Cinzel", "serif"],
      script: ["Kaushan Script", "cursive"],
      sans: ["Open Sans", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
