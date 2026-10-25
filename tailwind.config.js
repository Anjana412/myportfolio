/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
        accent: { DEFAULT: 'var(--accent)', deep: 'var(--accent-deep)' },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(50px)' }, to: { opacity: '1', transform: 'none' } },
        'photo-in': {
          from: { opacity: '0', transform: 'translateX(-50%) translateY(40px)' },
          to: { opacity: '1', transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '70%': { boxShadow: '0 0 0 10px rgba(224,64,200,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(224,64,200,0)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        bob: { '50%': { translate: '0 -6px' } },
        'sk-pop': { from: { opacity: '0', transform: 'translateY(22px) scale(.92)' } },
        'sk-slide': { to: { transform: 'translateX(-33.3333%)' } },
        'deco-float': { '50%': { translate: '0 -.035em' } },
        'lb-fade': { from: { opacity: '0' }, to: { opacity: '1' } },
        'lb-pop': {
          from: { opacity: '0', transform: 'scale(.92) translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'wall-hint': {
        '0%, 100%': { transform: 'translateX(0)', opacity: '.6' },
        '50%': { transform: 'translateX(6px)', opacity: '1' },
      },
      'wall-info': {
        from: { opacity: '0', transform: 'translateY(12px)' },
        to: { opacity: '1', transform: 'none' },
      },
      },
      animation: {
        rise: 'rise .8s cubic-bezier(.2,.8,.2,1) both',
        'photo-in': 'photo-in 1s .1s cubic-bezier(.2,.8,.2,1) both',
        'pulse-ring': 'pulse-ring 2s infinite',
        'spin-slow': 'spin-slow 50s linear infinite',
        bob: 'bob 4s ease-in-out infinite',
        'sk-pop': 'sk-pop .5s cubic-bezier(.2,.9,.3,1.2) backwards',
        'sk-slide': 'sk-slide var(--t,50s) linear infinite',
        'deco-float': 'deco-float 7s ease-in-out infinite',
        'lb-fade': 'lb-fade .25s ease both',
        'lb-pop': 'lb-pop .35s cubic-bezier(.2,.9,.3,1.15) both',
        'wall-hint': 'wall-hint 1.6s ease-in-out infinite',
        'wall-info': 'wall-info .45s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};