# -*- coding: utf-8 -*-
"""静态校验生成的详情页 + products.astro 网格链接。"""
import io, os, re, json

REPO = r'F:\下载\CHITEK'
# 8 个本次生成的详情页
SLUGS = ['anti-pollution-ahf','ultra-slim-ahf','distributed-ahf','rack-mounted-ahf',
         'ip65-sic-fanless-ahf','ip65-ahf','sic-fanless-ahf','advanced-ahf']
# SiC 平台 slug（大小写不敏感判定）
SIC_SLUGS = {'sic-ultra-ahf','ip65-sic-fanless-ahf','sic-fanless-ahf'}
PRODUCTS = os.path.join(REPO, r'src\pages\en\products.astro')

def is_sic(slug):
    return slug.lower() in {x.lower() for x in SIC_SLUGS}

def check_page(slug, expect_rel, self_slug=None):
    """expect_rel: 期望的 rel-card 真实卡片数；self_slug: 若为本卡自身也要排除。"""
    path = os.path.join(REPO, r'src\pages\en\products', slug + '.astro')
    s = io.open(path, 'r', encoding='utf-8').read()
    errs = []
    # 1) JSON-LD 合法性
    blocks = re.findall(r'<script type="application/ld\+json" is:inline>\s*(.*?)\s*</script>', s, re.S)
    n_json = len(blocks)
    for b in blocks:
        try:
            json.loads(b)
        except Exception as e:
            errs.append('JSON-LD error: %s' % e)
    # 2) related 闭环（只数真实卡片 class="rel-card，排除 <style>/JS 里的 .rel-card）
    n_rel = len(re.findall(r'class="rel-card', s))
    if n_rel != expect_rel:
        errs.append('rel-card=%d (expect %d)' % (n_rel, expect_rel))
    # 3) h1 存在且非模板残留
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    h1txt = re.sub(r'<[^>]+>', '', h1.group(1)).strip() if h1 else ''
    # 模板(sic-ultra-ahf)自身 h1 就是该文案，合法；仅生成的 8 页需检查是否残留模板 h1
    h1_residual = (self_slug != 'sic-ultra-ahf') and ('SiC MOSFET Active Harmonic Filter Ultra AHF Series' in h1txt)
    if not h1txt or h1_residual:
        errs.append('h1 bad: %r' % h1txt)
    # 4) 不应残留旧 slug（sic-ultra-ahf 本身除外）
    if self_slug != 'sic-ultra-ahf' and 'sic-ultra-ahf' in s:
        errs.append('residual sic-ultra-ahf')
    # 5) 配置器 / 参数表 / FAQ 存在
    for marker in ['data-group="v"', '<tbody>', 'id="faq"', 'id="parameters"', 'id="description"']:
        if marker not in s:
            errs.append('missing %s' % marker)
    # 6) platform 一致性（IGBT 页不应含 SiC 平台描述；大小写不敏感）
    plat = 'SiC' if is_sic(slug) else 'IGBT'
    if plat == 'IGBT' and 'up to 40 kHz (SiC)' in s:
        errs.append('IGBT page still has SiC switching freq')
    if plat == 'IGBT' and '3-level NPC, SiC MOSFET' in s:
        errs.append('IGBT page still has SiC topology')
    print('%-26s json=%d rel=%d h1=%r %s' % (slug, n_json, n_rel, h1txt[:40], 'OK' if not errs else 'ERR:'+';'.join(errs)))
    return errs

all_errs = []
for sl in SLUGS:
    # 生成的 8 页均不含自身，rel-card 应为 8（其余 8 个兄弟）
    all_errs += check_page(sl, expect_rel=8, self_slug=sl)

# 模板本身也要校验（含自身，rel-card=9；SiC 平台）
all_errs += check_page('sic-ultra-ahf', expect_rel=9, self_slug='sic-ultra-ahf')
# 模板兄弟链接不得再是占位 lp('/products')：修复后全文件只剩 1 处（面包屑 'Products'）。
# 注意 lp('/products/<slug>') 不含子串 lp('/products')（products 后跟 / 而非 '）。
T = io.open(os.path.join(REPO, r'src\pages\en\products\sic-ultra-ahf.astro'), 'r', encoding='utf-8').read()
n_tmpl_placeholder = T.count("lp('/products')")
print('--- sic-ultra-ahf.astro (template) ---')
print("lp('/products') exact occurrences =", n_tmpl_placeholder, '(expect 1: breadcrumb only)')
if n_tmpl_placeholder != 1:
    all_errs.append('template has %d placeholder lp links (expect 1)' % n_tmpl_placeholder)

# products.astro 网格校验
P = io.open(PRODUCTS, 'r', encoding='utf-8').read()
n_card_img_hash = P.count('href="#"><img')          # 卡片级图片占位（应为 0）
n_tag = P.count('class="cbp-tag"')                   # tag 链接（应为 72）
n_card_lp = P.count("href={lp('/products/")        # 卡片 image/h3/ViewMore 全部 lp 链接
print('--- products.astro ---')
print('href="#"><img (card img placeholder) =', n_card_img_hash, '(expect 0)')
print('cbp-tag =', n_tag, '(expect 72)')
print('card lp links =', n_card_lp, '(expect 27: 9 cards x image+h3+viewmore)')
if n_card_img_hash or n_tag != 72 or n_card_lp != 27:
    all_errs.append('products.astro grid issue')

print('=== TOTAL ERRORS:', len(all_errs))
