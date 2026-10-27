# -*- coding: utf-8 -*-
"""把 Nav.astro 的桌面菜单区块替换为 SE 式 mega menu 新标记。"""
import io

NAV = r'F:\下载\CHITEK\src\components\Nav.astro'
BLOCK = r'F:\下载\CHITEK\docs\_ref\_nav_desktop_block.html'

START = '  <div class="hidden lg:flex gap-1 items-center">'
END = '  <!-- Search box -->'

nav = io.open(NAV, 'r', encoding='utf-8').read()
block = io.open(BLOCK, 'r', encoding='utf-8').read()

assert nav.count(START) == 1, 'START marker count = %d' % nav.count(START)
assert nav.count(END) == 1, 'END marker count = %d' % nav.count(END)

i = nav.index(START)
j = nav.index(END, i)
old = nav[i:j]
print('old region chars =', len(old))

new = block.rstrip('\n') + '\n\n'
out = nav[:i] + new + nav[j:]
io.open(NAV, 'w', encoding='utf-8').write(out)

# sanity
chk = io.open(NAV, 'r', encoding='utf-8').read()
print('new file chars =', len(chk))
for m in ['data-menu="products"', 'mega-rail', 'productsRail.map', 'simpleMenus.map', 'data-mega', 'mega-close']:
    print('  contains %-22s -> %d' % (m, chk.count(m)))
print('residual old dropdown divs =', chk.count('min-w-[340px]'))
