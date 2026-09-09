/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // World-Class Non-Blue Design Tokens (Linear/Vercel Obsidian Onyx + Cyber Emerald + Cosmic Violet + Sunset Coral)
        palette: {
          obsidian: '#08090C',  // Pure Deep Velvet Obsidian Noir (100% Zero-Blue)
          surface: '#12131C',   // Glassmorphic Card Surface
          elevated: '#1A1B26',  // Elevated Focus Surface
          border: 'rgba(255, 255, 255, 0.12)', // Subtle Micro-Borders
          emerald: '#10B981',   // Cyber Emerald / Mint (Vision & Telemetry)
          violet: '#8B5CF6',    // Cosmic Royal Violet (AI & Foundation Models)
          coral: '#F43F5E',     // Sunset Coral (Change Detection & Alerts)
          amber: '#F59E0B',     // Golden Amber (Metrics & Benchmarks)
          white: '#FFFFFF',     // Pure Crisp White (18.8:1 Contrast)
          silver: '#94A3B8',    // Platinum Silver Text
        },
        'space-navy': {
          bg: '#08090C',
          surface: '#12131C',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        accent: {
          primary: '#8B5CF6',
          secondary: '#10B981',
          spatial: '#F43F5E',
          amber: '#F59E0B',
        },
        neon: {
          cyan: '#10B981',
          teal: '#10B981',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#8B5CF6'
        },
        space: {
          950: '#050508',
          900: '#08090C',
          850: '#12131C',
          800: '#1A1B26',
          700: '#232433',
          border: 'rgba(255, 255, 255, 0.12)',
          card: 'rgba(18, 19, 28, 0.88)',
          glass: 'rgba(8, 9, 12, 0.92)'
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
