"""把 SVG/ASVG 两条线统一成「8 张卡 -> 6 个详情页共用」，与 AHF 现状对齐。

改动 = 只把指向 4 个页面的【链接路径】改指合并页，不动任何页面文件本身。
  /products-svg/anti-pollution-hv-svg     -> /products-svg/anti-pollution-svg
  /products-asvg/anti-pollution-hv-asvg   -> /products-asvg/anti-pollution-asvg
  /products-svg/ip65-sic-fanless-svg      -> /products-svg/sic-fanless-svg
  /products-asvg/ip65-sic-fanless-asvg    -> /products-asvg/sic-fanless-asvg

注意：替换源带 "/products-xxx/" 路径前缀，因此不会误伤
      /assets/pdf/anti-pollution-hv-svg-user-manual-en.pdf 这类同名 PDF。
用法：python -u patch_svg_asvg_merge6.py          # dry-run（只报不改）
      python -u patch_svg_asvg_merge6.py --apply  # 落盘（先备份到 F:\\trash）
"""
import os, sys, shutil, time

ROOT = 'F:/下载/CHITEK'
APPLY = '--apply' in sys.argv

RULES = [
    ('/products-svg/anti-pollution-hv-svg',    '/products-svg/anti-pollution-svg'),
    ('/products-asvg/anti-pollution-hv-asvg',  '/products-asvg/anti-pollution-asvg'),
    ('/products-svg/ip65-sic-fanless-svg',     '/products-svg/sic-fanless-svg'),
    ('/products-asvg/ip65-sic-fanless-asvg',   '/products-asvg/sic-fanless-asvg'),
]
SKIP_DIRS = {'node_modules', '.git', '.astro', 'dist', 'backups'}

files = []
for dp, dns, fns in os.walk(os.path.join(ROOT, 'src')):
    dns[:] = [d for d in dns if d not in SKIP_DIRS]
    for fn in fns:
        if fn.endswith('.astro'):
            files.append(os.path.join(dp, fn))

bk = os.path.join('F:/trash', time.strftime('%Y%m%d-%H%M%S') + '_svg_asvg_merge6')
if APPLY:
    os.makedirs(bk, exist_ok=True)

report, fails, touched = [], 0, 0
for p in sorted(files):
    raw = open(p, 'rb').read()
    src = raw.decode('utf-8')
    if not any(a in src for a, _ in RULES):
        continue
    out, per = src, []
    for a, b in RULES:
        n = out.count(a)
        if n:
            out = out.replace(a, b)
            per.append('%s -> %s x%d' % (a.split('/')[-1], b.split('/')[-1], n))
    if out == src:
        continue
    rel = os.path.relpath(p, ROOT).replace('\\', '/')
    # ---- 硬断言 ----
    bad = []
    if out.count('\n') - out.count('\r\n') != 0:
        bad.append('LF-only=%d' % (out.count('\n') - out.count('\r\n')))
    if len(src.splitlines()) != len(out.splitlines()):
        bad.append('linecount %d->%d' % (len(src.splitlines()), len(out.splitlines())))
    for a, _ in RULES:
        if out.count(a) != 0:
            bad.append('residual %s x%d' % (a, out.count(a)))
    # PDF 引用必须原样（证明没误伤）
    for token in ('anti-pollution-hv-svg-user-manual-en.pdf', 'ip65-sic-fanless-ahf-datasheet.pdf'):
        if token in src and src.count(token) != out.count(token):
            bad.append('PDF名被误改: ' + token)
    if bad:
        report.append('FAIL %-58s %s' % (rel, '; '.join(bad)))
        fails += 1
        continue
    touched += 1
    if APPLY:
        dst = os.path.join(bk, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(p, dst)
        open(p, 'wb').write(out.encode('utf-8'))
    report.append('%-58s %s' % (rel, '; '.join(per)))

print('mode     :', 'APPLY' if APPLY else 'DRY-RUN')
print('backup   :', bk if APPLY else '(dry-run, 未备份)')
print('files hit:', touched)
print('-' * 110)
for r in report:
    print(r)
print('-' * 110)
print('FAILS =', fails)
