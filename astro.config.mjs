import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// sitemap 由 `node _gen_sitemap.mjs` 生成到 public/sitemap.xml（2026-10-26 起不再用 @astrojs/sitemap，
// 避免构建时另出一份 sitemap-index.xml 与手工版并存）。新增页面后记得重跑该脚本。

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
