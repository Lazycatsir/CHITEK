# -*- coding: utf-8 -*-
"""
为 en/products 网格中除 SiC Ultra AHF 外的 8 张卡，批量生成与 sic-ultra-ahf.astro 同构的详情页。
同时把 en/products.astro 中这 8 张卡的 href="#" 改为真实详情页 slug。

用法：python gen_detail_pages.py
依赖：仅标准库；模板取自仓库内已存在的 sic-ultra-ahf.astro。
"""
import os, io, sys

REPO = r'F:\下载\CHITEK'
TEMPLATE = os.path.join(REPO, r'src\pages\en\products\sic-ultra-ahf.astro')
OUTDIR = os.path.join(REPO, r'src\pages\en\products')
PRODUCTS = os.path.join(REPO, r'src\pages\en\products.astro')

# ---- 全 9 卡主数据（用于详情页互相内链）----
ALL9 = [
    ('sic-ultra-ahf',            'products-ahf-sic.webp',            'Silicon Carbide MOSFET Active Harmonic Filter SiC AHF'),
    ('anti-pollution-ahf',       'products-ahf-anti-pollution.webp', 'Anti-Pollution Active Harmonic Filter AHF'),
    ('ultra-slim-ahf',           'products-ahf-ultra-slim.webp',     'Ultra-slim Active Harmonic Filter AHF'),
    ('distributed-ahf',          'products-ahf-distributed.webp',    'Distributed Active Harmonic Filter AHF'),
    ('rack-mounted-ahf',         'products-ahf-rack-mounted.webp',   'Rack mounted Active Harmonic Filter'),
    ('ip65-sic-fanless-ahf',     'products-ahf-ip65-fanless.webp',   'IP65 SiC-Fanless & Low Noise Active Harmonic Filter'),
    ('ip65-ahf',                 'products-ahf-ip65.webp',          'IP65 Active Harmonic Filter'),
    ('sic-fanless-ahf',          'products-ahf-sic-fanless.webp',    'SiC-Fanless & Low Noise Active Harmonic Filter'),
    ('advanced-ahf',             'products-ahf-advanced.webp',       'Advanced Active Harmonic Filter'),
]
ALL9_BY_SLUG = {s: (img, name) for s, img, name in ALL9}

# ---- 8 张目标卡的配置（slug 不在 sic-ultra-ahf）----
def C(slug, img, short, full, platform, v_list, a_list, def_a, ip, dims, capacity):
    return dict(slug=slug, img=img, short=short, full=full, platform=platform,
                v_list=v_list, a_list=a_list, def_a=def_a, ip=ip, dims=dims, capacity=capacity)

