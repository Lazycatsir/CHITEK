# -*- coding: utf-8 -*-
"""
Second-pass fix for the 10 "p-variant" es/ar news detail pages.

Those pages already have JSON-LD / SHARE_URL / sidebar / relatedCases, but their
share block is a single non-functional <button aria-label="Share"> (no real
LinkedIn / Twitter / Facebook links) and the author block shows read time instead
of the publish date. The English template has 3 real share links + "Published
{dateDisplay}". This script aligns them.

Backs up every touched file under docs/_ref/news-lang-fix/backups/<ts>/.
"""
import os, re, sys, datetime, shutil

ROOT = "F:/下载/CHITEK"
SRC = os.path.join(ROOT, "src", "pages")
BACKUP_DIR = os.path.join(ROOT, "docs", "_ref", "news-lang-fix", "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)
TS = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

PUBLISHED = {"es": "Publicado {article.dateDisplay}", "ar": "نُشر {article.dateDisplay}"}

SVG_LINKEDIN = ('<svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">'
               '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>'
               '<rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>')
SVG_TWITTER = ('<svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">'
              '<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>')
SVG_FACEBOOK = ('<svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">'
               '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>')


def share_block(nl):
    a_li = ('<a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`} '
            'target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" '
            'class="w-9 h-9 rounded border border-border-light flex items-center justify-center '
            'hover:border-brand-orange hover:text-brand-orange transition-colors">' + nl +
            '  ' + SVG_LINKEDIN + nl + '</a>')
    a_tw = ('<a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(article.title)}`} '
            'target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" '
            'class="w-9 h-9 rounded border border-border-light flex items-center justify-center '
            'hover:border-brand-orange hover:text-brand-orange transition-colors">' + nl +
            '  ' + SVG_TWITTER + nl + '</a>')
    a_fb = ('<a href="https://www.facebook.com/profile.php?id=61579260405315" '
            'target="_blank" rel="noopener noreferrer" '
            'class="w-9 h-9 rounded border border-border-light flex items-center justify-center '
            'hover:border-brand-orange hover:text-brand-orange transition-colors">' + nl +
            '  ' + SVG_FACEBOOK + nl + '</a>')
    return a_li + nl + a_tw + nl + a_fb


def backup(path):
    rel = os.path.relpath(path, ROOT)
    dest = os.path.join(BACKUP_DIR, TS, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(path, dest)
    return dest


def fix(path, lang):
    with open(path, "r", newline="", encoding="utf-8") as f:
        content = f.read()
    if "application/ld+json" not in content:
        return False  # not a detail page we care about
    if 'linkedin.com/sharing/share-offsite' in content:
        return False  # already has real LinkedIn share -> nothing to do
    if '&#x2197;' not in content:
        return False  # no share-arrow button -> not the p-variant we target
    nl = "\r\n" if "\r\n" in content else "\n"
    before = content
    # 1) replace the lone share <button> (carries the &#x2197; arrow) with 3 real share links
    content = re.sub(r'<button[^>]*>.*?&#x2197;.*?</button>',
                    share_block(nl), content, flags=re.DOTALL)
    # 2) author block: read time -> publish date (match on {article.author} anchor)
    content = re.sub(
        r'(<p class="font-semibold text-text-dark">\{article\.author\}</p>\s*'
        r'<p class="text-sm text-text-muted">)[^<]*(</p>)',
        lambda m: m.group(1) + PUBLISHED[lang] + m.group(2),
        content)
    if content != before:
        backup(path)
        with open(path, "w", newline="", encoding="utf-8") as f:
            f.write(content)
        return True
    return False


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "write"
    changed = []
    for lang in ("es", "ar"):
        d = os.path.join(SRC, lang, "news")
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".astro") or fn in ("index.astro", "page_[page].astro"):
                continue
            p = os.path.join(d, fn)
            if mode == "write":
                if fix(p, lang):
                    changed.append(f"{lang}/{fn}")
            else:
                with open(p, "r", newline="", encoding="utf-8") as f:
                    c = f.read()
                if ("application/ld+json" in c and '&#x2197;' in c
                        and 'linkedin.com/sharing/share-offsite' not in c):
                    changed.append(f"{lang}/{fn}")
    print("MODE:", mode)
    print("would/maybe change:", len(changed))
    for x in changed:
        print("  ", x)


if __name__ == "__main__":
    main()
