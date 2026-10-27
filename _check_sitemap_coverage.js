const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const items = JSON.parse(fs.readFileSync('_sitemap_urls.json', 'utf8'));
  const known = new Set(items.map(i => i.devPath));
  const norm = u => {
    if (!u) return null;
    if (u.startsWith('http') && !u.includes('localhost') && !u.includes('127.0.0.1')) return null;
    if (/^(mailto|tel|javascript):/.test(u)) return null;
    if (u.startsWith('#')) return null;
    const p = u.replace(/^https?:\/\/[^/]+/, '');
    if (!p.startsWith('/')) return null;
    if (/\.(pdf|webp|png|jpg|jpeg|svg|xml|txt|zip|mp4|css|js|html)(\?|$)/i.test(p)) return null;
    const clean = p.split('?')[0].split('#')[0];
    return clean.endsWith('/') ? clean : clean + '/';
  };

  const browser = await chromium.launch({ channel: 'msedge' });
  const ctx = await browser.newContext();
  const seeds = ['/', '/en/', '/es/', '/pt/', '/ar/', '/news/', '/en/news/', '/es/news/', '/ar/news/',
                 '/products/', '/en/products/', '/en/products-svg/', '/en/products-asvg/',
                 '/solutions/', '/en/solutions/', '/es/solutions/', '/pt/solutions/', '/ar/solutions/'];
  const found = new Map();
  for (const s of seeds) {
    const page = await ctx.newPage();
    try {
      await page.goto('http://localhost:4399' + s, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(600);
      const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
      for (const h of hrefs) {
        const n = norm(h);
        if (n && !known.has(n)) found.set(n, (found.get(n) || 0) + 1);
      }
    } catch (e) {
      console.log('  seed failed:', s, e.message.split('\n')[0]);
    }
    await page.close();
  }
  console.log('种子页:', seeds.length, '| sitemap 已知 devPath:', known.size);
  if (found.size === 0) {
    console.log('内链里没有 sitemap 之外的页面  => sitemap 覆盖完整');
  } else {
    console.log('发现', found.size, '个「有内链但不在 sitemap」的地址：');
    [...found.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${v}次  ${k}`));
  }
  await browser.close();
})();