CARDS = [
    C('anti-pollution-ahf', 'products-ahf-anti-pollution.webp',
      'Anti-Pollution Active Harmonic Filter AHF',
      'Anti-Pollution Active Harmonic Filter AHF — Harsh-Environment Power Quality Series',
      'IGBT', ['400V','480V','690V'], ['50A','75A','100A','150A','200A'], '100A',
      'IP20, IP30 (customizable)', '500 × 550 × 130 mm (W × H × D)', '50 A – 200 A per module (parallel expandable, unlimited)'),
    C('ultra-slim-ahf', 'products-ahf-ultra-slim.webp',
      'Ultra-slim Active Harmonic Filter AHF',
      'Ultra-slim Active Harmonic Filter AHF — Compact 1U Power Quality Series',
      'IGBT', ['400V','480V','690V'], ['30A','50A'], '50A',
      'IP20, IP30, IP40 (customizable)', '500 × 550 × 130 mm (W × H × D)', '30 A – 50 A per module (parallel expandable, unlimited)'),
    C('distributed-ahf', 'products-ahf-distributed.webp',
      'Distributed Active Harmonic Filter AHF',
      'Distributed Active Harmonic Filter AHF — Modular Harmonic Compensation Series',
      'IGBT', ['400V','480V','690V'], ['30A','50A'], '50A',
      'IP20, IP30, IP40 (customizable)', '380 × 425 × 88 mm (W × H × D)', '30 A – 50 A per module (parallel expandable, unlimited)'),
    C('rack-mounted-ahf', 'products-ahf-rack-mounted.webp',
      'Rack mounted Active Harmonic Filter',
      'Rack mounted Active Harmonic Filter — 19-Inch Rack Power Quality Series',
      'IGBT', ['208V','400V','690V'], ['8A','20A'], '20A',
      'IP54, IP55 (customizable)', '340 × 410 × 45 mm (W × H × D)', '8 A – 20 A per module (parallel expandable, unlimited)'),
    C('ip65-sic-fanless-ahf', 'products-ahf-ip65-fanless.webp',
      'IP65 SiC-Fanless & Low Noise Active Harmonic Filter',
      'IP65 SiC-Fanless & Low Noise Active Harmonic Filter — Outdoor Silent Series',
      'SiC', ['400V','480V','690V'], ['8A','20A'], '20A',
      'IP20, IP30, IP65 (customizable)', '380 × 425 × 88 mm (W × H × D)', '8 A – 20 A per module (parallel expandable, unlimited)'),
    C('ip65-ahf', 'products-ahf-ip65.webp',
      'IP65 Active Harmonic Filter',
      'IP65 Active Harmonic Filter — Weatherproof Outdoor Series',
      'IGBT', ['400V','480V','690V'], ['8A','20A'], '20A',
      'IP20, IP30, IP65 (customizable)', '380 × 425 × 88 mm (W × H × D)', '8 A – 20 A per module (parallel expandable, unlimited)'),
    C('sic-fanless-ahf', 'products-ahf-sic-fanless.webp',
      'SiC-Fanless & Low Noise Active Harmonic Filter',
      'SiC-Fanless & Low Noise Active Harmonic Filter — Natural-Cooling Series',
      'SiC', ['400V','480V','690V'], ['8A','20A'], '20A',
      'IP20, IP30 (customizable)', '380 × 425 × 88 mm (W × H × D)', '8 A – 20 A per module (parallel expandable, unlimited)'),
    C('advanced-ahf', 'products-ahf-advanced.webp',
      'Advanced Active Harmonic Filter',
      'Advanced Active Harmonic Filter — Multi-Function Power Quality Series',
      'IGBT', ['400V','480V','690V'], ['8A','20A'], '20A',
      'IP20, IP30 (customizable)', '380 × 425 × 88 mm (W × H × D)', '8 A – 20 A per module (parallel expandable, unlimited)'),
]

PLATFORM_TXT = {
    'IGBT': 'IGBT active harmonic filter (AHF)',
    'SiC': 'silicon-carbide (SiC) MOSFET active harmonic filter (AHF)',
}

def esc(s):
    return s.replace('&', '&amp;')

# ---------------------------------------------------------------------------
# 区域替换工具
# ---------------------------------------------------------------------------
def replace_region(text, start_sub, end_sub, new_middle):
    i = text.find(start_sub)
    if i < 0:
        raise ValueError('start not found: ' + start_sub[:40])
    j = text.find(end_sub, i + len(start_sub))
    if j < 0:
        raise ValueError('end not found: ' + end_sub[:40])
    return text[:i + len(start_sub)] + new_middle + text[j:]

def replace_script_containing(text, marker, new_script):
    i = text.find(marker)
    if i < 0:
        raise ValueError('marker not found: ' + marker[:40])
    s = text.rfind('<script', 0, i)
    if s < 0:
        raise ValueError('no <script before marker')
    e = text.find('</script>', i)
    if e < 0:
        raise ValueError('no </script> after marker')
    e += len('</script>')
    return text[:s] + new_script + text[e:]

