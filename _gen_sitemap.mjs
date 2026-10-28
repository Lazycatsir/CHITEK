// 一条命令重建 sitemap：扫描 src/pages → 展开动态路由 → 每语言各写一份
//   输出：public/sitemap.xml（zh）+ public/{en,es,pt,ar}/sitemap.xml
//   用法：node _gen_sitemap.mjs
//   校验（需 dev server 在 4399）：node _check_sitemap_urls.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/pages';
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

// 每个 host 一份 sitemap —— Google/Bing 规定一份 sitemap 只能声明同一 host 的 URL。
// 子域目录（public/en/…）经 netlify.toml 的 force 规则映射：en.chitek-inno.com/sitemap.xml → /en/sitemap.xml
const OUT_BY_LANG = {
  zh: 'public/sitemap.xml',
  en: 'public/en/sitemap.xml',
  es: 'public/es/sitemap.xml',
  pt: 'public/pt/sitemap.xml',
  ar: 'public/ar/sitemap.xml',
};
// 各 host 的 robots.txt（子域 /robots.txt 会被 force 成 /<lang>/robots.txt）
const ROBOTS_BY_LANG = { en: 'public/en/robots.txt', es: 'public/es/robots.txt', pt: 'public/pt/robots.txt', ar: 'public/ar/robots.txt' };

function buildXml(list) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const it of list) {
    lines.push('  <url>');
    lines.push(`    <loc>${esc(it.liveUrl)}</loc>`);
    if (it.mtime) lines.push(`    <lastmod>${it.mtime}</lastmod>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>', '');
  return lines.join('\n');
}

const report = {};
for (const lang of ['zh', ...LANGS]) {
  const list = items.filter(i => i.lang === lang);
  const out = OUT_BY_LANG[lang];
  if (!list.length) { console.log('跳过（无 URL）', lang); continue; }
  const hosts = [...new Set(list.map(i => new URL(i.liveUrl).host))];
  if (hosts.length !== 1) {
    console.error(`❌ ${lang} 混入了多个 host: ${hosts.join(', ')} —— 拒绝写出`);
    process.exitCode = 1;
    continue;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const xml = buildXml(list);
  fs.writeFileSync(out, xml, 'utf8');
  report[lang] = { host: hosts[0], file: out, urls: list.length, kb: +(Buffer.byteLength(xml) / 1024).toFixed(1) };

  const rb = ROBOTS_BY_LANG[lang];
  if (rb) {
    fs.mkdirSync(path.dirname(rb), { recursive: true });
    fs.writeFileSync(rb, `User-agent: *\nAllow: /\n\nSitemap: ${HOST[lang]}/sitemap.xml\n`, 'utf8');
  }
}

fs.writeFileSync('_sitemap_urls.json', JSON.stringify(items, null, 1), 'utf8');

console.log(`\n共 ${items.length} 条 URL，拆成 ${Object.keys(report).length} 份（每份单 host）：`);
for (const [lang, r] of Object.entries(report)) {
  console.log(`  ${lang.padEnd(3)} ${String(r.urls).padStart(4)} 条  ${String(r.kb).padStart(6)} KB  ${r.file}  →  https://${r.host}/sitemap.xml`);
}
const dup = new Set(items.map(i => i.liveUrl)).size !== items.length;
console.log('重复:', dup ? '有 (BAD)' : '无', '| 最长 URL', Math.max(...items.map(i => i.liveUrl.length)), '字符');
