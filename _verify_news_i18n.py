# -*- coding: utf-8 -*-
"""新闻流水线验证闸门（唯一的新闻校验入口）。

用法：
    python _verify_news_i18n.py
        离线结构检查：不需要 dev server。核对文章文件 ↔ 数据文件 ↔ 列表页/分页页三者自洽。

    python _verify_news_i18n.py --http http://localhost:4321
        在上面基础上追加在线渲染检查：每页 200、卡片数、hreflang、canonical、扁平 URL、无 pt 死链。

改动新闻后请跑本脚本；它替代了旧的"硬编码 3 页 + 固定端口 4324"版本。
"""
import argparse
import math
import pathlib
import re
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
PAGES = ROOT / "src" / "pages"
DATA = ROOT / "src" / "data"

# (lang, 文章目录(相对 src/pages), URL 前缀, 列表页文件, 分页页文件)
LANGS = [
    ("zh", "news", "", "news.astro", "news/page_[page].astro"),
    ("en", "en/news", "/en", "en/news.astro", "en/news/page_[page].astro"),
    ("es", "es/news", "/es", "es/news/index.astro", "es/news/page_[page].astro"),
    ("ar", "ar/news", "/ar", "ar/news/index.astro", "ar/news/page_[page].astro"),
]

REQUIRED_ARTICLE_FIELDS = ("title", "category", "date", "dateDisplay", "description")

results = []


def check(ok, label, detail=""):
    results.append((bool(ok), label, detail))
    print("%s %s%s" % ("[OK]  " if ok else "[FAIL]", label, ("  <- " + detail) if detail else ""))
    return ok


def warn(label, detail=""):
    print("[WARN] %s%s" % (label, ("  <- " + detail) if detail else ""))


def article_files(d):
    return [p for p in sorted(d.glob("*.astro")) if not p.name.startswith("page_") and p.stem != "index"]


def article_block(s):
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
    m = re.search(r"\b%s\s*:\s*(?:\"([^\"]*)\"|'([^']*)')" % name, block)
    if not m:
        return ""
    return (m.group(1) if m.group(1) is not None else m.group(2)).strip()


def parse_cards(text):
    """从数据文件里取出卡片对象数组。"""
    m = re.search(r"export const \w+NewsCards = \[(.*?)\n\];", text, re.S)
    if not m:
        return None
    out = []
    for line in m.group(1).splitlines():
        line = line.strip().rstrip(",")
        if not line:
            continue
        obj = {}
        for k, v in re.findall(r'"(\w+)":\s*("(?:[^"\\]|\\.)*")', line):
            obj[k] = v[1:-1]
        out.append(obj)
    return out


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "news-verify"})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.status, r.read().decode("utf-8", "replace")


# =====================================================================
# 离线：文章 ↔ 数据 ↔ 页面
# =====================================================================
print("=" * 72)
print("A. 离线结构检查（不需要 dev server）")
print("=" * 72)

slug_sets = {}
expected_order = {}

for lang, rel, prefix, list_file, pager_file in LANGS:
    print("\n--- %s ---" % lang)
    adir = PAGES / rel
    files = article_files(adir)
    check(len(files) > 0, "%s: 有文章文件" % lang, "%d 篇" % len(files))

    slugs, iso, missing = [], {}, []
    for p in files:
        s = p.read_text(encoding="utf-8", errors="replace")
        blk = article_block(s)
        if not blk:
            missing.append(p.stem + ":无article块")
            continue
        for f in REQUIRED_ARTICLE_FIELDS:
            if not field(blk, f):
                missing.append("%s:%s" % (p.stem, f))
        d = field(blk, "date")
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", d):
            missing.append("%s:date格式=%r" % (p.stem, d))
        slugs.append(p.stem)
        iso[p.stem] = d
    check(not missing, "%s: 文章必需字段完整" % lang, "; ".join(missing[:5]))
    slug_sets[lang] = set(slugs)
    expected_order[lang] = sorted(slugs, key=lambda s: (iso.get(s, ""), "/news/" + s), reverse=True)

    dfile = DATA / ("%sNewsCards.js" % lang)
    if not check(dfile.exists(), "%s: 数据文件存在" % lang, dfile.name):
        continue
    text = dfile.read_text(encoding="utf-8")
    cards = parse_cards(text)
    if not check(cards is not None, "%s: 数据文件可解析" % lang):
        continue

    check(len(cards) == len(slugs), "%s: 数据条数 == 文章篇数" % lang, "数据 %d / 文章 %d" % (len(cards), len(slugs)))

    hrefs = [c.get("href", "") for c in cards]
    check(all(h.startswith("/news/") for h in hrefs), "%s: href 不带语言前缀" % lang,
          "; ".join(h for h in hrefs if not h.startswith("/news/"))[:80])
    check(len(set(hrefs)) == len(hrefs), "%s: href 无重复" % lang)
    check({h[len("/news/"):] for h in hrefs} == set(slugs), "%s: 数据 href 集合 == 文章 slug 集合" % lang)

    expected_hrefs = ["/news/" + s for s in expected_order[lang]]
    check(hrefs == expected_hrefs, "%s: 卡片按日期严格降序" % lang,
          "" if hrefs == expected_hrefs else "顺序与 article.date 降序不一致")

    empty = [c.get("href") for c in cards if not c.get("desc")]
    if empty:
        warn("%s: 有 %d 张卡片摘要为空" % (lang, len(empty)), "; ".join(empty[:4]))
    else:
        check(True, "%s: 无空摘要卡片" % lang)

    check(re.search(r"export const NEWS_PER_PAGE = 10;", text) is not None, "%s: NEWS_PER_PAGE=10" % lang)
    total_pages = math.ceil(len(cards) / 10)
    check(re.search(r"NEWS_TOTAL_PAGES = Math\.ceil\(\w+NewsCards\.length / NEWS_PER_PAGE\)", text) is not None,
          "%s: NEWS_TOTAL_PAGES 为推导值" % lang, "应为 %d 页" % total_pages)

    lp_file = PAGES / list_file
    if check(lp_file.exists(), "%s: 列表页存在" % lang, list_file):
        lt = lp_file.read_text(encoding="utf-8")
        check(("data/%sNewsCards.js" % lang) in lt, "%s: 列表页引用数据文件" % lang)
        check("NewsCard" in lt and "NewsPager" in lt, "%s: 列表页用 NewsCard/NewsPager 组件" % lang)
        check("alternateLangs" in lt, "%s: 列表页发 hreflang 子集" % lang)

    pg_file = PAGES / pager_file
    if check(pg_file.exists(), "%s: 分页页存在" % lang, pager_file):
        pt = pg_file.read_text(encoding="utf-8")
        check("getStaticPaths" in pt, "%s: 分页页有 getStaticPaths" % lang)
        check("NEWS_TOTAL_PAGES" in pt, "%s: 分页页从数据推导页数" % lang)
        check("alternates={false}" in pt, "%s: 分页页关闭 hreflang" % lang)

