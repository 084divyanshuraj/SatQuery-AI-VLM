/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Space-Navy Theme (SatQuery AI - SIH PS-26167)
        'space-navy': {
          bg: '#020617',         // Primary background (Deep space navy for high image contrast)
          surface: '#0f172a',    // Secondary surface panels
          border: '#1e293b',     // Micro-borders for crisp lines
        },
        accent: {
          primary: '#10b981',    // Emerald Green for active statuses
          secondary: '#0d9488',  // Ocean Teal for focus states
          spatial: '#f59e0b',    // Saffron / Amber for active segmentation masks & bounding boxes
        },
        // Extended tactical palette
        neon: {
          cyan: '#00f0ff',
          teal: '#0d9488',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#9d4edd'
        },
        space: {
          950: '#020617',
          900: '#0f172a',
          850: '#131f37',
          800: '#1e293b',
          700: '#334155',
          border: '#1e293b',
          card: 'rgba(15, 23, 42, 0.85)',
          glass: 'rgba(2, 6, 23, 0.9)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-teal': '0 0 20px rgba(13, 148, 136, 0.35)',
        'glow-spatial': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
