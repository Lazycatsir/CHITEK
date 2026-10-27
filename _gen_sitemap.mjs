// 一条命令重建 sitemap：扫描 src/pages → 展开动态路由 → 写 public/sitemap.xml
//   用法：node _gen_sitemap.mjs
//   校验（需 dev server 在 4399）：node _check_sitemap_urls.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/pages';
const OUT = 'public/sitemap.xml';
const LANGS = ['en', 'es', 'ar', 'pt'];
const HOST = { zh: 'https://chitek-inno.com' };
LANGS.forEach(l => HOST[l] = `https://${l}.chitek-inno.com`);
const ORDER = { zh: 0, en: 1, es: 2, pt: 3, ar: 4 };

const SOL_META = {
  zh: 'zhSolutionMeta.js', en: 'enSolutionMeta.js', es: 'esSolutionMeta.js',
  ar: 'arSolutionMeta.js', pt: 'ptSolutionMeta.js',
};
const NEWS = { zh: 'zhNewsCards.js', en: 'enNewsCards.js', es: 'esNewsCards.js', ar: 'arNewsCards.js' };

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.includes('.bak')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.astro')) out.push(p);
  }
  return out;
}

const items = [];
const seen = new Set();
function add(p, lang, mtime) {
  const liveUrl = HOST[lang] + p;
  if (seen.has(liveUrl)) return;
  seen.add(liveUrl);
  items.push({ devPath: (lang === 'zh' ? '' : '/' + lang) + p, liveUrl, lang, mtime });
}

for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  const base = path.basename(rel, '.astro');
  if (base === '404') continue;

  const mtime = fs.statSync(f).mtime.toISOString().slice(0, 10);
  const segs = rel.split('/');
  let lang = 'zh';
  let sub = segs;
  if (LANGS.includes(segs[0])) { lang = segs[0]; sub = segs.slice(1); }

  if (base === '[slug]') {
    if (sub[sub.length - 2] !== 'solutions') { console.warn('SKIP 未知动态路由', rel); continue; }
    const mod = await import('./src/data/' + SOL_META[lang]);
    for (const m of mod.solutionMeta) add('/solutions/' + m.slug + '/', lang, mtime);
    continue;
  }
  if (/^page_\[page\]$/.test(base)) {
    if (!NEWS[lang]) { continue; }   // pt 无新闻数据
    const mod = await import('./src/data/' + NEWS[lang]);
    const dirPrefix = sub.length > 1 ? '/' + sub.slice(0, -1).join('/') + '/' : '/';
    for (let n = 2; n <= mod.NEWS_TOTAL_PAGES; n++) add(dirPrefix + `page_${n}/`, lang, mtime);
    continue;
  }
  if (base.startsWith('[')) { console.warn('SKIP 未知动态路由', rel); continue; }

  const p = base === 'index'
    ? (sub.length > 1 ? '/' + sub.slice(0, -1).join('/') + '/' : '/')
    : '/' + sub.slice(0, -1).concat(base).join('/') + '/';
  add(p, lang, mtime);
}

items.sort((a, b) => (ORDER[a.lang] - ORDER[b.lang]) || a.devPath.localeCompare(b.devPath));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
for (const it of items) {
  lines.push('  <url>');
  lines.push(`    <loc>${esc(it.liveUrl)}</loc>`);
  if (it.mtime) lines.push(`    <lastmod>${it.mtime}</lastmod>`);
  lines.push('  </url>');
}
lines.push('</urlset>', '');
const xml = lines.join('\n');
fs.writeFileSync(OUT, xml, 'utf8');
fs.writeFileSync('_sitemap_urls.json', JSON.stringify(items, null, 1), 'utf8');

const byHost = {};
items.forEach(i => { const h = new URL(i.liveUrl).host; byHost[h] = (byHost[h] || 0) + 1; });
console.log('写入', OUT);
console.log('URL 条数:', items.length, '| 大小', (Buffer.byteLength(xml) / 1024).toFixed(1), 'KB');
console.log('按域名:', byHost);
const dup = new Set(items.map(i => i.liveUrl)).size !== items.length;
console.log('重复:', dup ? '有 (BAD)' : '无', '| 最长 URL', Math.max(...items.map(i => i.liveUrl.length)), '字符');
