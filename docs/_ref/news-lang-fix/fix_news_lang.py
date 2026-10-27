# -*- coding: utf-8 -*-
"""
Align es/ar news detail article pages to the English modern template.

Two cases:
  - "modern" files (already have JSON-LD): targeted fixes:
      1. import getHreflang + define SHARE_URL
      2. fix href="#" share buttons -> real LinkedIn/Twitter share URLs
      3. fix relatedCases: add href + render caseItem.href (instead of hardcoded one article)
      4. normalize category/author to canonical values (NEWS_PIPELINE §〇 0.6/0.7)
  - "old" files (no JSON-LD): full rebuild -> add JSON-LD, ogImage, brand-orange theme,
    dateDisplay, sidebar, working share buttons, proper back link.

Backs up every touched file to docs/_ref/news-lang-fix/backups/ and preserves CRLF.
"""
import os, re, sys, datetime, shutil

ROOT = "F:/下载/CHITEK"
SRC = os.path.join(ROOT, "src", "pages")
DATA = os.path.join(ROOT, "src", "data")
BACKUP_DIR = os.path.join(ROOT, "docs", "_ref", "news-lang-fix", "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)
TS = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

# ---- canonical normalisation maps (only known-bad -> canonical) ----
# Spanish
ES_CAT = {
    "Technology": "Tecnología",                 # English residual
    "Tecnologia": "Tecnología",                 # missing accent
    "Actualización de Producto": "Actualización de producto",  # capitalisation
    "Estudio de Caso": "Caso de Estudio",       # defensive
}
ES_AUTH = {
    "CHITEK Technical Team": "Equipo Técnico de CHITEK",   # English residual
    "Equipo Técnico CHITEK": "Equipo Técnico de CHITEK",   # missing "de"
    "Equipo Tecnico de CHITEK": "Equipo Técnico de CHITEK",  # missing accent
    # NOTE: "Equipo de I+D de CHITEK" (R&D) and "Equipo Editorial de CHITEK"
    #       (Editorial) are legitimate distinct teams -> left untouched.
}
# Arabic
AR_CAT = {
    "Technology": "التكنولوجيا",   # defensive
    "تكنولوجيا": "التكنولوجيا",
    "تقنية": "التكنولوجيا",
}
AR_AUTH = {
    "FNI CHITEK الفني": "الفريق الفني لـ CHITEK",
    "فريق CHITEK الفني": "الفريق الفني لـ CHITEK",
    # NOTE: "الفريق التحريري لـ CHITEK" (Editorial) is legitimate -> untouched.
}

ICON = "M13 10V3L4 14h7v7l9-11h-7z"

# standard relatedProducts (translated) per language
PRODUCTS = {
    "es": [
        {"name": "Filtro Activo de Armónicos AHF", "href": "/es/products#ahf"},
        {"name": "Generador Estático de Var SVG", "href": "/es/products-svg#svg"},
        {"name": "SiC-AHF/SVG de Alta Eficiencia", "href": "/es/products-asvg#sic"},
    ],
    "ar": [
        {"name": "المرشح النشط للتوافقيات AHF", "href": "/ar/products#ahf"},
        {"name": "مولد التيار المتغير الثابت SVG", "href": "/ar/products-svg#svg"},
        {"name": "SiC-AHF/SVG الكفاءة العالية", "href": "/ar/products-asvg#sic"},
    ],
}

# standard relatedCases (translated) -> existing case-study articles
CASES = {
    "es": [
        {"name": "Optimización de la Calidad de Energía en Granja Solar en Dubái", "industry": "Energía Renovable", "href": "/es/news/solar-farm-dubai"},
        {"name": "Actualización de los Estándares de Calidad de Energía de Arabia Saudita", "industry": "Fabricación", "href": "/es/news/saudi-arabia-standards"},
        {"name": "Estudio de Caso: AHF de 300A Restaura Bancos de Capacitores en un Centro de Datos", "industry": "Centros de Datos", "href": "/es/news/blog-data-center-ahf-case-study"},
    ],
    "ar": [
        {"name": "تحسين جودة الطاقة في مزرعة دبي الشمسية 50 ميجاوات", "industry": "الطاقة المتجددة", "href": "/ar/news/solar-farm-dubai"},
        {"name": "تحديث معايير جودة الطاقة السعودية", "industry": "التصنيع", "href": "/ar/news/saudi-arabia-standards"},
        {"name": "دراسة حالة: AHF بقدرة 300 أمبير يستعيد بنوك المكثفات في مركز بيانات", "industry": "مراكز البيانات", "href": "/ar/news/blog-data-center-ahf-case-study"},
    ],
}

# standard otherArticles (translated titles resolved from data file) slugs
OTHER_SLUGS = ["active-vs-passive-harmonic-filters", "sic-technology-redefines-ahf", "conformal-coating-ahf-reliability"]

SIDEBAR_LABELS = {
    "es": {"more": "Más Artículos", "prod": "Productos Relacionados", "cases": "Casos de Clientes"},
    "ar": {"more": "مقالات أخرى", "prod": "منتجات ذات صلة", "cases": "حالات العملاء"},
}
SHARE_LABEL = {"es": "Compartir:", "ar": "مشاركة:"}
PUBLISHED_LABEL = {"es": "Publicado {article.dateDisplay}", "ar": "نُشر {article.dateDisplay}"}

DOMAIN = {"es": "https://es.chitek-inno.com", "ar": "https://ar.chitek-inno.com"}


def load_titles(lang):
    path = os.path.join(DATA, f"{lang}NewsCards.js")
    with open(path, encoding="utf-8") as f:
        t = f.read()
    titles = {}
    for m in re.finditer(r'"href":\s*"/news/([^"]+)"[^}]*"title":\s*"([^"]*)"', t):
        titles[m.group(1)] = m.group(2)
    return titles


def backup(path):
    rel = os.path.relpath(path, ROOT)
    dest = os.path.join(BACKUP_DIR, TS, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(path, dest)
    return dest


def normalize(content, lang):
    cat_map = ES_CAT if lang == "es" else AR_CAT
    auth_map = ES_AUTH if lang == "es" else AR_AUTH
    # category: normalise EVERY occurrence (frontmatter + otherArticles array)
    content = re.sub(r'(category:\s*")([^"]*)(")',
                    lambda m: m.group(1) + cat_map.get(m.group(2), m.group(2)) + m.group(3),
                    content)
    # frontmatter author (single occurrence in frontmatter)
    content = re.sub(r'(author:\s*")([^"]*)(")',
                    lambda m: m.group(1) + auth_map.get(m.group(2), m.group(2)) + m.group(3),
                    content, count=1)
    # JSON-LD author name
    content = re.sub(r'("author":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*")([^"]*)(")',
                    lambda m: m.group(1) + auth_map.get(m.group(2), m.group(2)) + m.group(3),
                    content, count=1)
    return content


def fix_aside_author(content):
    # Replace the hard-coded aside author with the single source of truth
    # {article.author}. Target the author element by its class + literal
    # (non-{expr}, non-tag) content; the other font-semibold text-text-dark
    # elements render {item.title}/{product.name}/{caseItem.name} (contain '{')
    # so they are excluded. Covers both <div> and <p> author wrappers.
    content = re.sub(
        r'(font-semibold text-text-dark">)[^<{]*?(</(?:div|p)>)',
        r'\1{article.author}\2',
        content)
    return content


def add_hreflang_and_share(content, lang):
    nl = "\r\n" if "\r\n" in content else "\n"
    # add import
    if "getHreflang" not in content:
        content = content.replace(
            "import Sidebar from '../../../components/Sidebar.astro';",
            "import Sidebar from '../../../components/Sidebar.astro';" + nl +
            "import { getHreflang } from '../../../i18n/index';",
            1)
    # add SHARE_URL before the frontmatter-closing '---' (file may be CRLF or LF)
    if "SHARE_URL" not in content:
        content = re.sub(r"(\r?\n---\r?\n)",
                         f"{nl}const SHARE_URL = getHreflang('{lang}', Astro.url.pathname);{nl}---{nl}",
                         content, count=1)
    return content


def fix_share_links(content, lang):
    if 'href="#"' not in content:
        return content

    def repl(m):
        inner = m.group(0)
        if "M16 8a6" in inner:
            label = "Share on LinkedIn"
            link = "https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}"
        elif "M22.46" in inner:
            label = "Share on Twitter"
            link = "https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(article.title)}"
        else:
            return inner
        return (f'<a href={{`{link}`}} target="_blank" rel="noopener noreferrer" '
                f'aria-label="{label}"{m.group(1)}>{m.group(2)}</a>')

    content = re.sub(r'<a href="#"([^>]*)>(.*?)</a>', repl, content, flags=re.DOTALL)
    return content


def fix_related_cases(content, lang):
    cases = CASES[lang]
    arr_lines = ",\n".join(
        f'  {{ name: "{c["name"]}", industry: "{c["industry"]}", href: "{c["href"]}" }}' for c in cases)
    arr = f"const relatedCases = [\n{arr_lines}\n];"
    content = re.sub(r"const relatedCases = \[.*?\];", arr, content, count=1, flags=re.DOTALL)
    # aside render: any anchor whose children render {{caseItem.name}} -> use caseItem.href
    # (language-agnostic; covers whatever article was hard-coded before)
    content = re.sub(
        r'<a href="/(?:es|ar)/news/[^"]*"([^>]*)>(.*?\{caseItem\.name\}.*?)</a>',
        r'<a href={caseItem.href}\1>\2</a>',
        content, flags=re.DOTALL)
    return content


def fix_modern(path, lang, titles):
    with open(path, "r", newline="", encoding="utf-8") as f:
        content = f.read()
    if "application/ld+json" not in content:
        return False  # old file -> handled separately
    before = content
    content = add_hreflang_and_share(content, lang)
    content = fix_share_links(content, lang)
    content = fix_related_cases(content, lang)
    content = normalize(content, lang)
    content = fix_aside_author(content)
    if content != before:
        backup(path)
        with open(path, "w", newline="", encoding="utf-8") as f:
            f.write(content)
    return content != before


def build_old(path, lang, titles):
    with open(path, "r", newline="", encoding="utf-8") as f:
        content = f.read()
    slug = os.path.splitext(os.path.basename(path))[0]

    # ---- frontmatter ----
    fm_match = re.search(r"^---\r?\n(.*?)\r?\n---\r?\n", content, flags=re.DOTALL)
    fm = fm_match.group(1)
    # article object
    art_match = re.search(r"const article = \{(.*?)\r?\n\};", fm, flags=re.DOTALL)
    art_body = art_match.group(1)
    # parse fields
    def field(name):
        m = re.search(rf'{name}:\s*"([^"]*)"', art_body)
        return m.group(1) if m else ""
    title = field("title"); category = field("category"); date = field("date")
    dateDisplay = field("dateDisplay"); description = field("description")
    author = field("author"); readTime = field("readTime")
    kw_m = re.search(r"keywords:\s*\[(.*?)\]", art_body, flags=re.DOTALL)
    keywords = [k.strip().strip('"') for k in kw_m.group(1).split(",")] if kw_m else []
    # normalize category/author
    cat_map = ES_CAT if lang == "es" else AR_CAT
    auth_map = ES_AUTH if lang == "es" else AR_AUTH
    category = cat_map.get(category, category)
    author = auth_map.get(author, author)

    # otherArticles standard 3
    other = []
    for s in OTHER_SLUGS:
        other.append({"title": titles.get(s, s), "category": category, "href": f"/{lang}/news/{s}", "color": "orange"})
    products = PRODUCTS[lang]
    cases = CASES[lang]

    fm_new = (
        "const article = {\n"
        f'  title: "{title}",\n'
        f'  category: "{category}",\n'
        f'  date: "{date}",\n'
        f'  dateDisplay: "{dateDisplay}",\n'
        f'  description: "{description}",\n'
        f'  author: "{author}",\n'
        f'  readTime: "{readTime}",\n'
        f'  keywords: [{", ".join(chr(34)+k+chr(34) for k in keywords)}]\n'
        "};\n\n"
        "const otherArticles = [\n"
        + ",\n".join(f'  {{ title: "{o["title"]}", category: "{o["category"]}", href: "{o["href"]}", color: "orange" }}' for o in other)
        + "\n];\n\n"
        "const relatedProducts = [\n"
        + ",\n".join(f'  {{ name: "{p["name"]}", href: "{p["href"]}", icon: "{ICON}" }}' for p in products)
        + "\n];\n\n"
        "const relatedCases = [\n"
        + ",\n".join(f'  {{ name: "{c["name"]}", industry: "{c["industry"]}", href: "{c["href"]}" }}' for c in cases)
        + "\n];\n\n"
        f"const SHARE_URL = getHreflang('{lang}', Astro.url.pathname);\n"
    )

    # ---- body extraction (featured image -> end of SEO keywords) ----
    start = content.index('<div class="w-full h-64')
    end_marker = '<div class="flex flex-col md:flex-row items-center justify-between mt-16'
    end = content.index(end_marker)
    body = content[start:end]  # featured img + prose + seo keywords

    # hero fixes
    hero = content[content.index("<section class=\"pt-[72px]"):]
    hero = hero[:hero.index("</section>") + len("</section>")]
    hero = hero.replace("from-purple-500/20", "from-brand-orange/20")
    hero = hero.replace("text-purple-600 bg-purple-500/20", "text-brand-orange bg-brand-orange/20")
    hero = hero.replace("text-purple-400", "text-brand-orange")
    hero = hero.replace("{article.date}", "{article.dateDisplay}")
    hero = hero.replace("max-w-4xl mx-auto px-5 md:px-12 py-16 md:py-24",
                        "max-w-7xl mx-auto px-5 md:px-12 py-16 md:py-20")
    if lang == "ar":
        # RTL: flip back-link arrow to point right
        hero = hero.replace('<path d="M19 12H5M12 19l-7-7 7-7"/>', '<path d="M5 12h14M12 5l7 7-7 7"/>')

    # author + share block
    share = build_share_block(lang)
    article_inner = body + "\n" + share + "\n      </article>\n"

    aside = build_aside(lang)

    new_content = (
        "---\n"
        "import BaseLayout from '../../../layouts/BaseLayout.astro';\n"
        "import { getHreflang } from '../../../i18n/index';\n"
        "import Sidebar from '../../../components/Sidebar.astro';\n\n"
        + fm_new
        + "---\n"
        f'<BaseLayout title={{`${{article.title}} | CHITEK INNOPOWER`}} description="{description}" lang="{lang}"\n'
        '  ogType="article"\n'
        f'  ogTitle={{article.title}}\n'
        f'  ogDescription={{article.description}}\n'
        f'  ogImage="{DOMAIN[lang]}/assets/images/index-product-ahf.webp"\n'
        '  alternateLangs={[\'zh\', \'en\', \'es\', \'ar\']}\n'
        ">\n"
        "  <!-- Schema.org Article Structured Data -->\n"
        '  <script type="application/ld+json" slot="head">\n'
        "  {\n"
        '    "@context": "https://schema.org",\n'
        '    "@type": "Article",\n'
        f'    "headline": "{title}",\n'
        f'    "description": "{description}",\n'
        f'    "image": "{DOMAIN[lang]}/assets/images/index-product-ahf.webp",\n'
        '    "author": { "@type": "Organization", "name": "' + author + '" },\n'
        '    "publisher": { "@type": "Organization", "name": "CHITEK INNOPOWER", "logo": { "@type": "ImageObject", "url": "'
        + DOMAIN[lang] + '/assets/images/logo.webp" } },\n'
        f'    "datePublished": "{date}",\n'
        f'    "dateModified": "{date}",\n'
        '    "keywords": "' + ", ".join(keywords) + '"\n'
        "  }\n"
        "  </script>\n\n"
        f'  <Sidebar lang="{lang}" />\n\n'
        + hero + "\n\n"
        '  <section class="py-12 md:py-16 bg-white">\n'
        '    <div class="max-w-7xl mx-auto px-5 md:px-12 flex flex-col lg:flex-row gap-10">\n'
        '      <article class="flex-1 max-w-4xl">\n'
        + article_inner
        + "\n      " + aside.strip("\n") + "\n"
        "    </div>\n"
        "  </section>\n"
        "</BaseLayout>\n"
    )
    # normalise whole file to CRLF (old source is LF; project convention is CRLF)
    new_content = new_content.replace("\r\n", "\n").replace("\n", "\r\n")
    backup(path)
    with open(path, "w", newline="", encoding="utf-8") as f:
        f.write(new_content)
    return True


def build_share_block(lang):
    return (
        '        <div class="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 border-t border-border-light">\n'
        '          <div class="flex items-center gap-4 mb-4 md:mb-0">\n'
        '            <div class="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center">\n'
        '              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6 text-brand-orange">\n'
        '                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>\n'
        "              </svg>\n"
        "            </div>\n"
        "            <div>\n"
        f'              <div class="font-semibold text-text-dark">{{article.author}}</div>\n'
        f'              <div class="text-sm text-text-muted">{PUBLISHED_LABEL[lang]}</div>\n'
        "            </div>\n"
        "          </div>\n"
        '          <div class="flex items-center gap-3">\n'
        f'            <span class="text-sm text-text-muted">{SHARE_LABEL[lang]}</span>\n'
        '            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" class="w-9 h-9 rounded border border-border-light flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors">\n'
        '              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>\n'
        "            </a>\n"
        '            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" class="w-9 h-9 rounded border border-border-light flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors">\n'
        '              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>\n'
        "            </a>\n"
        '            <a href="https://www.facebook.com/profile.php?id=61579260405315" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded border border-border-light flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors">\n'
        '              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>\n'
        "            </a>\n"
        "          </div>\n"
        "        </div>"
    )


def build_aside(lang):
    labels = SIDEBAR_LABELS[lang]
    return (
        '      <aside class="lg:w-[320px] shrink-0">\n'
        '        <div class="lg:sticky lg:top-[88px] space-y-4">\n'
        '          <div class="bg-gray-50 rounded-xl p-4">\n'
        f'            <h3 class="font-bold text-text-dark mb-3 flex items-center gap-2">\n'
        '              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-brand-orange">\n'
        '                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>\n'
        "              </svg>\n"
        f"              {labels['more']}\n"
        "            </h3>\n"
        '            <div class="space-y-2">\n'
        "              {otherArticles.map((item) => (\n"
        '                <a href={item.href} class="block p-2.5 bg-white rounded-lg border border-border-light hover:border-brand-orange hover:shadow-sm transition-all no-underline">\n'
        '                  <div class="text-sm font-semibold text-text-dark leading-snug">{item.title}</div>\n'
        "                </a>\n"
        "              ))}\n"
        "            </div>\n"
        "          </div>\n"
        '          <div class="bg-gray-50 rounded-xl p-4">\n'
        f'            <h3 class="font-bold text-text-dark mb-3 flex items-center gap-2">\n'
        '              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-brand-orange">\n'
        '                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>\n'
        "              </svg>\n"
        f"              {labels['prod']}\n"
        "            </h3>\n"
        '            <div class="space-y-2">\n'
        "              {relatedProducts.map((product) => (\n"
        '                <a href={product.href} class="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-border-light hover:border-brand-orange hover:shadow-sm transition-all no-underline">\n'
        '                  <div class="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center shrink-0">\n'
        '                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4 text-brand-orange">\n'
        "                      <path d={product.icon}/>\n"
        "                    </svg>\n"
        "                  </div>\n"
        '                  <div class="flex-1 min-w-0">\n'
        '                    <div class="text-sm font-semibold text-text-dark truncate">{product.name}</div>\n'
        "                  </div>\n"
        '                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-text-muted shrink-0">\n'
        '                    <path d="M9 5l7 7-7 7"/>\n'
        "                  </svg>\n"
        "                </a>\n"
        "              ))}\n"
        "            </div>\n"
        "          </div>\n"
        '          <div class="bg-gray-50 rounded-xl p-4">\n'
        f'            <h3 class="font-bold text-text-dark mb-3 flex items-center gap-2">\n'
        '              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-brand-orange">\n'
        '                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>\n'
        "              </svg>\n"
        f"              {labels['cases']}\n"
        "            </h3>\n"
        '            <div class="space-y-2">\n'
        "              {relatedCases.map((caseItem) => (\n"
        '                <a href={caseItem.href} class="block p-2.5 bg-white rounded-lg border border-border-light hover:border-brand-orange hover:shadow-sm transition-all no-underline">\n'
        '                  <div class="text-sm font-semibold text-text-dark">{caseItem.name}</div>\n'
        '                  <div class="text-xs text-text-muted mt-1">{caseItem.industry}</div>\n'
        "                </a>\n"
        "              ))}\n"
        "            </div>\n"
        "          </div>\n"
        "        </div>\n"
        "      </aside>"
    )


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "dry"
    write = mode == "write"
    titles = {lang: load_titles(lang) for lang in ("es", "ar")}
    summary = {"modern_fixed": 0, "old_rebuilt": 0, "skipped": 0, "errors": []}
    for lang in ("es", "ar"):
        d = os.path.join(SRC, lang, "news")
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".astro"):
                continue
            if fn in ("index.astro", "page_[page].astro"):
                continue
            path = os.path.join(d, fn)
            try:
                with open(path, "r", newline="", encoding="utf-8") as f:
                    content = f.read()
                if "application/ld+json" in content:
                    changed = fix_modern(path, lang, titles[lang]) if write else (False,)
                    if write:
                        if changed:
                            summary["modern_fixed"] += 1
                    else:
                        # dry: would it change?
                        sim = add_hreflang_and_share(content, lang)
                        sim = fix_share_links(sim, lang)
                        sim = fix_related_cases(sim, lang)
                        sim = normalize(sim, lang)
                        if sim != content:
                            summary["modern_fixed"] += 1
                else:
                    if write:
                        build_old(path, lang, titles[lang])
                        summary["old_rebuilt"] += 1
                    else:
                        summary["old_rebuilt"] += 1
            except Exception as e:
                summary["errors"].append((path, repr(e)))
    print("MODE:", mode)
    print("modern_fixed:", summary["modern_fixed"])
    print("old_rebuilt:", summary["old_rebuilt"])
    print("errors:", summary["errors"])


if __name__ == "__main__":
    main()
