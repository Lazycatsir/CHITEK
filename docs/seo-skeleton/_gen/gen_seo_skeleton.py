# -*- coding: utf-8 -*-
"""
英文站「SEO 基本骨架信息报告」生成器（只读，不改站点任何文件）

用途：把英文站每个页面的 SEO 骨架（title/description/canonical/hreflang/OG/
      JSON-LD/标题层级/图片 alt/内链）连同**正文分区块纯文本**一起导出成 HTML，
      方便人工逐页优化文字内容。

数据源 = 本机 dev server 渲染后的真实 HTML（SEO 的真实口径，含 Nav/Footer 组件产物）。
      dev server 需先启动：
        node node_modules/astro/bin/astro.mjs dev --root F:/下载/CHITEK --port 4321

用法：
    python docs/seo-skeleton/_gen/gen_seo_skeleton.py              # 抓取 + 生成
    python docs/seo-skeleton/_gen/gen_seo_skeleton.py --no-fetch   # 只用缓存重排 HTML
    python docs/seo-skeleton/_gen/gen_seo_skeleton.py --only en-home,en-products-ahf
"""
import sys
import os
import csv
import io
import json
import re
import html as htmlmod
import urllib.request
import pathlib

from bs4 import BeautifulSoup, Comment

ROOT = pathlib.Path(r"F:\下载\CHITEK")
OUT = ROOT / "docs" / "seo-skeleton"
CACHE = OUT / "_gen" / "_cache"
BASE = "http://127.0.0.1:4321"
# 关键词矩阵（由 00_中转站/gen_keyword_matrix.py 生成，245 条词）
MATRIX_CSV = ROOT / "00_中转站" / "AHF_SVG_Keyword_Matrix.csv"

# ── 页面清单：slug -> (本地路径, 人类可读名, 分组) ──────────────────────────────
# 后续要扩到全站 76 页，只在这里加行即可。
PAGES = [
    ("en-home", "/en/", "Home 首页", "核心页"),
    ("en-products-ahf", "/en/products/", "AHF 汇总页（Products 列表）", "核心页"),
]

# ── 每页该吃哪些词：按矩阵 target_page 类型挑（框架 §5.1 流量矩阵 / §9 首页定位）──
# 首页按 §9「不承担单一关键词排名」，只吃品牌词 + 品类概览词（target_page=类目页/首页）
# 类目页按 §10「品类聚合页，吃品类词」，吃所有类目页指向词 + 询盘词 + 对比词
KW_PLAN = {
    "en-home": {
        "match": lambda r: r["target_page"].strip() == "类目页 / 首页",
        # 首页按框架 §9 不承担品类词排名 → 命中率只作参考，不进 KPI
        "assess": False,
        "extra": ["chitek", "chitek innopower"],
        "note": (
            "框架 §9：首页只做品牌词落点与导流，<b>不承担单一品类词排名</b>。"
            "本表用于检查「品牌名 + 品类概览名」是否被提及，命中率偏低属预期，不要用首页去硬堆品类词。"
        ),
    },
    "en-products-ahf": {
        "match": lambda r: (
            "类目页" in r["target_page"] or r["target_page"].strip() == "询盘页 · 产品页"
        )
        and r["product_family"] in ("AHF", "通用"),
        "assess": True,
        "extra": [],
        "note": (
            "框架 §10：类目页吃<b>品类词</b>（category）+ <b>品类级询盘词</b>（transactional），向下把权重分给 8 张产品卡。"
            "型号层词（model，如 active harmonic filter 300a）归详情页、对比词（vs）归对比页/博客，均不在本页考核。"
        ),
    },
}


def load_matrix():
    if not MATRIX_CSV.exists():
        return []
    raw = MATRIX_CSV.read_text(encoding="utf-8-sig")
    return list(csv.DictReader(io.StringIO(raw)))


def select_keywords(slug, rows):
    plan = KW_PLAN.get(slug)
    if not plan:
        return [], "", True
    out = [r for r in rows if r["language"] == "en" and plan["match"](r)]
    for k in plan.get("extra", []):
        out.append(
            {
                "keyword": k,
                "product_family": "-",
                "naming_variant": "BRAND",
                "scenario": "-",
                "intent_tier": "brand",
                "funnel_stage": "TOFU",
                "language": "en",
                "target_page": "-",
                "priority": "P0",
            }
        )
    order = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
    out.sort(key=lambda r: (order.get(r["priority"], 9), r["intent_tier"]))
    return out, plan["note"], plan.get("assess", True)


def page_corpus(d):
    """把页面各位置拆成可比对的文本层，用于关键词命中判断"""
    hs = d["headings"]
    body = " ".join(l for s in d["sections"] for l in s["text"])
    return {
        "url": d["canonical"],
        "title": d["title"],
        "desc": d["description"],
        "h1": " ".join(h["text"] for h in hs if h["level"] == 1),
        "h2h3": " ".join(h["text"] for h in hs if h["level"] in (2, 3)),
        "first100": " ".join(body.split()[:100]),
        "body": body,
        "alt": " ".join((i["alt"] or "") for i in d["images"]),
    }


def kw_count(kw, hay, loose=False):
    if not hay:
        return 0
    if loose:
        return hay.lower().count(kw.lower())
    return len(re.findall(r"\b" + re.escape(kw) + r"\b", hay, re.I))


LOC_KEYS = ["url", "title", "desc", "h1", "h2h3", "first100", "body", "alt"]


def keyword_report(d, kws):
    corp = page_corpus(d)
    rows = []
    for k in kws:
        kw = k["keyword"]
        hits = {}
        for loc in LOC_KEYS:
            hits[loc] = kw_count(kw, corp[loc])
        loose = kw_count(kw, corp["body"], loose=True)
        exact_body = hits["body"]
        if hits["title"] or hits["h1"]:
            status = "core"          # 已在 title 或 H1 命中（最关键）
        elif hits["h2h3"] or hits["first100"]:
            status = "mid"           # 只在 H2/H3 或首段命中
        elif exact_body:
            status = "body"          # 只在正文命中
        elif loose:
            status = "variant"       # 只有复数/变形，缺精确形式（Bing 不认）
        else:
            status = "miss"
        rows.append(
            {
                "kw": kw,
                "tier": k["intent_tier"],
                "pri": k["priority"],
                "stage": k["funnel_stage"],
                "target": k["target_page"],
                "variant": k["naming_variant"],
                "hits": hits,
                "loose": loose,
                "status": status,
            }
        )
    return rows


