import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        "bg-color": "var(--bg-color)",
        "text-color": "var(--text-color)",
        "text-muted": "var(--text-muted)",
        "sidebar-bg": "var(--sidebar-bg)",
        "slim-sidebar-bg": "var(--slim-sidebar-bg)",
        "chat-bg": "var(--chat-bg)",
        "bubble-me": "var(--bubble-me)",
        "bubble-other": "var(--bubble-other)",
        "text-color-me": "var(--text-color-me)",
        "border-color": "var(--border-color)",
        "primary-color": "var(--primary-color)",
        "active-chat-bg": "var(--active-chat-bg)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      spacing: {
        "70px": "70px",
      },
    },
  },
  plugins: [],
};

export default config;
