/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { 
      center: true, 
      padding: "2rem", 
      screens: { 
        xl: "1280px", 
        "2xl": "1440px" 
      } 
    },
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          '"Poppins"',
          '"Roboto"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        bg: "#0D0D0D",
        fg: "#FFFFFF",
        muted: "#9CA3AF",
        line: "rgba(229, 57, 53, 0.2)",
        brand: {
          DEFAULT: "#E53935",
          50: "#FFEBEE",
          100: "#FFCDD2",
          600: "#D32F2F",
          700: "#C62828",
          900: "#B71C1C",
        },
        accent: "#1A1A1A",
        surface: "rgba(26, 26, 26, 0.8)",
        // Official Delabs colors
        'delabs-red': '#E53935',
        'delabs-red-alt': '#FF3B30',
        'delabs-dark': '#0D0D0D',
        'delabs-dark-alt': '#1A1A1A',
        'delabs-surface': 'rgba(26, 26, 26, 0.6)',
        'delabs-glass': 'rgba(26, 26, 26, 0.4)',
        'delabs-text': '#D1D5DB',
        // Gaming-specific colors
        'tier-gold': '#F59E0B',
        'tier-silver': '#9CA3AF',
        'tier-bronze': '#D97706',
      },
      borderRadius: {
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        sm: "0 2px 8px rgba(0,0,0,0.08)",
        'glow-red': "0 0 20px rgba(229, 57, 53, 0.3)",
        'glow-blue': "0 0 30px rgba(37, 99, 235, 0.2)",
        'glass': "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'delabs-hero': 'radial-gradient(circle at 50% 50%, rgba(229, 57, 53, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)',
        'delabs-red-glow': 'radial-gradient(circle at 30% 40%, rgba(229, 57, 53, 0.1) 0%, transparent 70%)',
        'delabs-grid': 'linear-gradient(rgba(229, 57, 53, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 57, 53, 0.05) 1px, transparent 1px)',
        'delabs-diagonal': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(229, 57, 53, 0.03) 2px, rgba(229, 57, 53, 0.03) 4px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      transitionDuration: { 
        fast: "150ms", 
        base: "200ms" 
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
