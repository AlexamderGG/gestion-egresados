// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F3B5C", // azul institucional
          foreground: "#FFFFFF",
          50: "#E6F0F5",
          100: "#CCE1EB",
          900: "#0A2A40",
        },
        secondary: {
          DEFAULT: "#F97316", // naranja para acentos
          foreground: "#FFFFFF",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        // ... más colores
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'dropdown': '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config