# ---------------------------------------------------------------------------
# 各区块生成
# ---------------------------------------------------------------------------
def gen_configurator(cfg):
    v_lbls = '\n'.join(
        '                <label class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-text-mid cursor-pointer"><input type="checkbox" class="accent-[#ff6b1a]" data-group="v" data-val="%s" /> %s</label>' % (v, v)
        for v in cfg['v_list'])
    a_lbls = '\n'.join(
        '                <label class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-text-mid cursor-pointer"><input type="checkbox" class="accent-[#ff6b1a]" data-group="a" data-val="%s" /> %s</label>' % (a, a)
        for a in cfg['a_list'])
    return (
        '\n          <div class="mb-7 space-y-4">\n'
        '            <div>\n'
        '              <p class="text-[13px] font-semibold text-text-dark mb-2">Voltage</p>\n'
        '              <div class="flex flex-wrap gap-2">\n' + v_lbls + '\n              </div>\n'
        '            </div>\n'
        '            <div>\n'
        '              <p class="text-[13px] font-semibold text-text-dark mb-2">Current</p>\n'
        '              <div class="flex flex-wrap gap-2">\n' + a_lbls + '\n              </div>\n'
        '            </div>\n'
        '            <div>\n'
        '              <div class="flex flex-wrap items-start gap-x-8 gap-y-3">\n'
        '                <div>\n'
        '                  <p class="text-[13px] font-semibold text-text-dark mb-2">Connection</p>\n'
        '                  <div class="flex flex-wrap gap-2">\n'
        '                    <label class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-text-mid cursor-pointer"><input type="checkbox" class="accent-[#ff6b1a]" data-group="c" data-val="3P3W" /> 3P3W</label>                <label class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-text-mid cursor-pointer"><input type="checkbox" class="accent-[#ff6b1a]" data-group="c" data-val="3P4W" /> 3P4W</label>\n'
        '                  </div>\n'
        '                </div>\n'
        '                <div>\n'
        '                  <p class="text-[13px] font-semibold text-text-dark mb-2">Installation</p>\n'
        '                  <div class="flex flex-wrap gap-2">\n'
        '                    <label class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-text-mid cursor-pointer"><input type="checkbox" class="accent-[#ff6b1a]" data-group="i" data-val="Wall" /> Wall</label>                <label class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-text-mid cursor-pointer"><input type="checkbox" class="accent-[#ff6b1a]" data-group="i" data-val="Rack" /> Rack</label>\n'
        '                  </div>\n'
        '                </div>\n'
        '              </div>\n'
        '            </div>\n'
        '          </div>\n\n'
    )

def gen_params(cfg):
    plat = cfg['platform']
    if plat == 'SiC':
        switching = 'up to 40 kHz (SiC)'
        efficiency = '≥ 98%'
        loss = '&lt; 1.8% of rated kVA'
        topology = '3-level NPC, SiC MOSFET'
    else:
        switching = 'up to 20 kHz (IGBT)'
        efficiency = '≥ 97%'
        loss = '&lt; 3% of rated kVA'
        topology = '3-level NPC, IGBT'
    rows = [
        ('Rated Voltage', '208–690 V'),
        ('Rated Capacity', cfg['capacity']),
        ('Frequency', '50 / 60 Hz'),
        ('Wiring Mode', '3P3W / 3P4W'),
        ('Filtering Range', '2nd – 51st order harmonic'),
        ('Function', 'Harmonic mitigation, reactive compensation, imbalance phase balancing'),
        ('Full Response Time', '&lt; 50 μs'),
        ('Switching Frequency', switching),
        ('Efficiency', efficiency),
        ('Power Loss', loss),
        ('THDi (after compensation)', '&lt; 5% (IEEE 519)'),
        ('Topology', topology),
        ('IP Class', cfg['ip']),
        ('Dimensions', cfg['dims']),
        ('Installation', 'Wall mounted / floor stand cabinet'),
        ('Standard', 'IEC 61000 / IEC 62477'),
        ('Communication', 'MODBUS / optional Ethernet'),
    ]
    out = ['<tbody>']
    n = len(rows)
    for idx, (th, td) in enumerate(rows):
        last = '' if idx == n - 1 else ' border-b border-border-light'
        out.append('            <tr class="border-b border-border-light"><th class="text-left py-1.5 px-4 pr-10 bg-[#fafbfc] font-semibold text-text-dark w-1/6">%s</th><td class="py-1.5 px-4 pr-10 text-text-mid whitespace-nowrap">%s</td></tr>' % (th, td) if idx != n-1 else
                  '            <tr><th class="text-left py-1.5 px-4 pr-10 bg-[#fafbfc] font-semibold text-text-dark w-1/6">%s</th><td class="py-1.5 px-4 pr-10 text-text-mid whitespace-nowrap">%s</td></tr>' % (th, td))
    out.append('          </tbody>')
    return '\n'.join(out)

