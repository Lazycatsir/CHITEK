# -*- coding: utf-8 -*-
"""
从各语言「文章页自身的 article 元数据」生成新闻列表数据文件。

    src/pages/news/*.astro             -> src/data/zhNewsCards.js
    src/pages/en/news/*.astro          -> src/data/enNewsCards.js
    src/pages/es/news/*.astro          -> src/data/esNewsCards.js
    src/pages/ar/news/*.astro          -> src/data/arNewsCards.js

新增一篇文章 = 写 4 语 .astro（同一 slug）→ 跑本脚本。
列表页与分页页【不需要改动】：它们从数据文件读 NEWS_TOTAL_PAGES，页数会自动增加。

用法：
    python _extract_all_news.py                  # 严格：四语 slug 集合必须一致，否则退出码 1
    python _extract_all_news.py --allow-partial  # 翻译未完成时放行（仅警告）

字段：cat(分类键) / href / img / alt / category(原文分类名) / date(dateDisplay) / title / desc
额外导出 NEWS_PER_PAGE、NEWS_TOTAL_PAGES（Astro 的 getStaticPaths 只能用 import 的值）。
"""
import hashlib
import html as htmlmod
import json
import pathlib
import re
import sys
from collections import Counter

BASE = pathlib.Path(__file__).resolve().parent
ROOT = BASE / "src" / "pages"
OUT = BASE / "src" / "data"

LANGS = [
    ("zh", "news"),
    ("en", "en/news"),
    ("es", "es/news"),
    ("ar", "ar/news"),
]

CAT_MAP = {
    "zh": {"技术": "tech", "案例研究": "case", "产品更新": "product", "行业动态": "industry", "可持续发展": "sustain"},
    "en": {"Technology": "tech", "Case Study": "case", "Product Update": "product", "Industry News": "industry", "Sustainability": "sustain"},
    "es": {
        "Tecnología": "tech", "Tecnologia": "tech", "Technology": "tech",
        "Caso de Estudio": "case", "Estudio de Caso": "case",
        "Actualización de Producto": "product", "Actualización de producto": "product",
        "Noticias del Sector": "industry",
        "Sostenibilidad": "sustain",
    },
    "ar": {
        "تكنولوجيا": "tech", "التكنولوجيا": "tech", "تقنية": "tech",
        "دراسة حالة": "case",
        "تحديث المنتج": "product",
        "أخبار الصناعة": "industry",
        "الاستدامة": "sustain",
    },
}

PER_PAGE = 10
FALLBACK_IMGS = ["/assets/images/news/news-img-%d.webp" % i for i in range(1, 9)]

