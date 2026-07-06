import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chitek-inno.com',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'es', 'ar', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