def gen_related(cfg):
    others = [s for s in ALL9 if s[0] != cfg['slug']]
    cards = []
    for slug, img, name in others:
        cards.append(
            '          <a href={lp(\'/products/%s\')} class="rel-card group shrink-0 w-[calc((100%%-7.5rem)/4)] rounded-xl overflow-hidden border border-[#e5e7eb] bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.10)] transition-shadow">\n'
            '            <img src="/assets/images/%s" alt="%s" loading="lazy" class="w-full aspect-square object-cover bg-[#f3f4f6]" />\n'
            '            <div class="p-5">\n'
            '              <h3 class="text-[clamp(15px,1.1vw,18px)] font-semibold text-[#111827] group-hover:text-brand-orange transition-colors leading-[1.3]">%s</h3>\n'
            '            </div>\n'
            '          </a>' % (slug, img, esc(name), esc(name)))
    return '\n'.join(cards)

# 通用 IGBT FAQ 内容
def gen_faq_section_igbt(cfg):
    s = esc(cfg['short'])
    cap = cfg['capacity']
    ip = cfg['ip']
    rows = [
        ('Q1: What is an active harmonic filter (AHF)?',
         'An active harmonic filter is a power-electronics device that measures the load current with an external CT, isolates the harmonic, reactive and imbalance components with a DSP, and injects an equal and opposite compensation current through an IGBT inverter bridge. The utility then sees a clean fundamental waveform.'),
        ('Q2: How does the AHF work?',
         'An external CT samples the load current; a DSP/FPGA runs an FFT to separate 2nd–51st order harmonics, reactive power and imbalance; the IGBT inverter bridge then injects an equal and opposite-phase compensation current. The result is THDi held below 5% per IEEE 519 at the point of common coupling.'),
        ('Q3: What capacity and voltage range is available?',
         '%s, 3P3W/3P4W, covering 208–690V. Modules parallel without a practical limit to reach 3000 A and beyond for large plants.' % cap),
        ('Q4: Can it also correct power factor and balance loads?',
         'Yes. A selectable priority function covers harmonic mitigation, reactive compensation and three-phase balancing. In 3P4W mode it also cancels the accumulated 3rd-harmonic neutral current.'),
        ('Q5: How is it installed and what protection rating does it have?',
         'Installed as wall-mounted or rack / cabinet type; rated %s. The enclosure is built for the duty cycle of industrial switchrooms and can be customized for harsher or outdoor sites.' % ip),
        ('Q6: How do I confirm the right model for my site?',
         'Send us the load’s harmonic spectrum, voltage class and installed nonlinear capacity. CHITEK supplies a selection matrix by voltage class, series and capacity, plus a sizing calculation on request.'),
    ]
    det = []
    for i, (q, a) in enumerate(rows):
        open_attr = ' open' if i == 0 else ''
        det.append(
            '        <details class="bg-white rounded-2xl border border-border-light p-5"%s>\n'
            '          <summary class="cursor-pointer font-semibold text-text-dark text-[clamp(15px,1.1vw,17px)]">%s</summary>\n'
            '          <p class="mt-3 text-text-mid text-[clamp(13px,1vw,15px)] leading-relaxed">%s</p>\n'
            '        </details>' % (open_attr, esc(q), esc(a)))
    return (
        '  <section id="faq" class="bg-[#fafbfc] pt-[clamp(28px,3vw,48px)] pb-[clamp(40px,4vw,72px)] scroll-mt-[120px]">\n'
        '    <div class="max-w-none px-3 lg:pl-6 lg:pr-10">\n'
        '      <h2 class="text-[clamp(24px,2.5vw,44px)] font-bold text-text-dark mb-10 font-barlow-condensed text-left">FAQs About the %s</h2>\n'
        '      <div class="space-y-4">\n' % s
        + '\n'.join(det) + '\n'
        '      </div>\n'
        '    </div>\n'
    )

