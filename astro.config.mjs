import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chitek-inno.com',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'es', 'ar', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      serialize(entry) {
        const url = new URL(entry.url);
        const match = url.pathname.match(/^\/(en|es|ar|pt)(\/|$)/);
        if (match) {
          const lang = match[1];
          const cleanPath = url.pathname.slice(match[0].length - 1) || '/';
          entry.url = `https://${lang}.chitek-inno.com${cleanPath}`;
        }
        return entry;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
