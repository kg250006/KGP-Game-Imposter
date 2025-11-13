/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neo-Afro Modern (default theme)
        ink: '#0B0B0C',
        palm: '#0F3D2E',
        jollof: '#E24E1B',
        gold: '#F2B705',
        kente: '#D91E36',
        cream: '#FAF4E6',
        tealA: '#12A594',
        // Additional theme colors will be CSS variables
      },
      borderRadius: {
        xl2: '10px', // Modernized from 16px to 10px
        modern: '8px',
      },
      scale: {
        102: '1.02',
        98: '0.98',
      },
      boxShadow: {
        lift: '0 8px 20px rgba(0,0,0,.35)',
        glowGold: '0 0 0 3px rgba(242,183,5,.25)',
      },
      transitionDuration: {
        fast: '150ms',
        smooth: '200ms',
      },
      backgroundImage: {
        'hero-afro':
          'radial-gradient(1200px 600px at 20% -10%, rgba(242,183,5,.18), transparent), radial-gradient(900px 500px at 90% 10%, rgba(233,78,27,.16), transparent), linear-gradient(180deg, #0B0B0C 0%, #0B0B0C 100%)',
      },
    },
  },
  plugins: [],
};