def gen_faq_json_igbt(cfg):
    s = cfg['short']            # JSON 内允许裸 &
    cap = cfg['capacity']
    ip = cfg['ip']
    qa = [
        ('What is an active harmonic filter (AHF)?',
         'An active harmonic filter is a power-electronics device that measures the load current with an external CT, isolates the harmonic, reactive and imbalance components with a DSP, and injects an equal and opposite compensation current through an IGBT inverter bridge so the utility sees a clean fundamental waveform.'),
        ('How does the AHF work?',
         'An external CT samples the load current; a DSP/FPGA runs an FFT to separate 2nd–51st order harmonics, reactive power and imbalance; the IGBT bridge then injects an equal and opposite-phase compensation current, holding THDi below 5% per IEEE 519.'),
        ('What capacity and voltage range is available?',
         '%s, 3P3W/3P4W, covering 208–690V, with modules paralleled without a practical limit for large plants.' % cap),
        ('Can it also correct power factor and balance loads?',
         'Yes. A selectable priority function covers harmonic mitigation, reactive compensation and three-phase balancing, and in 3P4W mode it also cancels the accumulated 3rd-harmonic neutral current.'),
        ('How is it installed and what protection rating does it have?',
         'Installed as wall-mounted or rack/cabinet type, rated %s, and customizable for harsher or outdoor sites.' % ip),
        ('How do I confirm the right model for my site?',
         'Send us the load harmonic spectrum, voltage class and installed nonlinear capacity. CHITEK supplies a selection matrix and a sizing calculation on request.'),
    ]
    items = []
    for q, a in qa:
        items.append('      { "@type": "Question", "name": "%s", "acceptedAnswer": { "@type": "Answer", "text": "%s" } }' % (q, a))
    body = ',\n'.join(items)
    return (
        '  <script type="application/ld+json" is:inline>\n'
        '  {\n'
        '    "@context": "https://schema.org",\n'
        '    "@type": "FAQPage",\n'
        '    "mainEntity": [\n' + body + '\n'
        '    ]\n'
        '  }\n'
        '  </script>'
    )

