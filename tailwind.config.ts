import type { Config } from "tailwindcss";

/**
 * copr design tokens — "Apple meets glass, in blue"
 * Tailwind v4 also loads these via @theme in globals.css;
 * keep this file as the single source of truth for token names/values.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1A3F",
          50: "#E8EEF9",
          100: "#C5D2EC",
          200: "#8FA6D4",
          300: "#5A7ABC",
          400: "#2E4F8F",
          500: "#0A1A3F",
          600: "#081534",
          700: "#061029",
          800: "#040B1F",
          900: "#020614",
        },
        primary: {
          DEFAULT: "#1E5EFF",
          50: "#EBF1FF",
          100: "#D6E3FF",
          200: "#ADC7FF",
          300: "#85ABFF",
          400: "#5C8FFF",
          500: "#1E5EFF",
          600: "#0047E6",
          700: "#0038B4",
          800: "#002982",
          900: "#001A51",
        },
        sky: {
          DEFAULT: "#7FB2FF",
          soft: "#A8CBFF",
          muted: "#C9DEFF",
        },
        ice: {
          DEFAULT: "#F5F8FF",
          50: "#FFFFFF",
          100: "#F5F8FF",
          200: "#E8EEF9",
          300: "#D6E3FF",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.6)",
          lightStrong: "rgba(255, 255, 255, 0.75)",
          dark: "rgba(10, 26, 63, 0.55)",
          darkStrong: "rgba(10, 26, 63, 0.75)",
          border: "rgba(255, 255, 255, 0.2)",
          borderDark: "rgba(127, 178, 255, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glass:
          "0 4px 24px -4px rgba(10, 26, 63, 0.08), 0 1px 2px rgba(10, 26, 63, 0.04)",
        "glass-lg":
          "0 12px 40px -8px rgba(10, 26, 63, 0.12), 0 4px 12px rgba(10, 26, 63, 0.06)",
        "glass-dark":
          "0 4px 24px -4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)",
        lift: "0 16px 40px -12px rgba(30, 94, 255, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "24px",
      },
      transitionDuration: {
        glass: "250ms",
      },
      transitionTimingFunction: {
        glass: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.25s ease-out forwards",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
