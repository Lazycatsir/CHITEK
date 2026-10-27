"""Nav.astro：把 svg / asvg 两条线的 navProductCards 由 8 条去重成 6 条，与 ahf 对齐。

去重规则（与 ahf 现有做法一致：同一详情页只保留「首次出现」的那条）：
  svg  删 '690V/800V Anti-Pollution ... SVG'（-> anti-pollution-svg，与 208V/400V/480V 重复）
       删 'SiC-Fanless & Low Noise ... SVG'（-> sic-fanless-svg，与 IP65 SiC-Fanless 重复）
       'IP65 SiC-Fanless & Low Noise Static Var Generator' 的 slug 改指 sic-fanless-svg
  asvg 同构
用法：python -u patch_nav_merge6.py [--apply]
"""
import os, io, sys, shutil, time

PAGE = 'F:/下载/CHITEK/src/components/Nav.astro'
APPLY = '--apply' in sys.argv

DEL_LINES = [
    "    { name: '690V/800V Anti-Pollution Static Var Generator SVG', slug: 'anti-pollution-hv-svg' },",
    "    { name: 'SiC-Fanless & Low Noise Static Var Generator', slug: 'sic-fanless-svg' },",
    "    { name: '690V/800V Anti-Pollution Advanced Static Var Generator ASVG', slug: 'anti-pollution-hv-asvg' },",
    "    { name: 'SiC-Fanless & Low Noise Advanced Static Var Generator ASVG', slug: 'sic-fanless-asvg' },",
]
REPL = [
    ("    { name: 'IP65 SiC-Fanless & Low Noise Static Var Generator', slug: 'ip65-sic-fanless-svg' },",
     "    { name: 'IP65 SiC-Fanless & Low Noise Static Var Generator', slug: 'sic-fanless-svg' },"),
    ("    { name: 'IP65 SiC-Fanless & Low Noise Advanced Static Var Generator ASVG', slug: 'ip65-sic-fanless-asvg' },",
     "    { name: 'IP65 SiC-Fanless & Low Noise Advanced Static Var Generator ASVG', slug: 'sic-fanless-asvg' },"),
    ("// 同一详情页只保留首次出现的那条：AHF 的 208V/400V/480V 与 690V/800V 共用 anti-pollution-ahf、",
     "// 同一详情页只保留首次出现的那条：208V/400V/480V 与 690V/800V 共用 anti-pollution-*、"),
    ("// IP65 SiC-Fanless 与 SiC-Fanless 共用 sic-fanless-ahf，故 AHF 8 张卡去重后为 6 条；SVG / ASVG 各 8 条。",
     "// IP65 SiC-Fanless 与 SiC-Fanless 共用 sic-fanless-*，故 AHF / SVG / ASVG 各有 8 张卡、去重后均为 6 条。"),
]

raw = open(PAGE, 'rb').read()
src = raw.decode('utf-8')
out = src
log, fails = [], 0


def ck(cond, msg):
    global fails
    if cond:
        log.append('  ok   ' + msg)
    else:
        log.append('  FAIL ' + msg)
        fails += 1
    return cond


# 1) 删整行（含其后的 CRLF）；先删，避免与后面 slug 改写撞车
for ln in DEL_LINES:
    n = out.count(ln + '\r\n')
    if not ck(n == 1, 'delete line x%d (want 1): %s' % (n, ln.strip()[:70])):
        continue
    out = out.replace(ln + '\r\n', '')

# 2) 改 slug 归属
for old, new in REPL[:2]:
    n = out.count(old)
    if not ck(n == 1, 'repl slug x%d (want 1): %s' % (n, old.strip()[:60])):
        continue
    out = out.replace(old, new)

# 3) 注释同步
for old, new in REPL[2:]:
    n = out.count(old)
    if not ck(n == 1, 'repl comment x%d (want 1): %s' % (n, old.strip()[:60])):
        continue
    out = out.replace(old, new)

# ---- 结构断言 ----
ck(out.count('\n') - out.count('\r\n') == 0, 'line endings intact (LF-only=0)')
ck(len(src.splitlines()) - len(out.splitlines()) == 4, 'line count -4 (got %d)' % (len(src.splitlines()) - len(out.splitlines())))
ck(out.count("slug: 'anti-pollution-hv-svg'") == 0 and out.count("slug: 'anti-pollution-hv-asvg'") == 0, 'hv slugs gone')
for fam, prefix in (('ahf', 'ahf'), ('svg', 'svg'), ('asvg', 'asvg')):
    blk = out.split('  ' + fam + ': [')[1].split('  ],')[0] if ('  ' + fam + ': [') in out else ''
    cnt = blk.count('{ name:')
    ck(cnt == 6, '%s cards = 6 (got %d)' % (fam, cnt))
ck(out.count("slug: 'sic-fanless-svg'") == 1 and out.count("slug: 'sic-fanless-asvg'") == 1, 'sic-fanless slug unique per family')

print('mode:', 'APPLY' if APPLY else 'DRY-RUN')
for l in log:
    print(l)
if fails:
    print('FAILS =', fails, '-> 未写盘')
    sys.exit(1)
if APPLY:
    bk = os.path.join('F:/trash', time.strftime('%Y%m%d-%H%M%S') + '_nav_merge6')
    os.makedirs(bk, exist_ok=True)
    shutil.copy2(PAGE, os.path.join(bk, 'Nav.astro'))
    open(PAGE, 'wb').write(out.encode('utf-8'))
    print('APPLIED. backup ->', bk)
else:
    print('DRY-RUN OK, no write.')