# ── GEO 可切块检查（框架 §4.3 三种可被引用的结构）──────────────────────────────
NUM_RE = re.compile(r"\b\d[\d.,]*\s*(%|A|kA|V|kV|Hz|kHz|ms|us|μs|s|kvar|W|kW|MW|°C|mm|kg|th|order|x)\b", re.I)
STD_RE = re.compile(r"\b(IEEE|IEC|EN|GB/?T?|UL|CE|ISO|G5/5|GB)\s?-?\s?\d", re.I)


def geo_blocks(d):
    out = []
    for s in d["sections"]:
        lines = s["text"]
        first = lines[0] if lines else ""
        fw = len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'&/.-]*", first))
        joined = " ".join(lines)
        out.append(
            {
                "no": s["no"],
                "head": s["first_head"],
                "answer_words": fw,
                "has_num": bool(NUM_RE.search(joined)),
                "has_std": bool(STD_RE.search(joined)),
                "n_lines": len(lines),
                "words": s["words"],
            }
        )
    return out


def fetch(path: str) -> str:
    os.environ["NO_PROXY"] = "127.0.0.1,localhost"
    os.environ["no_proxy"] = "127.0.0.1,localhost"
    # 空字典 = 不注册任何代理处理器，绕过系统代理直连本机 dev server
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    req = urllib.request.Request(
        BASE + path,
        headers={"User-Agent": "Mozilla/5.0 (seo-skeleton-extractor)"},
    )
    with opener.open(req, timeout=45) as r:
        raw = r.read()
    return raw.decode("utf-8", errors="replace")


def txt(el) -> str:
    if el is None:
        return ""
    s = el.get_text(" ", strip=True)
    return re.sub(r"\s+", " ", s)


def words(s: str) -> int:
    return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'&/.-]*", s))


def where(el) -> str:
    """判断标题/元素位于 main / nav / footer / header 的哪一块"""
    for p in el.parents:
        n = getattr(p, "name", None)
        if n == "main":
            return "main"
        if n == "footer":
            return "footer"
        if n == "nav":
            return "nav"
        if n == "header":
            return "header"
    return "other"


