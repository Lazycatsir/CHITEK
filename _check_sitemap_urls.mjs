// 并发校验每个 dev 路径的真实状态码
import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('_sitemap_urls.json', 'utf8'));
const BASE = 'http://localhost:4399';
const CONC = 8;
let idx = 0;
const results = [];

async function worker() {
  while (idx < items.length) {
    const i = idx++;
    const it = items[i];
    let status = 0, note = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 90000);
        const r = await fetch(BASE + it.devPath, { signal: ctl.signal, redirect: 'manual' });
        clearTimeout(t);
        status = r.status;
        if (status >= 300 && status < 400) {
          note = 'redirect -> ' + r.headers.get('location');
        }
        if (status === 200) break;
      } catch (e) {
        status = -1;
        note = e.name + ': ' + e.message.slice(0, 60);
      }
    }
    results[i] = { ...it, status, note };
    if ((i + 1) % 20 === 0) process.stdout.write(`  ...${i + 1}/${items.length}\n`);
  }
}

await Promise.all(Array.from({ length: CONC }, worker));

results.sort((a, b) => a.devPath.localeCompare(b.devPath));
const bad = results.filter(r => r.status !== 200);
fs.writeFileSync('_sitemap_check.json', JSON.stringify(results, null, 1), 'utf8');

console.log('\n总数', results.length, '| 200:', results.filter(r => r.status === 200).length, '| 非200:', bad.length);
for (const b of bad) console.log(`  [${b.status}] ${b.devPath} -> ${b.liveUrl} ${b.note || ''}`);
