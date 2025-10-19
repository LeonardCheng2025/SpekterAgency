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
        // Spekter Games Brand Colors
        bg: "#02070B", // Deep dark blue-black
        fg: "#FFFFFF",
        muted: "#9CA3AF",
        line: "rgba(52, 111, 196, 0.2)", // Using brand blue for lines
        brand: {
          DEFAULT: "#346FC4", // Primary brand blue
          50: "#EBF4FF",
          100: "#D6E8FF",
          200: "#ADD1FF",
          300: "#7BB3FF",
          400: "#4A95FF",
          500: "#346FC4",
          600: "#2A5BA0",
          700: "#1F4477",
          800: "#152D4E",
          900: "#0A1625",
        },
        accent: "#364D8F", // Secondary brand blue
        surface: "rgba(54, 77, 143, 0.8)",
        // Spekter Games specific colors
        'spekter-primary': '#346FC4',
        'spekter-secondary': '#364D8F',
        'spekter-accent': '#3C3267',
        'spekter-dark': '#02070B',
        'spekter-surface': 'rgba(54, 77, 143, 0.6)',
        'spekter-glass': 'rgba(60, 50, 103, 0.4)',
        'spekter-text': '#D1D5DB',
        // Gaming-specific colors with brand integration
        'tier-gold': '#F59E0B',
        'tier-silver': '#9CA3AF',
        'tier-bronze': '#D97706',
        // Additional brand variations
        'brand-purple': '#3C3267',
        'brand-blue': '#364D8F',
        'brand-light': '#346FC4',
      },
      borderRadius: {
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        sm: "0 2px 8px rgba(0,0,0,0.08)",
        'glow-blue': "0 0 20px rgba(52, 111, 196, 0.3)",
        'glow-purple': "0 0 20px rgba(60, 50, 103, 0.3)",
        'glow-brand': "0 0 30px rgba(52, 111, 196, 0.2)",
        'glass': "0 8px 32px rgba(0, 0, 0, 0.37)",
        'spekter-glow': "0 0 40px rgba(52, 111, 196, 0.15)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'spekter-hero': 'linear-gradient(90deg, #1A2333 0%, #0F1419 30%, #02070B 60%, #02070B 100%)',
        'spekter-blue-glow': 'radial-gradient(circle at 20% 50%, rgba(52, 111, 196, 0.3) 0%, transparent 60%)',
        'spekter-purple-glow': 'radial-gradient(circle at 80% 20%, rgba(60, 50, 103, 0.2) 0%, transparent 70%)',
        'spekter-grid': 'linear-gradient(rgba(52, 111, 196, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 111, 196, 0.05) 1px, transparent 1px)',
        'spekter-diagonal': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(52, 111, 196, 0.03) 2px, rgba(52, 111, 196, 0.03) 4px)',
        'spekter-gradient': 'linear-gradient(90deg, #364D8F 0%, #2A3A6B 30%, #1A2333 60%, #02070B 100%)',
        'spekter-main': 'linear-gradient(90deg, #364D8F 0%, #2A3A6B 25%, #1A2333 50%, #0F1419 75%, #02070B 100%)',
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
