# -*- coding: utf-8 -*-
"""Split the combined SVG/ASVG anti-pollution detail pages into LV + HV pages.
Mirrors the existing AHF split: the surviving voltage panel is renamed to
<div id="spec-table" data-volt-panel="lv|hv"> (same as anti-pollution-ahf/hv-ahf)."""
import os, re, shutil

ROOT = r"D:\download\CHITEK\src\pages\en"

# kind -> (display phrase LV, display phrase HV)
PHRASES = {
    'svg': (
        '208V/400V/480V Anti-Pollution Static Var Generator SVG',
        '690V/800V Anti-Pollution Static Var Generator SVG',
    ),
    'asvg': (
        '208V/400V/480V Anti-Pollution Advanced Static Var Generator ASVG',
        '690V/800V Anti-Pollution Advanced Static Var Generator ASVG',
    ),
}

RELATED_MARKER = '<!-- Related products:'

def remove_block_by_marker(s, open_marker):
    """Remove from open_marker (a <div ...> opener) to its matching </div>."""
    start = s.index(open_marker)
    tag_end = s.index('>', start) + 1
    depth = 1
    i = tag_end
    n = len(s)
    while i < n and depth > 0:
        lt = s.find('<', i)
        if lt == -1:
            break
        if s.startswith('</div>', lt):
            depth -= 1
            i = lt + 6
            continue
        gt = s.find('>', lt)
        if gt == -1:
            break
        tag = s[lt:gt + 1]
        if tag.startswith('<div') and not tag.startswith('</'):
            depth += 1
        i = gt + 1
    return s[:start] + s[i:]

def remove_setvolttab(s):
    m = re.search(r'<script is:inline>\s*\(function \(\) \{\s*function setVoltTab', s)
    if not m:
        return s
    si = m.start()
    je = s.index('</script>', m.end()) + len('</script>')
    return s[:si] + s[je:]

def remove_chip(s, val):
    # markup: <label class="..."><input type="checkbox" class="sr-only" data-group="v" data-val="208V" /> 208V</label>
    pat = re.compile(r'<label[^>]*>\s*<input[^>]*data-val="' + re.escape(val)
                     + r'"[^>]*>\s*' + re.escape(val) + r'\s*</label>')
    return pat.sub('', s)

def fix_related(s, kind):
    """Point the two Anti-Pollution rel-cards at the LV / HV pages respectively."""
    lv_href = "href={lp('/products-%s/anti-pollution-%s')}" % (kind, kind)
    hv_href = "href={lp('/products-%s/anti-pollution-hv-%s')}" % (kind, kind)
    def repl(m):
        full = m.group(0)
        if 'Anti-Pollution' not in full:
            return full
        new = hv_href if 'rackmount' in full else lv_href
        return re.sub(r"href=\{lp\('[^']*'\)\}", new, full, count=1)
    return re.sub(r'<a [^>]*rel-card[^>]*>.*?</a>', repl, s, flags=re.DOTALL)

def build(src_path, kind):
    lv_phrase, hv_phrase = PHRASES[kind]
    s = open(src_path, encoding='utf-8').read()

    # ---------- LV page (overwrite the combined file) ----------
    lv = s
    rp = lv.index(RELATED_MARKER)
    head = lv[:rp]
    head = head.replace('208/400/480/690/800 VAC', '208/400/480 VAC')
    head = head.replace('208\uff0d690V', '208\uff0d480V')   # fullwidth hyphen edge case guard
    head = head.replace('208–690V', '208–480V')
    head = head.replace('208-690V', '208-480V')
    lv = head + lv[rp:]
    lv = remove_block_by_marker(lv, '<div class="flex flex-wrap items-center gap-2 mb-6" role="tablist"')
    lv = remove_block_by_marker(lv, '<div id="panel-hv"')
    lv = lv.replace('<div id="panel-lv" role="tabpanel" aria-labelledby="tab-lv" data-volt-panel="lv">',
                    '<div id="spec-table" data-volt-panel="lv">')
    lv = remove_setvolttab(lv)
    lv = remove_chip(lv, '690V')
    lv = remove_chip(lv, '800V')
    lv = fix_related(lv, kind)
    lv_path = src_path
    open(lv_path, 'w', encoding='utf-8', newline='').write(lv)

    # ---------- HV page (new file) ----------
    hv = s
    rp = hv.index(RELATED_MARKER)
    head = hv[:rp]
    head = head.replace(lv_phrase, hv_phrase)
    head = head.replace('208/400/480/690/800 VAC', '690/800 VAC')
    head = head.replace('208–690V', '690–800V')
    head = head.replace('208-690V', '690-800V')
    head = head.replace('/assets/images/products-ahf-anti-pollution.webp',
                        '/assets/images/products-ahf-anti-pollution-690v-800v-rackmount.webp')
    head = head.replace('anti-pollution-%s' % kind, 'anti-pollution-hv-%s' % kind)  # JSON-LD breadcrumb URL
    hv = head + hv[rp:]
    # configurator script lives AFTER the Related-Products marker, so replace on full string
    hv = hv.replace("v: '400V'", "v: '690V'")
    hv = hv.replace('ANTI_POLLUTION_%s_' % kind.upper(), 'ANTI_POLLUTION_HV_%s_' % kind.upper())
    hv = remove_block_by_marker(hv, '<div class="flex flex-wrap items-center gap-2 mb-6" role="tablist"')
    hv = remove_block_by_marker(hv, '<div id="panel-lv"')
    hv = hv.replace('<div id="panel-hv" role="tabpanel" aria-labelledby="tab-hv" data-volt-panel="hv" hidden>',
                    '<div id="spec-table" data-volt-panel="hv">')
    hv = remove_setvolttab(hv)
    hv = remove_chip(hv, '208V')
    hv = remove_chip(hv, '400V')
    hv = remove_chip(hv, '480V')
    hv = fix_related(hv, kind)
    hv_path = os.path.join(os.path.dirname(src_path), 'anti-pollution-hv-%s.astro' % kind)
    open(hv_path, 'w', encoding='utf-8', newline='').write(hv)
    return lv_path, hv_path

if __name__ == '__main__':
    for kind in ('svg', 'asvg'):
        src = os.path.join(ROOT, 'products-%s' % kind, 'anti-pollution-%s.astro' % kind)
        bak = src + '.bak_split_20261015'
        if not os.path.exists(bak):
            shutil.copy(src, bak)
            print('backup ->', bak)
        lp, hp = build(src, kind)
        print('LV:', lp)
        print('HV:', hp)
    print('DONE')
