import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0f6e56',
          accent: '#1D9E75',
          dark: '#04342C',
        },
        surface: {
          0: '#0a0f0d',
          1: '#111916',
          2: '#1a2420',
        },
        spend: '#E24B4A',
        savings: '#639922',
        caution: '#BA7517',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
