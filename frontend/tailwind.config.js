/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#14161B",
          900: "#1B1E24",
          800: "#23262E",
          700: "#2E323C",
          600: "#3B404C",
        },
        ink: {
          100: "#F3F4F6",
          300: "#C7CAD1",
          500: "#8A8F9B",
        },
        signal: {
          DEFAULT: "#FF8A33",
          dim: "#B85F1E",
          tint: "#FFE3CC",
        },
        teal: {
          DEFAULT: "#3E8E8A",
        },
        steel: {
          DEFAULT: "#5B7B9A",
        },
        ok: "#4CAF6D",
        warn: "#E5B84C",
        danger: "#E5484D",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
