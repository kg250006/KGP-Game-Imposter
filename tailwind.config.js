/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // EXISTING (Neo-Afro Modern) - Keep for backward compatibility
        ink: '#0B0B0C',
        palm: '#0F3D2E',
        jollof: '#E24E1B',
        gold: '#F2B705',
        kente: '#D91E36',
        cream: '#FAF4E6',
        tealA: '#12A594',

        // NEW (HUEMINT) - Add alongside existing
        navyDark: 'var(--color-navy-dark)',
        purpleDeep: 'var(--color-purple-deep)',
        limeBright: 'var(--color-lime-bright)',
        blueSoft: 'var(--color-blue-soft)',
        grayMedium: 'var(--color-gray-medium)',
        grayLight: 'var(--color-gray-light)',

        // Semantic tokens (will map to active theme)
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        textColor: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)',
        border: 'var(--color-border)',

        // Semantic text-on-* utilities for WCAG AAA compliance
        textOnPrimary: 'var(--color-text-on-primary)',
        textOnSecondary: 'var(--color-text-on-secondary)',
        textOnSurface: 'var(--color-text-on-surface)',
        textOnBackground: 'var(--color-text-on-background)',
        textOnDanger: 'var(--color-text-on-danger)',

        // State colors
        success: 'var(--color-success)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',      // Subtle corners
        md: '6px',      // Default for most components
        lg: '8px',      // Large containers (modals, major sections)
        full: '9999px', // Pills, avatars, circular elements
      },
      scale: {
        102: '1.02',
        98: '0.98',
      },
      boxShadow: {
        // Existing shadows
        lift: '0 8px 20px rgba(0,0,0,.35)',
        glowGold: '0 0 0 3px rgba(242,183,5,.25)',

        // NEW HUEMINT shadows
        glowLime: 'var(--shadow-glow-lime)',
        glowPurple: 'var(--shadow-glow-purple)',
      },
      transitionDuration: {
        fast: '150ms',
        smooth: '200ms',
        normal: '250ms',
      },
      backgroundImage: {
        'hero-afro':
          'radial-gradient(1200px 600px at 20% -10%, rgba(242,183,5,.18), transparent), radial-gradient(900px 500px at 90% 10%, rgba(233,78,27,.16), transparent), linear-gradient(180deg, #0B0B0C 0%, #0B0B0C 100%)',
      },
    },
  },
  plugins: [],
};
