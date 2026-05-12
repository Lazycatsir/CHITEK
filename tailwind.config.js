// CHITEK Design System — Tailwind Configuration
// Brand tokens for consistent styling across all pages.
// Usage: PurgeCSS will tree-shake; for CDN, inline via <script> tailwind.config = {...}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {
      colors: {
        // Brand orange palette
        'brand-orange': '#ff6b1a',
        'brand-orange-dark': '#d9550f',
        'brand-orange-light': '#ff8c4a',
        // Subtle orange
        'brand-orange-subtle': 'rgba(255,107,26,0.05)',
        // Dark backgrounds
        'bg-dark': '#07101e',
        'bg-mid': '#0c1a2e',
        // Footer
        'footer-bg': '#0f1923',
        // Text
        'text-dark': '#1a1a1a',
        'text-mid': '#444444',
        'text-muted': '#6b7280',
        // Border
        'border-light': '#e5e7eb',
      },
      fontFamily: {
        'barlow': ['Barlow', 'sans-serif'],
        'barlow-condensed': ['Barlow Condensed', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      maxWidth: {
        'page': '1280px',
      },
      spacing: {
        'nav': '72px',
      },
      zIndex: {
        'nav': '1000',
        'dropdown': '1001',
        'sidebar': '9999',
        'overlay': '999',
      },
    },
  },
  plugins: [],
};
