import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editable via /admin/settings (site_theme table) — see globals.css
        // for the default CSS variable values and app/layout.tsx for how
        // the admin's saved values get injected at runtime.
        obsidian: "var(--color-bg)",       // near-black background, cooler than pure black
        glacier: "var(--color-accent)",    // mountain blue, primary accent
        "glacier-light": "var(--color-accent-light)",
        // Not editable — secondary surface/text tones, tuned to work
        // alongside the default dark background.
        ash: "#15181D",        // dark gray surface
        graphite: "#1F242B",   // elevated dark surface / cards
        stone: "#4A5560",      // secondary text on light
        mist: "#8B96A1",       // muted text on dark
        snow: "#F6F8FA",       // off-white background
        frost: "#EDF1F4",      // subtle panel on white
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      backgroundImage: {
        "vignette": "radial-gradient(ellipse at center, transparent 40%, rgba(10,12,15,0.75) 100%)",
      },
      keyframes: {
        dash: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        pulseline: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        dash: "dash 2.4s ease-out forwards",
        pulseline: "pulseline 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