MONTHS_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTHS_ES = ["", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

# 正文里的特色图（第一张 news/ 或 blog/ 图片即为卡片配图）
IMG_RE = re.compile(r'<img[^>]+src="(/assets/images/(?:news|blog)/[^"]+)"')
# BaseLayout 上的 description="..."（article.description 缺失时的兜底来源）
LAYOUT_DESC_RE = re.compile(r'\bdescription="([^"]*)"')

ALLOW_PARTIAL = "--allow-partial" in sys.argv

warnings = []


def article_block(s):
    """花括号配对取出 `const article = { ... }`，避免字段正则漏进正文。"""
    m = re.search(r"const\s+article\s*=\s*\{", s)
    if not m:
        return ""
    start = m.end() - 1
    depth = 0
    for i in range(start, len(s)):
        if s[i] == "{":
            depth += 1
        elif s[i] == "}":
            depth -= 1
            if depth == 0:
                return s[start:i + 1]
    return s[start:]


def field(block, name):
    """取字段值；同时容忍双引号与单引号写法。"""
    m = re.search(r"\b%s\s*:\s*(?:\"([^\"]*)\"|'([^']*)')" % name, block)
    if not m:
        return ""
    v = m.group(1) if m.group(1) is not None else m.group(2)
    return htmlmod.unescape(v).strip()


def fallback_img(slug):
    """按 slug 哈希选兜底配图：稳定，新增文章不会打乱其他文章的图。"""
    h = int(hashlib.md5(slug.encode("utf-8")).hexdigest(), 16)
    return FALLBACK_IMGS[h % len(FALLBACK_IMGS)]


def article_files(d):
    return [p for p in sorted(d.glob("*.astro")) if not p.name.startswith("page_") and p.stem != "index"]


slug_sets = {}
results = {}
errors = []

for lang, rel in LANGS:
    d = ROOT / rel
    items = []
    slugs = set()
    for p in article_files(d):
        s = p.read_text(encoding="utf-8")
        slugs.add(p.stem)
        blk = article_block(s)
        if not blk:
            errors.append("%s: 找不到 `const article = { ... }` 块" % p.as_posix())
            continue

        title = field(blk, "title")
        category = field(blk, "category")
        date = field(blk, "date")
        date_display = field(blk, "dateDisplay")
        desc = field(blk, "description")

        if not title:
            errors.append("%s: article.title 缺失" % p.as_posix())
            continue
        if not date:
            errors.append("%s: article.date 缺失" % p.as_posix())
            continue
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
            errors.append("%s: article.date 必须是 yyyy-mm-dd，实际 %r" % (p.as_posix(), date))
            continue

        if not category:
            warnings.append("%s: article.category 缺失 → 卡片分类回落为 tech" % p.as_posix())

        if not date_display:
            y, mo, dd = date.split("-")
            if lang == "zh":
                date_display = "%s年%d月%d日" % (y, int(mo), int(dd))
            elif lang == "en":
                date_display = "%s %s, %s" % (MONTHS_EN[int(mo)], dd, y)
            elif lang == "es":
                date_display = "%s %s %s" % (dd, MONTHS_ES[int(mo)], y)
            else:
                date_display = "%s/%s/%s" % (dd, mo, y)
            warnings.append("%s: article.dateDisplay 缺失 → 已按 ISO 日期推导为 %r" % (p.as_posix(), date_display))

        if not desc:
            m = LAYOUT_DESC_RE.search(s)
            desc = htmlmod.unescape(m.group(1)).strip() if m else ""
            warnings.append(
                "%s: article.description 缺失 → 已回落到 <BaseLayout description>%s"
                % (p.as_posix(), "" if desc else "（也没找到，卡片摘要会是空白！）")
            )

        m = IMG_RE.search(s)
        img = m.group(1) if m else fallback_img(p.stem)
        if not m:
            warnings.append("%s: 正文无 news/blog 配图 → 使用兜底图 %s" % (p.as_posix(), img))

        items.append({
            "cat": CAT_MAP[lang].get(category, "tech"),
            # 不带语言前缀：页面用 lp() 在本地补前缀、线上走子域映射
            "href": "/news/" + p.stem,
            "img": img,
            "alt": title,
            "category": category,
            "date": date_display,
            "title": title,
            "desc": desc,
            "_sort": date,
        })

    items.sort(key=lambda x: (x["_sort"], x["href"]), reverse=True)
    for it in items:
        del it["_sort"]

    if not items:
        errors.append("%s: 一篇都没解析出来（目录 %s）" % (lang, d.as_posix()))
        continue

    slug_sets[lang] = slugs
    results[lang] = items

# ---------- 四语 slug 集合一致性（流水线第一大故障：翻译没同步） ----------
base_lang = "zh"
base = slug_sets.get(base_lang, set())
print()
mismatch = False
for lang, _ in LANGS:
    if lang == base_lang or lang not in slug_sets:
        continue
    only = sorted(slug_sets[lang] - base)
    miss = sorted(base - slug_sets[lang])
    if only or miss:
        mismatch = True
        print("!! %s 与 %s 不一致  多出=%s  缺少=%s" % (lang, base_lang, only or "-", miss or "-"))

if mismatch:
    msg = "四语文章集合不一致：每个 slug 必须在 zh/en/es/ar 四边都存在（同 slug 四份 .astro）。"
    if ALLOW_PARTIAL:
        print("警告：" + msg + "（--allow-partial 已放行）")
    else:
        print("错误：" + msg)
        errors.append(msg)
else:
    print("四语文章集合一致：各 %d 篇，slug 完全相同" % len(base))

# ---------- 汇总 ----------
if warnings:
    print("\n--- 警告 %d 条（不阻断，但建议修掉正文数据）---" % len(warnings))
    for w in warnings:
        print("  * " + w)

if errors:
    print("\n--- 错误 %d 条（未写出任何数据文件，避免半截数据上线）---" % len(errors))
    for e in errors:
        print("  x " + e)
    sys.exit(1)

# ---------- 全部校验通过后才落盘 ----------
print()
for lang, _ in LANGS:
    items = results[lang]
    body = ",\n".join("  " + json.dumps(it, ensure_ascii=False) for it in items)
    txt = (
        "// Auto-generated by _extract_all_news.py from each article's own `article` metadata.\n"
        "// %s news list: %d cards per page.\n" % (lang, PER_PAGE)
        + "export const %sNewsCards = [\n" % lang
        + body
        + ",\n];\n\n"
        "export const NEWS_PER_PAGE = %d;\n" % PER_PAGE
        + "export const NEWS_TOTAL_PAGES = Math.ceil(%sNewsCards.length / NEWS_PER_PAGE);\n\n" % lang
        + "export default %sNewsCards;\n" % lang
    )
    (OUT / ("%sNewsCards.js" % lang)).write_text(txt, encoding="utf-8", newline="\n")
    pages = -(-len(items) // PER_PAGE)
    print("%-3s %3d 篇 -> %d 页 | %s" % (lang, len(items), pages, dict(Counter(i["cat"] for i in items))))
    print("      最新: %s | %s" % (items[0]["date"], items[0]["title"][:52]))
    print("      最旧: %s | %s" % (items[-1]["date"], items[-1]["title"][:52]))

print("\nOK：已写出 src/data/{zh,en,es,ar}NewsCards.js")