baselang = "zh"
base = slug_sets.get(baselang, set())
same = all(slug_sets.get(l) == base for l, *_ in LANGS)
check(same, "四语文章集合一致", "各 %d 篇" % len(base) if same else
      "; ".join("%s 差集=%s" % (l, sorted(slug_sets.get(l, set()) ^ base)) for l, *_ in LANGS if slug_sets.get(l) != base))

print("\n" + "=" * 72)
print("B. 在线渲染检查")
print("=" * 72)

ap = argparse.ArgumentParser()
ap.add_argument("--http", default=None, help="dev/preview 服务器根地址，如 http://localhost:4321")
args = ap.parse_args()

if not args.http:
    print("（未传 --http，跳过。示例：python _verify_news_i18n.py --http http://localhost:4321）")
else:
    base_url = args.http.rstrip("/")
    for lang, rel, prefix, list_file, pager_file in LANGS:
        print("\n--- %s ---" % lang)
        root = base_url + prefix + "/news/"
        total = math.ceil(len(slug_sets[lang]) / 10)
        seen, cum = set(), 0
        try:
            st, html = get(root)
        except Exception as e:
            check(False, "%s: 列表页可访问" % lang, "%s %s" % (root, e))
            continue
        check(st == 200, "%s: /news/ 返回 200" % lang)

        for page in range(1, total + 1):
            url = root if page == 1 else root + "page_%d/" % page
            try:
                st, html = get(url)
            except urllib.error.HTTPError as e:
                check(False, "%s p%d 返回 200" % (lang, page), "%s -> %s" % (url, e.code))
                continue
            except Exception as e:
                check(False, "%s p%d 返回 200" % (lang, page), str(e))
                continue
            tags = [m.group(0) for m in re.finditer(r"<a\b[^>]*group bg-white rounded-xl[^>]*>", html)]
            cards = []
            for t in tags:
                hm = re.search(r'href="([^"]+)"', t)
                if hm:
                    cards.append(hm.group(1))
            want = min(10, len(slug_sets[lang]) - (page - 1) * 10)
            check(st == 200 and len(cards) == want, "%s p%d: 卡片数 %d/%d" % (lang, page, len(cards), want))
            cum += len(cards)
            seen |= set(cards)

            hreflang = html.count('rel="alternate"')
            if page == 1:
                # 4 语 hreflang + 1 条 x-default = 5；若 pt 泄漏进来会变 6 → 立即失败
                check(hreflang == len(LANGS) + 1, "%s p1: hreflang = 4 语 + x-default" % lang, "%d 条" % hreflang)
            else:
                check(hreflang == 0, "%s p%d: 无 hreflang" % (lang, page), "%d 条" % hreflang)

            canon = re.search(r'<link rel="canonical" href="([^"]+)"', html)
            exp_suffix = "/news/" if page == 1 else "/news/page_%d/" % page
            check(bool(canon) and canon.group(1).endswith(exp_suffix), "%s p%d: canonical 自指" % (lang, page),
                  canon.group(1) if canon else "无 canonical")

            bad = re.findall(r'href="[^"]*/news/page/\d+', html)
            check(not bad, "%s p%d: 分页 URL 扁平" % (lang, page), str(bad[:3]))
            ptlinks = re.findall(r'href="[^"]*/pt/news[^"]*"', html)
            check(not ptlinks, "%s p%d: 无 pt 新闻死链" % (lang, page), str(ptlinks[:3]))
            if page == 1:
                check("min-h-[33vh] mt-[72px]" in html and "pt-10 md:pt-14 pb-16 md:pb-20" in html,
                      "%s p1: hero/间距标记存在" % lang)

        check(cum == len(slug_sets[lang]), "%s: 各页卡片累计 == 总数" % lang, "%d/%d" % (cum, len(slug_sets[lang])))
        check(len(seen) == len(slug_sets[lang]), "%s: 跨页无重复卡片" % lang, "%d 唯一/%d 累计" % (len(seen), cum))

# =====================================================================
failed = [r for r in results if not r[0]]
print("\n" + "=" * 72)
print("结果：%d 项通过 / %d 项失败" % (len(results) - len(failed), len(failed)))
for _, label, detail in failed:
    print("  x %s  %s" % (label, detail))
print("=" * 72)
sys.exit(1 if failed else 0)
