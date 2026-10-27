# -*- coding: utf-8 -*-
"""把 sic-ultra-ahf.astro 模板里 8 个兄弟 Related 卡片的占位链接
lp('/products') 改成各自的真实详情页 slug，形成闭环。
只针对 rel-card 区块（紧跟 <img src=products-ahf-*.webp> 的 <a>），
不动 line 72 的面包屑 'Products' 链接。"""
import io, os, re

REPO = r'F:\下载\CHITEK'
T = os.path.join(REPO, r'src\pages\en\products\sic-ultra-ahf.astro')

IMG2SLUG = {
    'products-ahf-anti-pollution': 'anti-pollution-ahf',
    'products-ahf-ultra-slim': 'ultra-slim-ahf',
    'products-ahf-distributed': 'distributed-ahf',
    'products-ahf-rack-mounted': 'rack-mounted-ahf',
    'products-ahf-ip65-fanless': 'ip65-sic-fanless-ahf',
    'products-ahf-ip65': 'ip65-ahf',
    'products-ahf-sic-fanless': 'sic-fanless-ahf',
    'products-ahf-advanced': 'advanced-ahf',
}

def repl(m):
    img = m.group(1)            # products-ahf-xxx
    slug = IMG2SLUG[img]
    return "<a href={lp('/products/%s')} class=\"rel-card group shrink-0 w-[calc((100%%-7.5rem)/4)] rounded-xl overflow-hidden border border-[#e5e7eb] bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.10)] transition-shadow\">\n            <img src=\"/assets/images/%s.webp\"" % (slug, img)

s = io.open(T, 'r', encoding='utf-8').read()
pat = re.compile(r"<a href=\{lp\('/products'\)\} class=\"rel-card[^>]*>\s*<img src=\"/assets/images/(products-ahf-[^\"]+)\.webp\"")
new, n = pat.subn(repl, s)
print('replaced sibling rel-card links =', n)
assert n == 8, 'expected exactly 8 sibling links, got %d' % n
io.open(T, 'w', encoding='utf-8').write(new)
print('WROTE', T)