def build_page(T, cfg):
    slug = cfg['slug']; img = cfg['img']; short = cfg['short']; full = cfg['full']
    plat = cfg['platform']
    short_h = esc(short); full_h = esc(full)
    url = 'https://en.chitek-inno.com/products/' + slug

    p = T

    # meta
    p = p.replace("title: 'SiC MOSFET Ultra AHF | Active Harmonic Filter | CHITEK',",
                  "title: '%s | Active Harmonic Filter | CHITEK'," % short)
    meta_desc = 'CHITEK %s — %s. THDi < 5%% per IEEE 519, 208-690V, %s.' % (short, PLATFORM_TXT[plat], cfg['capacity'])
    p = p.replace(
        "description: 'CHITEK SiC MOSFET Ultra Active Harmonic Filter (AHF) — silicon-carbide 3-level topology for higher efficiency, higher power density and lower thermal loss. THDi < 5% per IEEE 519, 208-690V, 50-200A per module.',",
        "description: '%s'," % meta_desc)

    # Breadcrumb nav span（不依赖缩进，精确匹配 span 文本）
    p = p.replace("SiC MOSFET Ultra AHF</span>",
                  "%s</span>" % short_h)

    # Breadcrumb JSON item3
    p = p.replace(
        '      { "@type": "ListItem", "position": 3, "name": "Silicon Carbide (SiC) MOSFET Ultra AHF", "item": "https://en.chitek-inno.com/products/sic-ultra-ahf" }',
        '      { "@type": "ListItem", "position": 3, "name": "%s", "item": "%s" }' % (short, url))

    # Product JSON-LD name + description + capacity
    p = p.replace('"name": "CHITEK SiC MOSFET Ultra Active Harmonic Filter",',
                  '"name": "CHITEK %s",' % short)
    prod_desc = 'CHITEK %s (%s) delivering real-time harmonic cancellation, reactive compensation and load balancing with THDi held below 5%% per IEEE 519 across a 208–690V, %s range.' % (short, PLATFORM_TXT[plat], cfg['capacity'])
    p = p.replace(
        '"description": "Silicon-carbide (SiC) MOSFET active harmonic filter with 3-level topology, delivering higher switching efficiency, higher power density and lower thermal loss than IGBT platforms, while holding THDi below 5% per IEEE 519.",',
        '"description": "%s",' % prod_desc)
    p = p.replace('"value": "50A-200A per module, parallel expandable"',
                  '"value": "%s"' % cfg['capacity'])

    # h1
    p = p.replace(
        '<h1 class="text-[clamp(21px,2.1vw,32px)] font-bold leading-snug text-text-dark mb-6 font-barlow-condensed">SiC MOSFET Active Harmonic Filter Ultra AHF Series 3 Phase Power Quality Correction Device</h1>',
        '<h1 class="text-[clamp(21px,2.1vw,32px)] font-bold leading-snug text-text-dark mb-6 font-barlow-condensed">%s</h1>' % full_h)

    # Tags paragraph
    tags_text = {
        'anti-pollution-ahf': 'Anti-Pollution AHF, active harmonic filter, dust-proof harmonic filter, harsh-environment AHF, anti-corrosion power quality filter, heavy-duty APF',
        'ultra-slim-ahf': 'Ultra-Slim AHF, slim active power filter APF, compact 1U AHF module, low-profile harmonic filter, space-saving active harmonic filter, slimline ADF',
        'distributed-ahf': 'Distributed AHF, active dynamic filter ADF, modular active harmonic filter, distributed harmonic compensation unit, cabinet-mounted AHF module, multi-module APF system',
        'rack-mounted-ahf': 'Rack mounted AHF, 19-inch rack active harmonic filter, rack type AHF module, rack-mounted harmonic filter, rack APF module, rack-mounted ADF',
        'ip65-sic-fanless-ahf': 'IP65 SiC AHF, low-noise active harmonic filter, outdoor IP65 AHF module, IP65 fanless harmonic filter, weatherproof SiC AHF, silent AHF module',
        'ip65-ahf': 'IP65 active harmonic filter, weatherproof AHF module, IP65 active power filter APF, IP65 harmonic filter cabinet, outdoor active harmonic filter, waterproof APF module',
        'sic-fanless-ahf': 'SiC-Fanless AHF, fanless active dynamic filter ADF, low-noise SiC AHF, fanless harmonic filter module, silent SiC APF module, natural cooling active harmonic filter',
        'advanced-ahf': 'Advanced AHF, active harmonic filter bank, advanced active power filter APF, harmonic filter panel, advanced harmonic compensation unit, multi-function active harmonic filter',
    }[slug]
    p = p.replace(
        '<strong class="text-text-dark font-bold">Tags</strong> SiC MOSFET AHF, active harmonic filter, active harmonic filter price, power factor correction device, power quality filter, ultra high efficiency AHF',
        '<strong class="text-text-dark font-bold">Tags</strong> ' + tags_text)

    # gallery main + thumb1 (index-product-ahf.webp -> card img)
    p = p.replace('index-product-ahf.webp', img)
    p = p.replace('alt="CHITEK SiC MOSFET Ultra Active Harmonic Filter module"', 'alt="CHITEK %s"' % esc(short))
    p = p.replace('alt="Ultra AHF front view"', 'alt="%s front view"' % esc(short))

    # Configurator
    p = replace_region(p, '<!-- Configurator: checkable voltage / current / connection / installation -->',
                       '          <div class="mb-1">', gen_configurator(cfg))

    # Parameters tbody
    p = replace_region(p, '<tbody>', '</tbody>', gen_params(cfg))

    # Why CHITEK h2
    if plat == 'SiC':
        p = p.replace('WHY CHITEK SiC MOSFET Active Harmonic Filter?', 'WHY CHITEK %s?' % esc(short))
    else:
        p = p.replace('WHY CHITEK SiC MOSFET Active Harmonic Filter?', 'WHY CHITEK Active Harmonic Filter?')
        p = p.replace('The SiC MOSFET bridge is specified for accurate, repeatable harmonic cancellation rather than best-effort filtering.',
                      'The IGBT bridge is specified for accurate, repeatable harmonic cancellation rather than best-effort filtering.')
        # JSON-LD additionalProperty 平台相关值（表格由 gen_params 处理，此处补 JSON-LD）
        p = p.replace('"value": "up to 40 kHz (SiC)"', '"value": "up to 20 kHz (IGBT)"')
        p = p.replace('"value": "≥ 98%"', '"value": "≥ 97%"')
        p = p.replace('"value": "< 1.8% of rated kVA"', '"value": "< 3% of rated kVA"')
        p = p.replace('"value": "3-level NPC, SiC MOSFET"', '"value": "3-level NPC, IGBT"')

    # Feature "Low Thermal Loss" paragraph (IGBT)
    if plat == 'IGBT':
        p = p.replace(
            'SiC switching keeps losses under 1.8% of rated kVA and efficiency at 98% or better, cutting cooling demand.',
            'the IGBT bridge keeps losses low and efficiency at 97% or better, cutting cooling demand.')

    # FAQ: SiC 仅改 h2；IGBT 替换整段 section + FAQPage JSON
    if plat == 'IGBT':
        p = replace_region(p, '<!-- 07 FAQ -->', '</section>', gen_faq_section_igbt(cfg))
        p = replace_script_containing(p, '"@type": "FAQPage"', gen_faq_json_igbt(cfg))
    else:
        p = p.replace('FAQs About the SiC Ultra AHF', 'FAQs About the %s' % esc(short))

    # Related products track
    p = replace_region(p, 'data-rel-track class="flex gap-10 transition-transform duration-500 ease-out">',
                       '          </div>\n        </div>\n        <button type="button" data-rel-next',
                       gen_related(cfg))

    # SKU prefix + download filename
    p = p.replace('CHITEK-SiC-AHF-', cfg['slug'].upper().replace('-', '_') + '_')
    p = p.replace('CHITEK-SiC-AHF-configuration.txt', cfg['slug'].upper().replace('-', '_') + '_configuration.txt')

    # default current in SPECS/DEF
    p = p.replace("var DEF = { v: '400V', a: '100A', i: 'Rack' };",
                  "var DEF = { v: '400V', a: '%s', i: 'Rack' };" % cfg['def_a'])
    # 扩展 SPECS 覆盖本卡电流档（避免 SKU 取 fallback）
    spec_add = {'30A': '{ d: 150, kg: 18 }', '8A': '{ d: 160, kg: 12 }', '20A': '{ d: 150, kg: 16 }'}
    for k, v in spec_add.items():
        needle = "'%s':  { d:" % k
        if needle not in p:
            p = p.replace("'200A':  { d: 118, kg: 38 }\n", "'200A':  { d: 118, kg:38 },\n        '%s':  %s\n" % (k, v))

    # 全局把残留的 sic-ultra-ahf 详情页链接改为本卡 slug（面包屑/JSON 之外的兜底）
    p = p.replace("lp('/products/sic-ultra-ahf')", "lp('/products/%s')" % slug)
    p = p.replace('https://en.chitek-inno.com/products/sic-ultra-ahf', url)

    # 自检：若仍含 sic-ultra-ahf 且不在 ALL9 自身（sic-ultra-ahf 不应出现在新文件）
    if 'sic-ultra-ahf' in p:
        # 允许出现在 Related 之外的仅当为 sic 卡本身；其它卡不应出现
        if slug != 'sic-ultra-ahf' and 'sic-ultra-ahf' in p:
            raise RuntimeError('残留 sic-ultra-ahf 引用: ' + slug)
    return p

