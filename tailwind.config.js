/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        'v2-head': ['Oswald', 'Archivo Black', 'sans-serif'],
        'v2-sub': ['Rajdhani', 'Oswald', 'sans-serif'],
        'v2-body': ['Inter', 'sans-serif'],
        'v2-mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border:  'hsl(var(--border))',
        input:   'hsl(var(--input))',
        ring:    'hsl(var(--ring))',

        /* V2 design-system palette (Home v2 pilot) */
        v2: {
          bg: '#0A0A0A',
          surface: '#121212',
          border: '#1E252D',
          fuel: '#FF6600',
          cobalt: '#4A6FA3',
          success: '#10B981',
          warning: '#EF4444',
          text: '#FFFFFF',
          'text-2': '#AEB7C0',
          'text-3': '#6B7480',
        },

        /* Carbon scale */
        'carbon-900': 'var(--carbon-900)',
        'carbon-800': 'var(--carbon-800)',
        'carbon-700': 'var(--carbon-700)',
        'carbon-600': 'var(--carbon-600)',
        'carbon-500': 'var(--carbon-500)',
        'carbon-400': 'var(--carbon-400)',
        'carbon-300': 'var(--carbon-300)',
        'carbon-200': 'var(--carbon-200)',

        /* Fuel Orange scale */
        'fuel-100': 'var(--fuel-100)',
        'fuel-200': 'var(--fuel-200)',
        'fuel-300': 'var(--fuel-300)',
        'fuel-400': 'var(--fuel-400)',
        'fuel-500': 'var(--fuel-500)',
        'fuel-600': 'var(--fuel-600)',
        'fuel-700': 'var(--fuel-700)',

        /* Text tokens */
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted-lhs': 'var(--text-muted)',
        'text-disabled':  'var(--text-disabled)',

        /* Legacy tokens */
        'fuel-orange': 'hsl(var(--fuel-orange))',
        'carbon':      'hsl(var(--carbon))',
        'sunrise':     'hsl(var(--sunrise))',
        'lhs-green':   'hsl(var(--lhs-green))',
        'steel-blue':  'hsl(var(--steel-blue))',
        'lhs-red':     'hsl(var(--lhs-red))',
        'onehome-bg':  'hsl(var(--onehome-bg))',
        'onehome-accent': 'hsl(var(--onehome-accent))',

        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        'fuel-glow': '0 4px 20px rgba(204, 91, 48, 0.4), 0 1px 3px rgba(0,0,0,0.3)',
        'fuel-glow-lg': '0 6px 28px rgba(204, 91, 48, 0.55), 0 2px 6px rgba(0,0,0,0.4)',
        'card-dark': '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        'nav-dark': '0 2px 12px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'progress-pulse': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'chrome-sweep': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.3s ease',
        'progress-pulse': 'progress-pulse 1.5s ease-in-out infinite',
        'chrome-sweep': 'chrome-sweep 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    'text-lhs-green', 'bg-lhs-green', 'border-lhs-green',
    'text-fuel-orange', 'bg-fuel-orange', 'border-fuel-orange',
    'text-fuel-500', 'bg-fuel-500', 'bg-fuel-300',
    'carbon-texture', 'chrome-border', 'chrome-divider', 'chrome-shine',
    'btn-primary', 'btn-secondary', 'btn-ghost',
    'badge-success', 'badge-warning', 'badge-danger', 'badge-info', 'badge-lhs',
    'fade-up', 'progress-bar', 'progress-fill',
  ],
}