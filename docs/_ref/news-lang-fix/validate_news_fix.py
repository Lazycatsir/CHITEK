# -*- coding: utf-8 -*-
"""Validate es/ar news detail pages after fix_news_lang.py (v2, value-aware).

Checks (category/author evaluated as field VALUES, not substrings, to avoid
false positives from case-study names / JSON-LD keywords that contain the words):
  1. no href="#" (hard rule)
  2. application/ld+json present
  3. const SHARE_URL = getHreflang(...) present
  4. every relatedCases item carries href:
  5. no known-bad category VALUE (English-residual / typo)
  6. no known-bad author VALUE (frontmatter + JSON-LD)
  7. aside author renders {article.author}
  8. no CRLF double-CR (\r\r\n) which breaks Tailwind v4
  9. <article>/<section> tags balanced
 10. ogImage uses the correct locale subdomain
"""
import os, re

ROOT = "F:/下载/CHITEK"
BAD_CAT = {
    "es": {"Technology", "Tecnologia", "Actualización de Producto", "Estudio de Caso"},
    "ar": {"Technology", "تكنولوجيا", "تقنية"},
}
BAD_AUTH = {
    "es": {"CHITEK Technical Team", "Equipo Técnico CHITEK", "Equipo Tecnico de CHITEK"},
    "ar": {"FNI CHITEK الفني", "فريق CHITEK الفني"},
}
SUBDOMAIN = {"es": "es.chitek-inno.com", "ar": "ar.chitek-inno.com"}


def check(path, lang):
    with open(path, "rb") as f:
        raw = f.read()
    c = raw.decode("utf-8")
    problems = []
    # 1 href="#"
    if 'href="#"' in c:
        problems.append("href=# present")
    # 2 JSON-LD
    if "application/ld+json" not in c:
        problems.append("missing JSON-LD")
    # 3 SHARE_URL
    if "const SHARE_URL = getHreflang(" not in c:
        problems.append("missing SHARE_URL")
    # 3b real LinkedIn share link present (English template standard)
    if "linkedin.com/sharing/share-offsite" not in c:
        problems.append("missing LinkedIn share link")
    # 4 relatedCases hrefs (as values)
    m = re.search(r"const relatedCases = \[(.*?)\];", c, flags=re.DOTALL)
    if m:
        for it in re.findall(r"\{[^}]*\}", m.group(1)):
            if "href:" not in it:
                problems.append("relatedCases item missing href: " + it[:60])
    else:
        problems.append("relatedCases array not found")
    # 5 bad category VALUES
    for val in re.findall(r'category:\s*"([^"]*)"', c):
        if val in BAD_CAT[lang]:
            problems.append("bad category value: " + val)
    # 6 bad author VALUES (frontmatter + JSON-LD author name)
    for val in re.findall(r'author:\s*"([^"]*)"', c):
        if val in BAD_AUTH[lang]:
            problems.append("bad author value(fm): " + val)
    for val in re.findall(r'"author":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"([^"]*)"', c):
        if val in BAD_AUTH[lang]:
            problems.append("bad author value(jsonld): " + val)
    # 7 aside author -> {article.author}
    if "font-semibold text-text-dark\">{article.author}" not in c:
        problems.append("aside author not using {article.author}")
    # 8 double CR
    if b"\r\r\n" in raw:
        problems.append("CRLF double-CR \\r\\r\\n present")
    # 9 tag balance
    for tag in ("article", "section"):
        o = len(re.findall(r"<%s[\s>]" % tag, c))
        cl = len(re.findall(r"</%s>" % tag, c))
        if o != cl:
            problems.append(f"<{tag}> open={o} close={cl} unbalanced")
    # 10 ogImage subdomain
    for mm in re.finditer(r'ogImage="([^"]*)"', c):
        if SUBDOMAIN[lang] not in mm.group(1):
            problems.append("ogImage wrong subdomain: " + mm.group(1))
    return problems


def main():
    total = 0
    bad = 0
    for lang in ("es", "ar"):
        d = os.path.join(ROOT, "src", "pages", lang, "news")
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".astro") or fn in ("index.astro", "page_[page].astro"):
                continue
            p = os.path.join(d, fn)
            probs = check(p, lang)
            total += 1
            if probs:
                bad += 1
                print(f"FAIL {lang}/{fn}:")
                for pr in probs:
                    print("   -", pr)
    print(f"\nTOTAL={total} FAIL={bad}")


if __name__ == "__main__":
    main()