def extract(html: str, path: str, name: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    # ── JSON-LD 必须在拆掉 script 之前收集 ──
    ld = []
    for s in soup.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            ld.append(json.loads(s.string or "{}"))
        except Exception as e:
            ld.append({"@type": "!!PARSE_ERROR: %s" % e})

    for t in soup(["script", "style", "noscript", "template"]):
        t.decompose()
    # HTML 注释不是页面文字，全局剔除（否则会被当正文/词数统计）
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()

    d = {"slug_path": path, "name": name}
    d["jsonld"] = ld

    # ── head 基础 ──
    d["title"] = txt(soup.title)
    m = soup.find("meta", attrs={"name": "description"})
    d["description"] = (m.get("content") or "").strip() if m else ""
    m = soup.find("meta", attrs={"name": "robots"})
    d["robots"] = (m.get("content") or "").strip() if m else "(未设置 = 默认 index,follow)"
    m = soup.find("meta", attrs={"name": "viewport"})
    d["viewport"] = (m.get("content") or "").strip() if m else ""
    m = soup.find("meta", attrs={"name": "msvalidate.01"})
    d["bing_verify"] = bool(m)
    d["html_lang"] = (soup.html.get("lang") if soup.html else "") or ""
    d["html_dir"] = (soup.html.get("dir") if soup.html else "") or ""

    lk = soup.find("link", attrs={"rel": lambda v: v and "canonical" in v})
    d["canonical"] = (lk.get("href") or "") if lk else ""
    lk = soup.find("link", attrs={"rel": lambda v: v and "icon" in v})
    d["favicon"] = (lk.get("href") or "") if lk else ""

    # ── hreflang ──
    alts = []
    for lk in soup.find_all("link", attrs={"rel": lambda v: v and "alternate" in v}):
        if lk.get("hreflang"):
            alts.append((lk.get("hreflang"), lk.get("href") or ""))
    d["hreflang"] = alts

    # ── OG / Twitter ──
    d["og"] = [
        (m.get("property"), (m.get("content") or ""))
        for m in soup.find_all("meta")
        if (m.get("property") or "").startswith("og:")
    ]
    d["twitter"] = [
        (m.get("name"), (m.get("content") or ""))
        for m in soup.find_all("meta")
        if (m.get("name") or "").startswith("twitter:")
    ]

    # ── 标题层级（全文，标注所在区块）──
    heads = []
    for h in soup.find_all(re.compile(r"^h[1-6]$", re.I)):
        heads.append(
            {
                "level": int(h.name[1]),
                "text": txt(h),
                "where": where(h),
                "cls": " ".join(h.get("class") or []),
                "id": h.get("id") or "",
            }
        )
    d["headings"] = heads

    # ── 图片 ──
    imgs = []
    for im in soup.find_all("img"):
        alt = im.get("alt")
        imgs.append(
            {
                "src": im.get("src") or "",
                "alt": alt,
                "missing": alt is None or str(alt).strip() == "",
                "where": where(im),
            }
        )
    d["images"] = imgs

    # ── 链接 ──
    links = []
    for a in soup.find_all("a"):
        href = a.get("href") or ""
        if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            kind = "hash" if href.startswith("#") else ("empty" if not href else "contact")
            links.append({"href": href, "text": txt(a), "kind": kind, "where": where(a)})
            continue
        internal = href.startswith("/") or "chitek-inno.com" in href
        links.append(
            {
                "href": href,
                "text": txt(a),
                "kind": "internal" if internal else "external",
                "where": where(a),
            }
        )
    d["links"] = links

    # ── 正文分区块：以 H1/H2 为边界切块（一个 H2 以下的 H3 归入同一块）──
    main = soup.find("main")
    sections = []
    breadcrumb = []
    if main:
        desc = list(main.descendants)
        pos = {id(el): i for i, el in enumerate(desc)}
        heads_all = [el for el in desc if getattr(el, "name", None) and re.match(r"^h[1-6]$", el.name, re.I)]
        bounds = [h for h in heads_all if int(h.name[1]) <= 2]
        # 面包屑（main 内的 nav）
        for nv in main.find_all("nav"):
            for a in nv.find_all("a"):
                breadcrumb.append((txt(a), a.get("href") or ""))
            sp = nv.get_text(" ", strip=True)
            if sp and not nv.find_all("a"):
                breadcrumb.append((sp, ""))
        cuts = [pos[id(h)] for h in bounds] + [len(desc)]
        for i, h in enumerate(bounds):
            a, b = cuts[i], cuts[i + 1]
            chunk = desc[a:b]
            outline = [
                {"level": int(x.name[1]), "text": txt(x)}
                for x in chunk
                if getattr(x, "name", None) and re.match(r"^h[1-6]$", x.name, re.I)
            ]
            lines = []
            for s in chunk:
                if not isinstance(s, str):
                    continue
                if isinstance(s, Comment):
                    continue          # HTML 注释不是页面文字
                if not s.strip():
                    continue
                # 跳过标题自身文字 / 导航 / 页脚链接，只留正文
                par = s.parent
                skip = False
                for p in s.parents:
                    nm = getattr(p, "name", None)
                    if nm in ("nav", "footer"):
                        skip = True
                        break
                    if nm and re.match(r"^h[1-6]$", nm, re.I):
                        skip = True
                        break
                    if nm == "main":
                        break
                if skip:
                    continue
                t = re.sub(r"\s+", " ", str(s)).strip()
                if t:
                    lines.append(t)
            body = "\n".join(lines)
            sections.append(
                {
                    "no": i + 1,
                    "id": (h.get("id") or ""),
                    "cls": " ".join(h.get("class") or []),
                    "outline": outline,
                    "first_head": txt(h),
                    "n_head": len(outline),
                    "chars": len(body),
                    "words": words(body),
                    "text": lines,
                }
            )
    d["sections"] = sections
    d["breadcrumb"] = breadcrumb
    main_text = main.get_text(" ", strip=True) if main else ""
    d["main_words"] = words(main_text)
    d["main_chars"] = len(main_text)
    d["total_words"] = words(soup.get_text(" ", strip=True))
    return d


# ───────────────────────────── HTML 渲染 ─────────────────────────────
def esc(s) -> str:
    return htmlmod.escape(str(s), quote=True)


TITLE_IDEAL = (30, 60)
DESC_IDEAL = (110, 160)


def len_flag(s, ideal):
    n = len(s)
    lo, hi = ideal
    if n == 0:
        return "empty", "缺失"
    if n < lo:
        return "low", "偏短"
    if n > hi:
        return "high", "偏长"
    return "ok", "OK"


def chip(kind, label):
    return '<span class="f %s">%s</span>' % (kind, esc(label))


def audit_points(d: dict) -> list:
    """按站内 SEO 硬规则自动体检，返回 (等级, 说明) 列表。等级：bad / warn / ok / info"""
    r = []
    n = lambda s: len(s)

    if n(d["title"]) > 60:
        r.append(("warn", "Title %d 字符，超过 60，SERP 易被截断（建议 30–60）" % n(d["title"])))
    elif n(d["title"]) < 30:
        r.append(("warn", "Title 仅 %d 字符，偏短，可补核心词" % n(d["title"])))
    else:
        r.append(("ok", "Title 长度 %d，位于 30–60 区间" % n(d["title"])))

    if n(d["description"]) > 160:
        r.append(("warn", "Description %d 字符，超过 160，易被截断（建议 110–160）" % n(d["description"])))
    elif n(d["description"]) < 110:
        r.append(("warn", "Description 仅 %d 字符，偏短，可补充卖点/场景词" % n(d["description"])))
    else:
        r.append(("ok", "Description 长度 %d，位于 110–160 区间" % n(d["description"])))

    h1 = [h for h in d["headings"] if h["level"] == 1]
    if len(h1) == 1:
        r.append(("ok", "全页唯一 H1：「%s」" % h1[0]["text"][:70]))
    elif len(h1) == 0:
        r.append(("bad", "未发现 H1 —— 违反「每页唯一 H1」硬规则"))
    else:
        r.append(("bad", "发现 %d 个 H1 —— 违反「每页唯一 H1」硬规则" % len(h1)))

    types = [j.get("@type") for j in d["jsonld"]]
    page_types = [t for t in types if t not in ("Organization", "WebSite")]
    if page_types:
        r.append(("ok", "页面级结构化数据：%s（另有全站共用的 Organization / WebSite）" % " | ".join(page_types)))
    else:
        r.append(("warn", "无页面级结构化数据 —— 当前只有全站共用的 Organization / WebSite，建议按页面类型补（如 WebPage / BreadcrumbList / FAQPage / ItemList / Product）"))

    miss = [i for i in d["images"] if i["missing"]]
    if miss:
        r.append(("bad", "%d 张图片缺 alt" % len(miss)))
    else:
        r.append(("ok", "全部 %d 张图片均有 alt" % len(d["images"])))

    hashlinks = [l for l in d["links"] if l["kind"] == "hash"]
    if hashlinks:
        r.append(("bad", '存在 %d 处 href="#" —— 违反「全站禁功能性 href="#"」硬规则' % len(hashlinks)))
    else:
        r.append(("ok", '无功能性 href="#"'))

    # 标题层级跳级（只看正文块内）
    lv = [h["level"] for h in d["headings"] if h["where"] == "main"]
    jumps = []
    prev = 0
    for x in lv:
        if prev and x > prev + 1:
            jumps.append("H%d→H%d" % (prev, x))
        prev = x
    if jumps:
        r.append(("warn", "正文标题层级跳级：%s" % "、".join(jumps)))
    else:
        r.append(("ok", "正文标题层级无跳级"))

    fh = [h for h in d["headings"] if h["where"] != "main"]
    if fh:
        r.append(
            (
                "info",
                "导航/页脚内另有 %d 个标题（%s）—— 属全站共用组件，非本页文案"
                % (len(fh), "、".join(sorted({"H%d" % h["level"] for h in fh}))),
            )
        )

    r.append(("info", "正文可见词数 %d，整页（含导航/页脚）%d 词" % (d["main_words"], d["total_words"])))
    return r


def render_page(d: dict) -> str:
    o = []
    tst, tlab = len_flag(d["title"], TITLE_IDEAL)
    dst, dlab = len_flag(d["description"], DESC_IDEAL)
    h1 = [h for h in d["headings"] if h["level"] == 1 and h["where"] == "main"]
    h1all = [h for h in d["headings"] if h["level"] == 1]
    miss_alt = [i for i in d["images"] if i["missing"]]
    internal = [l for l in d["links"] if l["kind"] == "internal"]
    external = [l for l in d["links"] if l["kind"] == "external"]
    hashlinks = [l for l in d["links"] if l["kind"] == "hash"]
    types = []
    for j in d["jsonld"]:
        t = j.get("@type")
        types.append(t if isinstance(t, str) else str(t))

    o.append('<h1>%s</h1>' % esc(d["name"]))
    o.append('<p class="sub">本地路径 <code>%s</code> ｜ canonical <code>%s</code></p>' % (esc(d["slug_path"]), esc(d["canonical"])))

    # 自动体检结论
    o.append("<h2>零、自动体检结论</h2>")
    o.append("<ul class='pts'>")
    for lv, msg in audit_points(d):
        o.append("<li><span class='f %s'>%s</span> %s</li>" % (lv, {"ok": "OK", "warn": "注意", "bad": "问题", "info": "说明"}[lv], esc(msg)))
    o.append("</ul>")

    # 关键词命中体检 —— 直接回答「命中率」
    kr = d.get("kw_rows") or []
    if kr:
        pri = lambda p: len([r for r in kr if r["pri"] == p])
        hit = lambda p, st: len([r for r in kr if r["pri"] == p and r["status"] in st])
        core = ("core",)
        anyhit = ("core", "mid", "body")
        o.append("<h2>一、关键词命中体检（%d 个目标词 · 来自关键词矩阵）</h2>" % len(kr))
        o.append('<p class="sub">%s</p>' % d.get("kw_note", ""))
        if not d.get("kw_assess", True):
            o.append('<p class="sub">⚠️ 本页命中率<b>不作 KPI</b>，仅作参考（见上）。</p>')
        o.append('<p class="sub">命中口径：<b>core</b>=已进 meta title 或 H1（最关键）｜<b>mid</b>=仅在 H2/H3 或首段｜<b>body</b>=仅正文出现｜<b>变体</b>=只有复数/变形、缺精确形式（Bing 不认，见框架 §3.3）｜<b>未命中</b>=全页无此词。精确匹配按词边界判定。</p>')
        o.append('<table class="kv">')
        o.append("<tr><th>优先级</th><th>目标词数</th><th>进 title/H1</th><th>任一位置命中</th><th>完全未命中</th><th>命中率</th></tr>")
        for p in ("P0", "P1", "P2", "P3"):
            if pri(p) == 0:
                continue
            n = pri(p)
            c = hit(p, core)
            a = hit(p, anyhit)
            m = n - a
            rate = 100.0 * a / n
            cl = "ok" if rate >= 80 else ("low" if rate >= 50 else "bad")
            o.append(
                "<tr><td>%s</td><td>%d</td><td>%d</td><td>%d</td><td>%s</td>"
                "<td><span class='n %s'>%.0f%%</span></td></tr>"
                % (p, n, c, a, ("<span class='n %s'>%d</span>" % ("ok" if m == 0 else "bad", m)), cl, rate)
            )
        o.append("</table>")

        # 命名变体覆盖（同一件东西，买家用不同叫法）
        byvar = {}
        for r in kr:
            v = r["variant"] or "-"
            byvar.setdefault(v, []).append(r)
        if len(byvar) > 1:
            o.append("<h3>命名变体覆盖（同一件东西的不同叫法）</h3>")
            o.append(
                '<p class="sub">买家搜同一类产品会用不同名字（AHF / APF / 谐波滤波器 / STATCOM…）。'
                "框架 §3.3：Bing 对字面敏感，<b>每个主要叫法至少要有一次精确形式的出现</b>，否则那条叫法的搜索里你等于不存在。"
                "注意：Google 是语义匹配，不需要每页把每个叫法都塞一遍。</p>"
            )
            o.append('<table class="kv"><tr><th>叫法</th><th>词数</th><th>命中</th><th>命中率</th><th>未命中的词</th></tr>')
            for v, rs in sorted(byvar.items()):
                n = len(rs)
                h = len([r for r in rs if r["status"] in ("core", "mid", "body")])
                rate = 100.0 * h / n
                cl = "ok" if rate >= 80 else ("low" if rate >= 50 else "bad")
                missw = [r["kw"] for r in rs if r["status"] == "miss"]
                o.append(
                    "<tr><td><b>%s</b></td><td>%d</td><td>%d</td>"
                    "<td><span class='n %s'>%.0f%%</span></td><td class='tt'>%s</td></tr>"
                    % (esc(v), n, h, cl, rate, esc("、".join(missw)) if missw else "—")
                )
            o.append("</table>")

        o.append("<h3>逐词明细</h3>")
        o.append(
            '<p class="sub">判定为「精确匹配」：要求该词作为连续词组出现（按词边界）。'
            "若词序不同、或中间插了别的词（例：页面写 <code>Active Harmonic Filter professional manufacturer</code>，"
            "目标词 <code>active harmonic filter manufacturer</code> 会被判未命中），"
            "一律算未命中 —— <b>Bing 看字面、Google 看语义</b>，按你要投的渠道取舍。</p>"
        )
        o.append('<table class="kv"><tr><th>目标词</th><th>意图</th><th>优先级</th>'
                 "<th>URL</th><th>title</th><th>desc</th><th>H1</th><th>H2/H3</th><th>首段</th><th>正文</th><th>alt</th><th>状态</th></tr>")
        st_label = {
            "core": ("ok", "进 title/H1"),
            "mid": ("low", "H2/首段"),
            "body": ("low", "仅正文"),
            "variant": ("high", "缺精确形式"),
            "miss": ("bad", "未命中"),
        }
        for r in kr:
            h = r["hits"]
            cell = lambda n: ("<span class='n ok'>%d</span>" % n) if n else "<span style='color:#bbb'>·</span>"
            cls, lab = st_label[r["status"]]
            extra = ""
            if r["status"] == "variant":
                extra = " <span class='f high'>正文有 %d 次变形</span>" % r["loose"]
            o.append(
                "<tr><td class='tt'><b>%s</b></td><td>%s</td><td>%s</td>"
                "<td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td>"
                "<td>%s%s</td></tr>"
                % (
                    esc(r["kw"]), esc(r["tier"]), r["pri"],
                    cell(h["url"]), cell(h["title"]), cell(h["desc"]), cell(h["h1"]),
                    cell(h["h2h3"]), cell(h["first100"]), cell(h["body"]), cell(h["alt"]),
                    chip(cls, lab), extra,
                )
            )
        o.append("</table>")

    # 体检表
    o.append('<h2>二、关键指标体检</h2>')
    o.append('<table class="kv">')
    o.append("<tr><th>项目</th><th>值</th><th>判断</th></tr>")
    row = lambda k, v, f=None: o.append(
        "<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (esc(k), v, f or "")
    )
    row("Title 长度", "%d 字符" % len(d["title"]), chip(tst, tlab))
    row("Description 长度", "%d 字符" % len(d["description"]), chip(dst, dlab))
    row("H1 数量（正文内）", "%d" % len(h1), chip("ok" if len(h1) == 1 else "bad", "OK" if len(h1) == 1 else "需处理"))
    row("H1 数量（含导航/页脚）", "%d" % len(h1all), chip("ok" if len(h1all) == 1 else "bad", "OK" if len(h1all) == 1 else "跳级/重复风险"))
    row("标题总数 H1–H6", "%d" % len(d["headings"]), "")
    row("JSON-LD 块数", "%d" % len(d["jsonld"]), "")
    row("Schema 类型", esc(" | ".join(types)) or "(无)", "")
    row("图片总数", "%d" % len(d["images"]), "")
    row("图片缺 alt", "%d" % len(miss_alt), chip("ok" if not miss_alt else "bad", "OK" if not miss_alt else "需补"))
    row("内链数", "%d" % len(internal), "")
    row("外链数", "%d" % len(external), "")
    row("href=\"#\" 占位", "%d" % len(hashlinks), chip("ok" if not hashlinks else "bad", "OK" if not hashlinks else "违反硬规则"))
    row("正文可见词数", "%d" % d["main_words"], "")
    row("整页可见词数", "%d" % d["total_words"], "")
    o.append("</table>")

    # head 明细
    o.append('<h2>三、meta 与 &lt;head&gt; 明细</h2>')
    o.append('<table class="kv">')
    o.append("<tr><th>字段</th><th>值</th></tr>")
    row("&lt;title&gt;", "<code>%s</code>" % esc(d["title"]))
    row("meta description", esc(d["description"]))
    row("meta robots", esc(d["robots"]))
    row("canonical", "<code>%s</code>" % esc(d["canonical"]))
    row("html lang / dir", "%s / %s" % (esc(d["html_lang"]), esc(d["html_dir"])))
    row("favicon", "<code>%s</code>" % esc(d["favicon"]))
    row("Bing 验证", "有" if d["bing_verify"] else "无")
    o.append("</table>")

    o.append('<h3>hreflang 多语言互指（%d 条）</h3>' % len(d["hreflang"]))
    o.append('<table class="kv"><tr><th>hreflang</th><th>href</th></tr>')
    for k, v in d["hreflang"]:
        o.append("<tr><td>%s</td><td><code>%s</code></td></tr>" % (esc(k), esc(v)))
    o.append("</table>")

    o.append("<h3>Open Graph / Twitter Card</h3>")
    o.append('<table class="kv"><tr><th>属性</th><th>内容</th></tr>')
    for k, v in d["og"]:
        o.append("<tr><td>%s</td><td>%s</td></tr>" % (esc(k), esc(v)))
    for k, v in d["twitter"]:
        o.append("<tr><td>%s</td><td>%s</td></tr>" % (esc(k), esc(v)))
    o.append("</table>")

    # JSON-LD
    o.append('<h2>四、结构化数据（JSON-LD）</h2>')
    for i, j in enumerate(d["jsonld"], 1):
        t = j.get("@type")
        o.append('<h3>块 %d ｜ @type = %s</h3>' % (i, esc(t)))
        o.append("<pre>%s</pre>" % esc(json.dumps(j, ensure_ascii=False, indent=2)))

    # 标题层级
    o.append('<h2>五、标题层级（H1–H6，文档顺序）</h2>')
    o.append('<table class="kv"><tr><th>层级</th><th>文本</th><th>所在区块</th></tr>')
    for h in d["headings"]:
        w = h["where"]
        badge = chip("ok" if w == "main" else "mute", w)
        o.append(
            '<tr><td>H%d</td><td class="lvl%d">%s</td><td>%s</td></tr>'
            % (h["level"], h["level"], esc(h["text"]) or "(空)", badge)
        )
    o.append("</table>")

    # 正文分区块 —— 优化文字内容的主战场
    o.append('<h2>六、正文分区块（可直接对照改写）</h2>')
    o.append(
        '<p class="sub">共 %d 块（按 H1/H2 边界切）｜ 正文可见词数 %d。每块列出标题大纲 + 逐行正文纯文本（已排除导航/页脚/标题自身）。</p>'
        % (len(d["sections"]), d["main_words"])
    )
    if d.get("breadcrumb"):
        o.append(
            '<p class="sub">面包屑：%s</p>'
            % esc(" › ".join(t for t, _ in d["breadcrumb"] if t))
        )
    for s in d["sections"]:
        o.append('<div class="sec">')
        o.append(
            '<h3>块 %d ｜ %s ｜ %d 个标题 ｜ %d 词</h3>'
            % (s["no"], esc(s["first_head"]) or "(无标题)", s["n_head"], s["words"])
        )
        if s["outline"]:
            o.append('<ul class="ol">')
            for hh in s["outline"]:
                o.append("<li><b>H%d</b> %s</li>" % (hh["level"], esc(hh["text"])))
            o.append("</ul>")
        o.append('<pre class="body">%s</pre>' % esc("\n".join(s["text"])))
        o.append("</div>")

    # 图片
    o.append('<h2>七、图片与 alt 文本</h2>')
    o.append('<table class="kv"><tr><th>#</th><th>src</th><th>alt</th><th>位置</th></tr>')
    for i, im in enumerate(d["images"], 1):
        a = im["alt"]
        cell = (
            '<span class="f bad">缺 alt</span>'
            if im["missing"]
            else esc(a)
        )
        o.append(
            "<tr><td>%d</td><td><code>%s</code></td><td>%s</td><td>%s</td></tr>"
            % (i, esc(im["src"]), cell, esc(im["where"]))
        )
    o.append("</table>")

    # 链接
    o.append('<h2>八、站内链接清单</h2>')
    o.append('<p class="sub">内链 %d 条（含导航/页脚）。href="#" 占位 %d 条。</p>' % (len(internal), len(hashlinks)))
    o.append('<table class="kv"><tr><th>锚文本</th><th>href</th><th>位置</th></tr>')
    seen = set()
    for l in internal:
        key = (l["text"], l["href"])
        if key in seen:
            continue
        seen.add(key)
        o.append(
            "<tr><td>%s</td><td><code>%s</code></td><td>%s</td></tr>"
            % (esc(l["text"]) or "(无文字)", esc(l["href"]), esc(l["where"]))
        )
    o.append("</table>")

    # GEO 可切块检查
    gb = d.get("geo_blocks") or []
    if gb:
        o.append("<h2>九、GEO 可切块检查（框架 §4.3）</h2>")
        o.append(
            '<p class="sub">生成式引擎按「段落」召回与重排。三种可被引用的结构：'
            "<b>答案块</b>（小节开头 40–60 词先给完整答案）｜<b>数据块</b>（具体数字+单位、标准号）｜<b>对比块</b>（表格）。"
            "本表按每个 H2 块检查开头段词数、是否含数字与标准号。</p>"
        )
        o.append('<table class="kv"><tr><th>块</th><th>标题</th><th>开头段词数</th><th>答案块</th><th>含数字/单位</th><th>含标准号</th><th>块内词数</th></tr>')
        for g in gb:
            aw = g["answer_words"]
            if aw == 0:
                ab = ("mute", "无正文")
            elif 40 <= aw <= 60:
                ab = ("ok", "达标")
            elif aw < 40:
                ab = ("low", "偏短 %d" % aw)
            else:
                ab = ("low", "偏长 %d" % aw)
            o.append(
                "<tr><td>%d</td><td>%s</td><td>%d</td><td>%s</td><td>%s</td><td>%s</td><td>%d</td></tr>"
                % (
                    g["no"], esc(g["head"]) or "(无标题)", aw, chip(ab[0], ab[1]),
                    chip("ok" if g["has_num"] else "low", "有" if g["has_num"] else "无"),
                    chip("ok" if g["has_std"] else "low", "有" if g["has_std"] else "无"),
                    g["words"],
                )
            )
        o.append("</table>")
        o.append('<p class="sub">⚠️ 开头段词数是「该 H2 块第一行文本」的词数。GEO 上理想形态是每块开头 40–60 词直接回答一个小问题；这里偏短/偏长只说明「形态不像答案块」，不等于内容差。</p>')

    return "\n".join(o)


CSS = """
:root{--bd:#d8d8d8;--mut:#666;--bg:#fafafa;}
*{box-sizing:border-box}
body{font-family:"Segoe UI","Microsoft YaHei",Arial,sans-serif;color:#1a1a1a;background:#fff;
     margin:0;padding:32px 40px 120px;line-height:1.55;font-size:14px;max-width:1180px}
h1{font-size:24px;margin:0 0 4px;border-bottom:2px solid #1a1a1a;padding-bottom:8px}
h2{font-size:17px;margin:32px 0 8px;border-left:4px solid #1a1a1a;padding-left:8px}
h3{font-size:14px;margin:20px 0 6px;color:#333}
p.sub{color:var(--mut);margin:4px 0 12px}
code{background:var(--bg);border:1px solid #e4e4e4;padding:1px 4px;font-family:Consolas,monospace;font-size:12.5px}
table{border-collapse:collapse;width:100%;margin:6px 0 14px}
th,td{border:1px solid var(--bd);padding:5px 8px;text-align:left;vertical-align:top;font-size:13px}
th{background:var(--bg);font-weight:600;white-space:nowrap}
td.lvl1{font-weight:700}
td.lvl2{padding-left:16px}
td.lvl3{padding-left:32px}
td.lvl4{padding-left:48px;color:#444}
.f{display:inline-block;padding:0 6px;font-size:12px;border:1px solid #bbb}
.f.ok{color:#146c2e;border-color:#146c2e}
.f.low,.f.high{color:#8a5a00;border-color:#8a5a00}
.f.bad,.f.empty{color:#a11212;border-color:#a11212}
.f.mute{color:#777;border-color:#ccc}
.n{font-weight:700}
.n.ok{color:#146c2e}
.n.low,.n.high{color:#8a5a00}
.n.bad,.n.empty{color:#a11212}
td.tt{font-size:12.5px;color:#333}
pre{background:var(--bg);border:1px solid #e4e4e4;padding:8px 10px;overflow-x:auto;
    white-space:pre-wrap;word-break:break-word;font-family:Consolas,monospace;font-size:12.5px;margin:4px 0 12px}
pre.body{max-height:none}
.sec{border-top:1px dashed #ddd;padding-top:8px}
ul.pts{list-style:none;padding-left:0;margin:6px 0 14px}
ul.pts li{margin:3px 0}
ul.ol{margin:4px 0 6px;padding-left:22px}
ul.ol li{margin:2px 0}
a{color:#0b57d0}
.toc{background:var(--bg);border:1px solid var(--bd);padding:10px 14px}
.toc a{display:inline-block;margin-right:16px}
"""


def og_get(d, key):
    for k, v in d.get("og", []):
        if k == key:
            return v
    return ""


def tw_get(d, key):
    for k, v in d.get("twitter", []):
        if k == key:
            return v
    return ""


def render_index(datas, generated_at) -> str:
    o = []
    o.append("<h1>英文站 SEO 基本骨架信息报告</h1>")
    o.append('<p class="sub">生成 %s ｜ 数据源：本机 dev server 渲染后的真实 HTML ｜ 共 %d 页</p>' % (esc(generated_at), len(datas)))
    o.append('<p class="sub">用法：先用「表一」横向核对每页 meta 与索引口径，再用「表二」看内容与结构规模，最后进各页报告对照正文分区块改写文案。</p>')
    o.append('<div class="toc">')
    for slug, d in datas:
        o.append('<a href="%s.html">%s</a>' % (esc(slug), esc(d["name"])))
    o.append("</div>")

    # ── 表一：meta 与索引 ──
    o.append("<h2>表一：meta 与索引（全站横向对比）</h2>")
    o.append("<table>")
    o.append(
        "<tr><th>页面</th><th>meta title</th><th>meta description</th>"
        "<th>meta robots</th><th>canonical</th><th>html lang / dir</th>"
        "<th>hreflang</th><th>og:type</th><th>og:image</th><th>twitter:card</th></tr>"
    )
    for slug, d in datas:
        tst, _ = len_flag(d["title"], TITLE_IDEAL)
        dst, _ = len_flag(d["description"], DESC_IDEAL)
        ogi = og_get(d, "og:image")
        ogt = og_get(d, "og:type")
        twc = tw_get(d, "twitter:card")
        is_default = ogi.endswith("/assets/images/logo.webp")
        ogi_cell = "<code>%s</code> %s" % (
            esc(ogi),
            chip("low", "默认 logo 兜底") if is_default else chip("ok", "页面独立图"),
        )
        rb = d["robots"]
        rb_cell = (
            '<span class="f mute">未设置（= index,follow）</span>'
            if rb.startswith("(未设置")
            else "<code>%s</code>" % esc(rb)
        )
        o.append(
            "<tr><td><a href='%s.html'>%s</a></td>"
            "<td class='tt'>%s <span class='n %s'>%d</span></td>"
            "<td class='tt'>%s <span class='n %s'>%d</span></td>"
            "<td>%s</td><td class='tt'><code>%s</code></td><td>%s / %s</td>"
            "<td>%d</td><td>%s</td><td class='tt'>%s</td><td>%s</td></tr>"
            % (
                esc(slug), esc(d["name"]),
                esc(d["title"]), tst, len(d["title"]),
                esc(d["description"]), dst, len(d["description"]),
                rb_cell, esc(d["canonical"]), esc(d["html_lang"]), esc(d["html_dir"]),
                len(d["hreflang"]), esc(ogt), ogi_cell, esc(twc) or "-",
            )
        )
    o.append("</table>")
    o.append(
        '<p class="sub">meta title 建议 30–60 字符 ｜ meta description 建议 110–160 字符（绿色=达标，橙色=需调整，红色=硬问题）。'
        "og:image 若为 <code>/assets/images/logo.webp</code> 说明该页没配独立分享图、走的是全站 logo 兜底。</p>"
    )

    # ── 表二：内容与结构 ──
    o.append("<h2>表二：内容与结构（规模体检）</h2>")
    o.append("<table>")
    o.append(
        "<tr><th>页面</th><th>H1（正文内）</th><th>页面级 schema</th><th>标题数 H1–H6</th>"
        "<th>正文词数</th><th>整页词数</th><th>图片</th><th>缺 alt</th><th>H2 数</th>"
        "<th>内链</th><th>外链</th><th>href=\"#\"</th></tr>"
    )
    for slug, d in datas:
        h1s = [h for h in d["headings"] if h["level"] == 1 and h["where"] == "main"]
        allh1 = [h for h in d["headings"] if h["level"] == 1]
        h2n = len([h for h in d["headings"] if h["level"] == 2 and h["where"] == "main"])
        miss = len([i for i in d["images"] if i["missing"]])
        internal = [l for l in d["links"] if l["kind"] == "internal"]
        external = [l for l in d["links"] if l["kind"] == "external"]
        hashlinks = [l for l in d["links"] if l["kind"] == "hash"]
        types = [j.get("@type") for j in d["jsonld"]]
        page_types = [t for t in types if t not in ("Organization", "WebSite")]
        h1ok = len(allh1) == 1
        o.append(
            "<tr><td><a href='%s.html'>%s</a></td>"
            "<td>%s <span class='n %s'>%d</span></td><td class='tt'>%s</td><td>%d</td>"
            "<td>%d</td><td>%d</td><td>%d</td><td>%s</td><td>%d</td>"
            "<td>%d</td><td>%d</td><td>%s</td></tr>"
            % (
                esc(slug), esc(d["name"]),
                esc(h1s[0]["text"][:60]) if h1s else "(无)", "ok" if h1ok else "bad", len(allh1),
                esc(" | ".join(page_types)) if page_types else chip("low", "仅全站共用"),
                len(d["headings"]), d["main_words"], d["total_words"],
                len(d["images"]), "<span class='n %s'>%d</span>" % ("ok" if miss == 0 else "bad", miss),
                h2n, len(internal), len(external),
                "<span class='n %s'>%d</span>" % ("ok" if not hashlinks else "bad", len(hashlinks)),
            )
        )
    o.append("</table>")
    o.append(
        '<p class="sub">「页面级 schema」= 除全站共用的 Organization / WebSite 之外，本页自己的结构化数据。'
        "字数按英文词计，「正文」不含导航/页脚。</p>"
    )

    # ── 表三：关键词命中率 ──
    if any(d.get("kw_rows") for _, d in datas):
        o.append("<h2>表三：关键词命中率（对齐 245 条关键词矩阵）</h2>")
        o.append(
            '<p class="sub">只统计<b>该页该吃的词</b>（按矩阵 target_page 类型分配，见各页报告第一节）。'
            "「进 title/H1」= 该词已出现在 meta title 或 H1 里 —— 这是权重最高、也最该优先补的位置。</p>"
        )
        o.append("<table>")
        o.append("<tr><th>页面</th><th>考核口径</th><th>目标词数</th><th>P0 词数</th><th>P0 进 title/H1</th>"
                 "<th>P0 任一位置命中</th><th>P0 命中率</th><th>全部命中率</th><th>缺精确形式</th><th>完全未命中</th></tr>")
        for slug, d in datas:
            kr = d.get("kw_rows") or []
            if not kr:
                o.append("<tr><td><a href='%s.html'>%s</a></td><td colspan='9' class='tt'>未配置关键词计划（KW_PLAN）</td></tr>" % (esc(slug), esc(d["name"])))
                continue
            p0 = [r for r in kr if r["pri"] == "P0"]
            hitany = ("core", "mid", "body")
            core = len([r for r in p0 if r["status"] == "core"])
            anyh = len([r for r in p0 if r["status"] in hitany])
            allany = len([r for r in kr if r["status"] in hitany])
            variant = len([r for r in kr if r["status"] == "variant"])
            miss = len([r for r in kr if r["status"] == "miss"])
            rate = 100.0 * anyh / len(p0) if p0 else 0
            rateall = 100.0 * allany / len(kr)
            cl = lambda v: "ok" if v >= 80 else ("low" if v >= 50 else "bad")
            o.append(
                "<tr><td><a href='%s.html'>%s</a></td><td>%s</td><td>%d</td><td>%d</td><td>%d</td><td>%d</td>"
                "<td><span class='n %s'>%.0f%%</span></td><td><span class='n %s'>%.0f%%</span></td>"
                "<td>%s</td><td>%s</td></tr>"
                % (
                    esc(slug), esc(d["name"]),
                    chip("ok", "考核") if d.get("kw_assess", True) else chip("mute", "仅参考"),
                    len(kr), len(p0), core, anyh,
                    cl(rate), rate, cl(rateall), rateall,
                    "<span class='n %s'>%d</span>" % ("ok" if variant == 0 else "high", variant),
                    "<span class='n %s'>%d</span>" % ("ok" if miss == 0 else "bad", miss),
                )
            )
        o.append("</table>")
        o.append(
            '<p class="sub">命中率 = 该词在 URL / meta title / meta description / H1 / H2·H3 / 首段 / 正文 / alt 任一处出现（精确匹配，按词边界）。'
            "「缺精确形式」指正文里只有复数或变形、没有该词的原形 —— Bing 对字面更敏感（框架 §3.3），这类要改成精确形式。"
            "口径为「仅参考」的页面（首页）命中率低属预期，不要拿它去堆词（框架 §9）。</p>"
        )
    return "\n".join(o)


def page_html(inner, title) -> str:
    return (
        "<!doctype html>\n<html lang='zh-CN'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width,initial-scale=1'>"
        "<title>%s</title><style>%s</style></head><body>\n%s\n</body></html>"
        % (esc(title), CSS, inner)
    )


def main():
    args = sys.argv[1:]
    no_fetch = "--no-fetch" in args
    only = None
    for a in args:
        if a.startswith("--only"):
            only = set((a.split("=", 1)[1] if "=" in a else args[args.index(a) + 1]).split(","))

    CACHE.mkdir(parents=True, exist_ok=True)
    import datetime

    matrix = load_matrix()
    if matrix:
        print("[matrix] %d keywords" % len(matrix))
    else:
        print("[matrix] !! 未找到", MATRIX_CSV)

    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    datas = []
    for slug, path, name, group in PAGES:
        if only and slug not in only:
            continue
        cf = CACHE / (slug + ".json")
        if no_fetch and cf.exists():
            d = json.loads(cf.read_text(encoding="utf-8"))
            print("[cache]", slug)
        else:
            html = fetch(path)
            d = extract(html, path, name)
            cf.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
            print("[fetch]", slug, "| title len", len(d["title"]), "| words", d["main_words"])
        # 关键词命中 + GEO 可切块（每次重算，不落缓存）
        kws, note, assess = select_keywords(slug, matrix)
        d["kw_rows"] = keyword_report(d, kws)
        d["kw_note"] = note
        d["kw_assess"] = assess
        d["geo_blocks"] = geo_blocks(d)
        p0 = [r for r in d["kw_rows"] if r["pri"] == "P0"]
        p0hit = len([r for r in p0 if r["status"] in ("core", "mid", "body")])
        print(
            "        | 目标词 %d（P0 %d，任一处命中 %d）%s"
            % (len(d["kw_rows"]), len(p0), p0hit, "" if assess else "  [参考，不作KPI]")
        )
        datas.append((slug, d))
        (OUT / (slug + ".html")).write_text(
            page_html(render_page(d), "%s — SEO 骨架" % name), encoding="utf-8", newline="\n"
        )
    (OUT / "index.html").write_text(
        page_html(render_index(datas, now), "英文站 SEO 基本骨架信息报告"),
        encoding="utf-8",
        newline="\n",
    )
    print("done ->", OUT)


if __name__ == "__main__":
    main()
