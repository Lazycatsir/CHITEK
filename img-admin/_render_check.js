// 离线自检：用最小 DOM 桩跑一遍内联 JS，确认渲染函数不抛错、产物无 undefined/NaN
const fs = require('fs');
const html = fs.readFileSync('D:/download/CHITEK/img-admin/product-images.html', 'utf8');
const data = html.match(/<script id="IMG_DATA" type="application\/json">([\s\S]*?)<\/script>/)[1];
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const store = {};
function mk(id) {
  return store[id] = store[id] || {
    id, value: '', textContent: '', innerHTML: '', hidden: false, dataset: {},
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    addEventListener() {}, setAttribute() {}, getAttribute() { return null; },
    appendChild() {}, removeChild() {}, select() {}, focus() {},
    nextElementSibling: null, closest() { return null; }, style: {}
  };
}
const document = {
  getElementById(id) {
    const n = mk(id);
    if (id === 'IMG_DATA') n.textContent = data;
    const sel = { st0: 'all', st2: 'all', st5: 'all', dimSel: 'screens', status: 'all', sort: 'cat', cat: '产品图', lang: 'en' };
    if (sel[id] !== undefined) n.value = sel[id];
    return n;
  },
  querySelectorAll() { return []; },
  addEventListener() {},
  createElement(t) { return mk('_' + t + Math.random()); },
  body: { appendChild() {}, removeChild() {} }
};
const window = { isSecureContext: true };
const navigator = { clipboard: null };
const URL = { createObjectURL() { return 'blob:x'; } };
const Blob = function () {};

try {
  new Function('document', 'window', 'navigator', 'URL', 'Blob', js)(document, window, navigator, URL, Blob);
} catch (e) {
  console.log('JS 运行时抛错:', e.message);
  process.exit(1);
}

const mx = store['mxGroups'] ? store['mxGroups'].innerHTML : '';
const md = store['groups0'] ? store['groups0'].innerHTML : '';
const cd = store['groups'] ? store['groups'].innerHTML : '';
const pool = store['mxPool'] ? store['mxPool'].innerHTML : '';
console.log('矩阵组数:', (mx.match(/class="group"/g) || []).length);
console.log('矩阵行数:', (mx.match(/class="row"/g) || []).length);
console.log('矩阵缩略图:', (mx.match(/data-p="/g) || []).length);
console.log('型号台账行:', (md.match(/class="row"/g) || []).length);
console.log('8卡行:', (cd.match(/class="row"/g) || []).length);
console.log('候选池:', (pool.match(/class="pi"/g) || []).length);
console.log('stat5:', store['stat5'].innerHTML.replace(/<[^>]+>/g, ''));
console.log('stat0:', store['stat0'].innerHTML.replace(/<[^>]+>/g, ''));
for (const [k, v] of Object.entries(store)) {
  const bad = /undefined|NaN|\[object Object\]/.exec(v.innerHTML || '');
  if (bad) console.log('⚠', k, '含', bad[0]);
}
console.log('自检完成');