# ---------------------------------------------------------------------------
# 生成 8 个详情页
# ---------------------------------------------------------------------------
def main():
    with io.open(TEMPLATE, 'r', encoding='utf-8') as f:
        T = f.read()

    written = []
    for cfg in CARDS:
        page = build_page(T, cfg)
        out = os.path.join(OUTDIR, cfg['slug'] + '.astro')
        with io.open(out, 'w', encoding='utf-8') as f:
            f.write(page)
        written.append(cfg['slug'])
        print('WROTE', out, len(page))

    # ---- 更新 products.astro 网格链接 ----
    with io.open(PRODUCTS, 'r', encoding='utf-8') as f:
        P = f.read()
    for cfg in CARDS:
        img = cfg['img']; slug = cfg['slug']; short = cfg['short']
        idx = P.find('src="/assets/images/%s"' % img)
        if idx < 0:
            print('!! grid img not found', slug); continue
        li_start = P.rfind('<li', 0, idx)
        li_end = P.find('</li>', idx) + len('</li>')
        seg = P[li_start:li_end]
        # 图片链接
        seg = seg.replace('<a href="#"><img src="/assets/images/%s"' % img,
                          "<a href={lp('/products/%s')}><img src=\"/assets/images/%s\"" % (slug, img))
        # h3 链接
        seg = seg.replace('<a href="#" class="hover:text-brand-orange">%s</a>' % esc(short),
                          '<a href={lp(\'/products/%s\')} class="hover:text-brand-orange">%s</a>' % (slug, esc(short)))
        # View More 链接（段内唯一）
        seg = seg.replace('href="#" class="my_more1"', "href={lp('/products/%s')} class=\"my_more1\"" % slug)
        P = P[:li_start] + seg + P[li_end:]
    with io.open(PRODUCTS, 'w', encoding='utf-8') as f:
        f.write(P)
    print('UPDATED', PRODUCTS)

    print('TOTAL_PAGES', len(written))
    print('SLUGS', ','.join(written))

if __name__ == '__main__':
    main()
