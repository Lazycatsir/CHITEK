# -*- coding: utf-8 -*-
"""
CHITEK 英文站管理文档生成器（可重复运行）

输出到  F:\\下载\\CHITEK\\docs\\en-site\\ ：
    index.html
    README.md
    01-news-cards-and-links.html / .md     新闻卡片与推荐链接汇总
    02-download-links.html / .md           英文站下载链接管理
    03-product-sku.html / .md              产品 SKU 管理

数据源（全部只读，不改任何站点源码）：
    src/data/enNewsCards.js                        列表页新闻卡片
    src/pages/en/news/*.astro                      每篇文章的 article + otherArticles/relatedProducts/relatedCases
    src/pages/en/products*.astro + */ *.astro      卡片参数 / 配置器 / Resources 下载按钮
    public/assets/pdf/*.pdf                        现有 PDF 资产

用法：
    python gen_en_site_docs.py
"""
import io
import os
import re
import datetime
from collections import OrderedDict, Counter

REPO = r"F:\下载\CHITEK"
EN = os.path.join(REPO, "src", "pages", "en")
OUT = os.path.join(REPO, "docs", "en-site")
PDFDIR = os.path.join(REPO, "public", "assets", "pdf")
NOW = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

FAMS = [("products", "AHF", "/en/products/"),
        ("products-svg", "SVG", "/en/products-svg/"),
        ("products-asvg", "ASVG", "/en/products-asvg/")]

GROUP_NAME = {"v": "Rated Voltage", "a": "Power Capacity", "c": "Wiring",
              "i": "Installation", "p": "Protection Rate"}


# ---------------------------------------------------------------- 基础工具
def rd(p):
    return io.open(p, encoding="utf-8", newline="").read()


def wr(p, s):
    io.open(p, "w", encoding="utf-8", newline="\n").write(s)


def esc(s):
    return (str(s).replace("&amp;", "&").replace("&", "&amp;")
            .replace("<", "&lt;").replace(">", "&gt;"))


def strip_tags(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()


def md_cell(c):
    """把 HTML 片段压成一句 Markdown 单元格文本：<br> 变 ' / '，并反转义实体。"""
    t = str(c)
    t = re.sub(r"<br\s*/?>", " / ", t)
    t = re.sub(r"<[^>]+>", "", t)
    for a, b in (("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&#39;", "'"), ("&nbsp;", " ")):
        t = t.replace(a, b)
    t = t.replace("&amp;", "&")
    t = re.sub(r"\s+", " ", t).strip()
    return t.replace("|", "\\|")


CSS = """
*{box-sizing:border-box}
body{font:13px/1.65 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#111;margin:0;padding:26px 30px;max-width:1560px}
h1{font-size:20px;margin:0 0 4px}
h2{font-size:16px;margin:30px 0 8px;padding-bottom:5px;border-bottom:1px solid #e3e3e3}
h3{font-size:14px;margin:20px 0 6px}
p{margin:8px 0}
.nav{font-size:13px;margin:10px 0 22px;padding:8px 11px;background:#f7f7f7;border:1px solid #e3e3e3;border-radius:3px}
.nav a{color:#c2410c;text-decoration:none;margin-right:16px}
.nav a.on{font-weight:700;text-decoration:underline}
table{border-collapse:collapse;width:100%;margin:6px 0 16px}
th,td{border:1px solid #ddd;padding:4px 7px;text-align:left;vertical-align:top}
th{background:#f5f5f5;font-weight:600;white-space:nowrap}
td.num{text-align:right;white-space:nowrap}
code{font-family:Consolas,monospace;font-size:12px}
.miss{background:#fff3f3}
.warn{background:#fffaf0}
.gray{color:#999;background:#fafafa}
.ok{color:#4b7a4b}
.note{color:#666;font-size:12px}
ul,ol{margin:6px 0;padding-left:20px}
li{margin:2px 0}
.kpi{display:inline-block;border:1px solid #e3e3e3;background:#fafafa;padding:6px 12px;margin:0 10px 8px 0;font-size:13px}
.kpi b{font-size:16px;color:#c2410c}
"""

NAV_ITEMS = [("index.html", "总览"),
             ("01-news-cards-and-links.html", "① 新闻卡片与推荐链接"),
             ("02-download-links.html", "② 下载链接管理"),
             ("03-product-sku.html", "③ 产品 SKU 管理")]


class Doc(object):
    """极简 HTML / Markdown 双渲染文档。"""

    def __init__(self, title, subtitle=""):
        self.title = title
        self.subtitle = subtitle
        self.blocks = []

    # --- 记录 ---
    def h1(self, t, sub=""):
        self.blocks.append(("h1", (t, sub)))

    def h2(self, t):
        self.blocks.append(("h2", t))

    def h3(self, t):
        self.blocks.append(("h3", t))

    def p(self, t):
        self.blocks.append(("p", t))

    def ul(self, items):
        self.blocks.append(("ul", items))

    def table(self, headers, rows, row_cls=None, col_cls=None):
        self.blocks.append(("table", (headers, rows, row_cls or [], col_cls or [])))

    def kpis(self, items):
        self.blocks.append(("kpi", items))

    # --- HTML ---
    def _nav(self, active):
        out = ['<div class="nav">']
        for href, label in NAV_ITEMS:
            cls = ' class="on"' if href == active else ""
            out.append('<a href="%s"%s>%s</a>' % (href, cls, esc(label)))
        out.append('</div>')
        return "".join(out)

    def html(self, active):
        o = ['<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">',
             '<title>%s</title><style>%s</style></head><body>' % (esc(self.title), CSS)]
        o.append(self._nav(active))
        for kind, payload in self.blocks:
            if kind == "h1":
                t, sub = payload
                o.append('<h1>%s</h1>' % esc(t))
                if sub:
                    o.append('<p class="note">%s</p>' % sub)
            elif kind == "h2":
                o.append('<h2>%s</h2>' % esc(payload))
            elif kind == "h3":
                o.append('<h3>%s</h3>' % esc(payload))
            elif kind == "p":
                o.append('<p>%s</p>' % payload)
            elif kind == "ul":
                o.append("<ul>" + "".join("<li>%s</li>" % x for x in payload) + "</ul>")
            elif kind == "kpi":
                o.append("".join('<span class="kpi">%s <b>%s</b></span>' % (esc(a), esc(b))
                                 for a, b in payload))
            elif kind == "table":
                headers, rows, row_cls, col_cls = payload
                o.append("<table><tr>" + "".join("<th>%s</th>" % esc(h) for h in headers) + "</tr>")
                for i, row in enumerate(rows):
                    rc = row_cls[i] if i < len(row_cls) else ""
                    tds = []
                    for j, cell in enumerate(row):
                        cc = col_cls[j] if j < len(col_cls) else ""
                        tds.append('<td class="%s">%s</td>' % (cc, cell))
                    o.append('<tr class="%s">%s</tr>' % (rc, "".join(tds)))
                o.append("</table>")
        o.append('</body></html>')
        return "\n".join(o)

    # --- Markdown ---
    def md(self):
        o = ["# " + self.title, ""]
        if self.subtitle:
            o.append("> " + self.subtitle)
            o.append("")
        o.append("导航：" + " ｜ ".join("[%s](%s)" % (l, h) for h, l in NAV_ITEMS))
        o.append("")
        for kind, payload in self.blocks:
            if kind == "h1":
                continue
            if kind == "h2":
                o += ["", "## " + payload, ""]
            elif kind == "h3":
                o += ["", "### " + payload, ""]
            elif kind == "p":
                o += [payload, ""]
            elif kind == "ul":
                o += ["- " + x for x in payload] + [""]
            elif kind == "kpi":
                o += [" | ".join("**%s** %s" % (a, b) for a, b in payload), ""]
            elif kind == "table":
                headers, rows, _, _ = payload
                o.append("| " + " | ".join(headers) + " |")
                o.append("|" + "|".join(["---"] * len(headers)) + "|")
                for row in rows:
                    o.append("| " + " | ".join(md_cell(c) for c in row) + " |")
                o.append("")
        return "\n".join(o)


# ================================================================ ① 新闻
def parse_news_cards():
    s = rd(os.path.join(REPO, "src", "data", "enNewsCards.js"))
    rows = []
    for m in re.finditer(r'^\s*(\{.*?\}),?\s*$', s, re.M):
        line = m.group(1)
        if '"cat"' not in line:
            continue
        d = {}
        for k in ("cat", "href", "img", "alt", "category", "date", "title", "desc"):
            mm = re.search(r'"%s"\s*:\s*"((?:[^"\\]|\\.)*)"' % k, line)
            d[k] = mm.group(1) if mm else ""
        rows.append(d)
    per = re.search(r"NEWS_PER_PAGE\s*=\s*(\d+)", s)
    return rows, int(per.group(1)) if per else 10


def parse_news_pages():
    d = os.path.join(EN, "news")
    out = OrderedDict()
    for fn in sorted(os.listdir(d)):
        if not fn.endswith(".astro") or fn == "page_[page].astro":
            continue
        s = rd(os.path.join(d, fn))
        slug = "/news/" + fn[:-6]
        meta = {}
        art = re.search(r"const article = \{(.*?)\n\};", s, re.S)
        if art:
            for k in ("title", "category", "date", "dateDisplay", "description", "readTime", "author"):
                m = re.search(r'%s:\s*"((?:[^"\\]|\\.)*)"' % k, art.group(1))
                meta[k] = m.group(1) if m else ""
        lists = OrderedDict()
        for name in ("otherArticles", "relatedProducts", "relatedCases"):
            blk = re.search(r"const %s = \[(.*?)\n\s*\];" % name, s, re.S)
            items = []
            if blk:
                for it in re.findall(r"\{([^{}]*)\}", blk.group(1)):
                    items.append(dict(re.findall(r'([A-Za-z]+):\s*"((?:[^"\\]|\\.)*)"', it)))
            lists[name] = items
        out[slug] = {"file": "src/pages/en/news/" + fn, "meta": meta, "lists": lists}
    return out


def norm(href):
    """把站内 href 归一化成与 valid_routes() 同口径：去锚点、去 /en 前缀、去尾斜杠。"""
    h = (href or "").split("#")[0].strip()
    if h.startswith("/en/"):
        h = h[3:]
    elif h == "/en":
        h = "/"
    return h.rstrip("/") or "/"


def valid_routes():
    routes = set()
    for root, _dirs, files in os.walk(EN):
        for f in files:
            if not f.endswith(".astro"):
                continue
            rel = os.path.relpath(os.path.join(root, f), EN).replace("\\", "/")
            if "[" in rel:
                continue
            r = "/" + rel[:-6]
            if r.endswith("/index"):
                r = r[:-6] or "/"
            routes.add(r.rstrip("/") or "/")
    sm = os.path.join(REPO, "src", "data", "enSolutionMeta.js")
    if os.path.exists(sm):
        for s in re.findall(r"slug:\s*'([^']+)'", rd(sm)):
            routes.add("/solutions/" + s)
    return routes


def build_news():
    cards, per = parse_news_cards()
    pages = parse_news_pages()
    routes = valid_routes()

    def chk(href):
        if norm(href) in routes:
            return "OK"
        return "缺失"

    doc = Doc("CHITEK 英文站 · 新闻卡片与推荐链接汇总",
              "生成 %s ｜ 源 src/data/enNewsCards.js + src/pages/en/news/*.astro ｜ 只读统计，不改站点" % NOW)
    doc.h1("新闻卡片与推荐链接汇总",
           "覆盖：列表页卡片（enNewsCards.js）→ 每篇文章页的 article 元信息 + 三块推荐链接"
           "（otherArticles 相关阅读 / relatedProducts 推荐产品 / relatedCases 相关案例）。")

    # 概览
    dates = [c["date"] for c in cards if c["date"]]
    n_oa = sum(len(p["lists"]["otherArticles"]) for p in pages.values())
    n_rp = sum(len(p["lists"]["relatedProducts"]) for p in pages.values())
    n_rc = sum(len(p["lists"]["relatedCases"]) for p in pages.values())
    doc.h2("〇、概览")
    doc.kpis([("列表页卡片", len(cards)), ("文章详情页", len(pages)),
              ("每页卡片数", per), ("卡片页数", (len(cards) + per - 1) // per),
              ("文章日期区间", "%s → %s" % (dates[-1], dates[0]) if dates else "-"),
              ("推荐链接总数", n_oa + n_rp + n_rc)])
    doc.p("三块推荐链接条数：otherArticles %d 条、relatedProducts %d 条、relatedCases %d 条。"
          % (n_oa, n_rp, n_rc))

    # 1 卡片总表
    doc.h2("一、列表页卡片总表（enNewsCards.js）")
    rows = []
    for i, c in enumerate(cards, 1):
        st = chk(c["href"])
        cls = ' class="miss"' if st != "OK" else ""
        rows.append([str(i), esc(c["date"]), esc(c["category"]),
                     '<a href="%s">%s</a>' % (esc(c["href"]), esc(c["title"])),
                     "<code>%s</code>" % esc(c["href"]),
                     '<span%s>%s</span>' % (cls, st),
                     esc(os.path.basename(c["img"]))])
    doc.table(["#", "日期", "分类", "标题", "链接", "详情页", "封面图"], rows)

    # 2 逐篇推荐链接
    doc.h2("二、每篇文章的推荐链接")
    doc.p("每篇文章页固定三块：Related Articles（3 条站内文章）、Related Products（3 个产品族）、"
          "Related Cases（3 条案例）。下表逐篇列出，并标出目标是否存在。")
    for slug, p in pages.items():
        meta = p["meta"]
        doc.h3("%s ｜ %s" % (meta.get("dateDisplay", meta.get("date", "")), meta.get("title", slug)))
        rows = []
        blocks = [("Related Articles", "otherArticles", "title", "href"),
                  ("Related Products", "relatedProducts", "name", "href"),
                  ("Related Cases", "relatedCases", "name", "href")]
        for label, key, textk, hrefk in blocks:
            for it in p["lists"][key]:
                href = it.get(hrefk, "")
                st = chk(href)
                cls = ' class="miss"' if st != "OK" else ""
                rows.append([label, esc(it.get(textk, "-")), "<code>%s</code>" % esc(href),
                             '<span%s>%s</span>' % (cls, st)])
            if not p["lists"][key]:
                rows.append([label, '<span style="color:#c00">该块缺失或为空</span>', "-", "-"])
        doc.table(["区块", "链接文本", "href", "目标"], rows)

    # 3 内链反查
    doc.h2("三、内链反查（Related Articles 入链数）")
    incoming = Counter()
    for slug, p in pages.items():
        for it in p["lists"]["otherArticles"]:
            incoming[norm(it.get("href"))] += 1
    rows = []
    orphans = []
    for slug, p in pages.items():
        n = incoming.get(slug, 0)
        if n == 0:
            orphans.append(slug)
        cls = ' class="warn"' if n == 0 else ""
        rows.append(["<code>%s</code>" % esc(slug), esc(p["meta"].get("title", "")),
                     '<span%s>%d</span>' % (cls, n)])
    rows.sort(key=lambda r: int(strip_tags(r[2])))
    doc.table(["文章 slug", "标题", "被其他文章引用次数"], rows)
    doc.p("⚠️ **0 入链（孤儿）文章 %d 篇**：%s。这些文章只能从列表页/分页进入，站内没有其他文章链向它，"
          "对内链权重传递不利。" % (len(orphans), "、".join("<code>%s</code>" % esc(o) for o in orphans) or "无"))

    # 4 校验
    doc.h2("四、校验清单")
    issues = []
    # 4.1 卡片 vs 详情页
    for c in cards:
        slug = c["href"].rstrip("/")
        if slug not in pages:
            issues.append(("严重", "卡片 <code>%s</code> 没有对应的详情页文件" % esc(slug)))
            continue
        m = pages[slug]["meta"]
        if c["title"] and m.get("title") and c["title"].strip() != m["title"].strip():
            issues.append(("提示", "卡片标题与详情页 article.title 不一致：<br>卡片 <b>%s</b><br>页面 <b>%s</b>"
                           % (esc(c["title"]), esc(m["title"]))))
        if c["date"] and m.get("dateDisplay") and c["date"].strip() != m["dateDisplay"].strip():
            issues.append(("提示", "<code>%s</code> 卡片日期 <b>%s</b> ≠ 详情页 <b>%s</b>"
                           % (esc(slug), esc(c["date"]), esc(m["dateDisplay"]))))
        if c["category"] and m.get("category") and c["category"].strip() != m["category"].strip():
            issues.append(("提示", "<code>%s</code> 卡片分类 <b>%s</b> ≠ 详情页 <b>%s</b>"
                           % (esc(slug), esc(c["category"]), esc(m["category"]))))
    # 4.2 详情页不在卡片列表
    card_slugs = set(c["href"].rstrip("/") for c in cards)
    for slug in pages:
        if slug not in card_slugs:
            issues.append(("提示", "详情页 <code>%s</code> 未出现在列表页卡片里（孤立详情页）" % esc(slug)))
    # 4.3 推荐链接指向不存在的页
    for slug, p in pages.items():
        for label, key, hrefk in (("Related Articles", "otherArticles", "href"),
                                  ("Related Products", "relatedProducts", "href"),
                                  ("Related Cases", "relatedCases", "href")):
            for it in p["lists"][key]:
                h = norm(it.get(hrefk))
                if h != "/" and h not in routes:
                    issues.append(("严重", "<code>%s</code> 的 %s 指向不存在的页面 <code>%s</code>"
                                   % (esc(slug), label, esc(it.get(hrefk)))))
        for label, key in (("Related Articles", "otherArticles"), ("Related Products", "relatedProducts"),
                           ("Related Cases", "relatedCases")):
            if len(p["lists"][key]) != 3:
                issues.append(("提示", "<code>%s</code> 的 %s 只有 %d 条（惯例 3 条）"
                               % (esc(slug), label, len(p["lists"][key]))))
    # 4.4 卡片数据重复
    seen = {}
    for i, c in enumerate(cards, 1):
        k = (c["title"], c["img"])
        if k in seen:
            issues.append(("提示", "卡片 #%d 与 #%d 的标题+封面图完全相同（疑似复制未改）：<b>%s</b>"
                           % (seen[k], i, esc(c["title"]))))
        else:
            seen[k] = i
    # 4.5 同一封面图被多篇复用
    imgc = Counter(c["img"] for c in cards)
    for img, n in imgc.items():
        if n >= 3:
            issues.append(("提示", "封面图 <code>%s</code> 被 %d 张卡片复用" % (esc(os.path.basename(img)), n)))

    order = {"严重": 0, "提示": 1}
    issues.sort(key=lambda x: order.get(x[0], 9))
    if issues:
        rows = [[('<span class="miss">%s</span>' % k) if k == "严重" else k, v] for k, v in issues]
        doc.table(["级别", "问题"], rows)
    else:
        doc.p("✅ 未发现问题。")
    doc.p('<span class="note">说明：本表只做“是否一致/是否存在”的机械核对，不判断文案质量。'
          '标题/日期不一致属常态（卡片沿用发布日、详情页可能改过），列为「提示」供人工确认。</span>')
    return doc


# ================================================================ ② 下载链接
def collect_downloads():
    pdfs = set(os.listdir(PDFDIR)) if os.path.isdir(PDFDIR) else set()

    def read_lines(p):
        with io.open(p, "r", encoding="utf-8", newline="") as f:
            return f.readlines()

    def exists(href):
        if not href or href == "#":
            return '待补 (href="#")'
        if href.startswith("/assets/pdf/"):
            return "OK" if href.split("/")[-1] in pdfs else "文件不存在!"
        return "external"

    rows = []   # 汇总页：dict(file,line,kind,url,label,subject,href,status)
    for name in ("products.astro", "products-svg.astro", "products-asvg.astro"):
        path = os.path.join(EN, name)
        if not os.path.exists(path):
            continue
        lines = read_lines(path)
        for i, ln in enumerate(lines):
            if '<h3 class="h4"><a href={lp(' not in ln:
                continue
            m = re.search(r"href=\{lp\('([^']+)'\)\}[^>]*>(.*?)</a>", ln)
            title = strip_tags(m.group(2)).replace("&amp;", "&") if m else "?"
            found = 0
            for j in range(i, min(i + 25, len(lines))):
                for href, attrs, label in re.findall(r'<a href="([^"]*)"([^>]*)>([^<]+)</a>', lines[j]):
                    label = label.strip()
                    if label in ("Datasheet", "Catalog", "Device Manual") and "cbp-dl-btn" in attrs:
                        rows.append({"file": name, "line": j + 1, "kind": "汇总页",
                                     "url": "/en/" + name[:-6], "label": label,
                                     "subject": title, "href": href, "status": exists(href)})
                        found += 1
                # 灰色占位：不可点 <span class="cbp-dl-btn is-off" ...>（如 IP65 卡）
                for attrs, label in re.findall(r'<span([^>]*?)>([^<]+)</span>', lines[j]):
                    label = label.strip()
                    if (label in ("Datasheet", "Catalog", "Device Manual")
                            and "cbp-dl-btn" in attrs and "is-off" in attrs):
                        rows.append({"file": name, "line": j + 1, "kind": "汇总页",
                                     "url": "/en/" + name[:-6], "label": label,
                                     "subject": title, "href": "(灰色占位：不可点)",
                                     "status": "灰色占位"})
                        found += 1
                if found >= 3:
                    break

    drows = []
    for d, _fam, _pre in FAMS:
        folder = os.path.join(EN, d)
        for fn in sorted(os.listdir(folder)):
            if not fn.endswith(".astro"):
                continue
            lines = read_lines(os.path.join(folder, fn))
            for i, ln in enumerate(lines):
                m = re.search(r'<span class="text-\[15px\] text-text-dark">([^<]+)</span>', ln)
                if not m:
                    continue
                label = m.group(1).strip()
                chunk = "".join(lines[i:i + 2])
                a = re.search(r'<a href="([^"]*)"', chunk)
                if not a:
                    if "data-link-pending" in chunk:
                        note, st = "(灰色占位：data-link-pending)", "灰色占位"
                    else:
                        note, st = "(无链接：灰色不可点)", "视频待补"
                else:
                    note, st = a.group(1), exists(a.group(1))
                drows.append({"file": d + "/" + fn, "line": i + 1, "kind": "详情页",
                              "url": "/en/" + d + "/" + fn[:-6], "label": label,
                              "subject": "", "href": note, "status": st})
    return rows, drows, pdfs


def build_downloads():
    rows, drows, pdfs = collect_downloads()
    allrows = rows + drows
    st = Counter(r["status"] for r in allrows)

    doc = Doc("CHITEK 英文站 · 下载链接管理",
              "生成 %s ｜ 源 src/pages/en/（三张列表页 + 23 个产品详情页）｜ 只读扫描" % NOW)
    doc.h1("英文站下载链接管理",
           "所有可下载资源的 href 现状：Datasheet / Catalog / Device Manual（列表页卡片 3 个按钮 + "
           "详情页右栏 Resources 5 行）、以及 Installation and Commission 视频位。")

    doc.h2("〇、总览")
    doc.kpis([("总记录", len(allrows)), ("OK", st.get("OK", 0)),
              ('待补 href="#"', st.get('待补 (href="#")', 0)),
              ("灰色占位", st.get("灰色占位", 0)),
              ("视频待补", st.get("视频待补", 0)),
              ("文件不存在", st.get("文件不存在!", 0)),
              ("现有 PDF 资产", len(pdfs))])
    doc.table(["状态", "数量"], [[k, str(v)] for k, v in st.most_common()])

    doc.h2("一、列表页卡片下载按钮（汇总页）")
    doc.p("三张列表页（AHF / SVG / ASVG）各 8 张卡；每张卡在「列表视图」下有 Datasheet / Catalog / "
          "Device Manual 三个下载按钮。下表按卡汇总。")
    bycard = OrderedDict()
    for r in sorted(rows, key=lambda x: (x["file"], x["line"])):
        bycard.setdefault((r["file"], r["subject"]), {})[r["label"]] = r
    hrows = []
    for (fn, title), d in bycard.items():
        line_nums, cells = [], []
        for k in ("Datasheet", "Catalog", "Device Manual"):
            if k in d:
                r = d[k]
                line_nums.append(str(r["line"]))
                bad = r["status"].startswith("待补") or "不存在" in r["status"] or r["status"] == "灰色占位"
                cls = "miss" if bad else "ok"
                cells.append('<span class="%s"><code>%s</code><br><span class="note">行 %d · %s</span></span>'
                             % (cls, esc(r["href"]), r["line"], esc(r["status"])))
            else:
                cells.append('<span class="miss">—</span>')
        hrows.append(["<code>%s</code>" % esc(fn), "/".join(line_nums),
                      "<code>/en/%s</code>" % esc(fn[:-6]), esc(title)] + cells)
    doc.table(["文件", "行", "汇总页", "产品标题", "Datasheet", "Catalog", "Device Manual"], hrows)

    doc.h2("二、详情页 Resources 卡（23 页）")
    doc.p("详情页右栏 Resources 固定 5 行：HMI Manual / Datasheet / Catalog / Device Manual / "
          "Installation and Commission。下表列出后两行（Device Manual、安装视频）的现状。")
    for d, fam, _pre in FAMS:
        doc.h3("%s（/en/%s/*）" % (fam, d))
        srows = []
        for r in [x for x in drows if x["file"].startswith(d + "/")]:
            if r["label"] not in ("Device Manual", "Installation and Commission"):
                continue
            bad = r["status"].startswith("待补") or "不存在" in r["status"] or r["status"] == "灰色占位"
            cls = "miss" if bad else ("gray" if r["status"] == "视频待补" else "ok")
            srows.append(["<code>%s</code>" % esc(r["file"]), str(r["line"]), esc(r["label"]),
                          "<code>%s</code>" % esc(r["href"]),
                          '<span class="%s">%s</span>' % (cls, esc(r["status"]))])
        doc.table(["详情页文件", "行", "资源", "当前 href", "状态"], srows)

    doc.h2("三、待补清单（可填写表）")
    todo = [r for r in allrows if r["status"].startswith("待补") or "不存在" in r["status"]
            or r["status"] in ("灰色占位", "视频待补")]
    doc.p("共 **%d** 处待处理。最后一列留空，供填写建议的新 href。" % len(todo))
    trows = []
    for r in todo:
        bad = r["status"].startswith("待补") or "不存在" in r["status"]
        cls = "miss" if bad else "gray"
        trows.append(["<code>%s</code>" % esc(r["file"]), str(r["line"]), esc(r["kind"]),
                      "<code>%s</code>" % esc(r["url"]), esc(r["subject"] or r["label"]),
                      "<code>%s</code>" % esc(r["href"]),
                      '<span class="%s">%s</span>' % (cls, esc(r["status"])), ""])
    doc.table(["文件（相对 src/pages/en/）", "行", "位置", "页面 URL", "产品/资源", "当前 href", "状态",
               "建议新 href（填写）"], trows)

    doc.h2("四、现有 PDF 资产")
    doc.p("`public/assets/pdf/` 下共 %d 个文件，下载链接的 href 必须精确匹配文件名。" % len(pdfs))
    doc.ul(["<code>%s</code>" % esc(x) for x in sorted(pdfs)])
    return doc, len(todo)


# ================================================================ ③ SKU
def collect_sku():
    pages = []
    for d, fam, _ in FAMS:
        folder = os.path.join(EN, d)
        for fn in sorted(os.listdir(folder)):
            if not fn.endswith(".astro"):
                continue
            s = rd(os.path.join(folder, fn))
            pre = re.search(r"var partNo = '([^']*)' \+", s)
            sp = re.search(r"var SPECS = \{(.*?)\n\s*\};", s, re.S)
            de = re.search(r"var DEF = \{([^}]*)\}", s)
            price = re.search(r"textContent = '([^']*\$\(EXW\))'", s)
            dim = re.search(r"\+ ' · (\d+) × (\d+) × ' \+ spec\.d", s)
            gmap = OrderedDict()
            if "Configure your SKU" in s:
                sec = s[s.find("Configure your SKU"):]
                for label, chips in re.findall(
                        r'text-\[12px\][^"]*">([^<]+)</p>\s*<div class="flex flex-wrap gap-2">(.*?)</div>',
                        sec, re.S):
                    for g, v in re.findall(r'data-group="(\w)" data-val="([^"]*)"', chips):
                        gmap.setdefault(g, [])
                        if v not in gmap[g]:
                            gmap[g].append(v)
            specs = []
            if sp:
                for m in re.finditer(r"'([^']+)'\s*:\s*\{\s*d:\s*(\d+),\s*kg:\s*(\d+)\s*\}", sp.group(1)):
                    specs.append((m.group(1), int(m.group(2)), int(m.group(3))))
            defv = {}
            if de:
                defv = dict(re.findall(r"(\w):\s*'([^']*)'", de.group(1)))
            pages.append({
                "file": d + "/" + fn, "fam": fam, "dir": d,
                "url": "/en/" + d + "/" + fn[:-6],
                "prefix": pre.group(1) if pre else "",
                "specs": specs, "def": defv, "groups": gmap,
                "price": price.group(1) if price else "",
                "wh": (dim.group(1) + " × " + dim.group(2)) if dim else "",
                "has_cfg": bool(pre),
            })

    cards = []
    for name, fam, _u in FAMS:
        s = rd(os.path.join(EN, name + ".astro"))
        for m in re.finditer(r'<li class="cbp-vm-li"([^>]*)>\s*<div class="cbp-vm-image">'
                             r'<a href=\{lp\(\'([^\']+)\'\)\}><img src="([^"]*)"[^>]*alt="([^"]*)"', s):
            attrs = dict(re.findall(r'data-(\w)="([^"]*)"', m.group(1)))
            cards.append({"page": name, "fam": fam, "slug": m.group(2), "img": m.group(3),
                          "alt": m.group(4), "attrs": attrs})
    return pages, cards


def build_sku():
    pages, cards = collect_sku()
    cfg = [p for p in pages if p["has_cfg"]]
    legacy = [p for p in pages if not p["has_cfg"]]

    doc = Doc("CHITEK 英文站 · 产品 SKU 管理",
              "生成 %s ｜ 源 三张列表页卡片参数 + 23 个产品详情页配置器（SPECS/DEF/partNo）｜ 只读扫描" % NOW)
    doc.h1("英文站产品 SKU 管理",
           "SKU 由详情页的「Configure your SKU」配置器算出：访客勾选 电压 / 容量 / 接线 / 安装 / 防护，"
           "JS 拼出料号并查表补尺寸重量。本表把 24 个产品页的规则、选项、默认值、价格全列出来，便于核对与维护。")

    # 0 命名规则
    doc.h2("〇、SKU 命名规则（从源码抽取）")
    doc.p("详情页内联脚本里的一句话定义：")
    doc.p('<code>partNo = \'&lt;前缀&gt;\' + 电流 + \'-\' + 电压 + \'-\' + 安装 + \'-\' + 防护</code>')
    doc.p("完整展示串：<code>SKU: &lt;partNo&gt; · %s × %s × &lt;深&gt; mm · &lt;重&gt; kg · &lt;价格&gt;$(EXW)</code>"
          % (cfg[0]["wh"].split(" × ")[0] if cfg[0]["wh"] else "500",
             cfg[0]["wh"].split(" × ")[1] if cfg[0]["wh"] else "550"))
    doc.ul([
        "前缀：每页写死（见下表）。<b>两种风格并存</b>：<code>CHITEK-SiC-AHF-</code>（连字符）"
        "与 <code>ULTRA_SLIM_AHF_</code>（下划线）。",
        "电流 / 电压 / 安装 / 防护：四档直接拼进料号。",
        '<span class="miss">接线（3P3W / 3P4W）虽然在配置器里可选，但<b>没有拼进料号</b> —— '
        '换接线方式时 SKU 不变。</span>',
        "尺寸：宽 × 高 全站写死 <code>%s</code>，只有深度按电流档查 <code>SPECS</code> 表。" % (cfg[0]["wh"] or "500 × 550"),
        "价格：全站硬编码 <code>%s</code>（未按型号/容量区分）。" % (cfg[0]["price"] or "1300$(EXW)"),
    ])

    # 1 全产品 SKU 总表
    doc.h2("一、全部产品页 SKU 规则总表")
    doc.p("24 个产品页：%d 个带配置器，%d 个为 legacy 页（无配置器）。"
          % (len(cfg), len(legacy)))
    rows = []
    for p in cfg:
        g = p["groups"]
        rows.append([
            esc(p["fam"]), "<code>%s</code>" % esc(p["file"]),
            "<code>%s</code>" % esc(p["prefix"]),
            esc(" / ".join(g.get("v", [])) or "-"),
            esc(" / ".join(g.get("a", [])) or "-"),
            esc(" / ".join(g.get("c", [])) or "-"),
            esc(" / ".join(g.get("i", [])) or "-"),
            esc(" / ".join(g.get("p", [])) or "-"),
            esc(p["price"].replace("$(EXW)", "")),
        ])
    doc.table(["族", "详情页文件", "料号前缀", "电压档", "容量档", "接线", "安装", "防护", "价格(EXW)"], rows)
    for p in legacy:
        doc.p('<span class="note">legacy 页（无配置器，不参与 SKU）：<code>%s</code></span>' % esc(p["file"]))

    # 2 SPECS 表
    doc.h2("二、尺寸重量换算表（SPECS，按容量档）")
    doc.p("24 个详情页共用<b>同一份</b> SPECS 表（模板复制）。配置器用它把「容量档」映射到深度/重量；"
          "容量档不在表里时会静默回落到 <code>d:135 / kg:27</code>。")
    if cfg and cfg[0]["specs"]:
        srows = [[esc(k), str(d), str(kg)] for k, d, kg in cfg[0]["specs"]]
        doc.table(["容量档（SPECS 键）", "深度 d (mm)", "重量 kg"], srows)
    nospec = []
    for p in cfg:
        keys = set(k for k, _d, _kg in p["specs"])
        miss = [a for a in p["groups"].get("a", []) if a not in keys]
        if miss:
            nospec.append((p, miss))
    if nospec:
        doc.h3("⚠️ 容量档缺 SPECS 键（会静默回落）")
        rows = [["<code>%s</code>" % esc(p["file"]), esc(" / ".join(miss)),
                 esc(p["specs"][0][0] if p["specs"] else "-")] for p, miss in nospec]
        doc.table(["详情页", "配置器里有、但 SPECS 无键的容量档", "回落取值"], rows)
    else:
        doc.p("✅ 所有页面的容量档在 SPECS 里都有键。")

    # 3 列表页卡片参数
    doc.h2("三、列表页卡片参数（三页 × 8 卡）")
    doc.p("卡片的 <code>data-v / data-a / data-s / data-i / data-t</code> 决定「筛选」命中，"
          "与详情页配置器是两套独立硬编码，需人工保持口径一致。")
    bypage = OrderedDict()
    for c in cards:
        bypage.setdefault(c["page"], []).append(c)
    for page, cs in bypage.items():
        doc.h3("%s（%d 卡）" % (page, len(cs)))
        rows = []
        for i, c in enumerate(cs, 1):
            a = c["attrs"]
            rows.append([str(i), "<code>%s</code>" % esc(c["slug"]),
                         esc(a.get("v", "-")), esc(a.get("a", "-")), esc(a.get("s", "-")),
                         esc(a.get("i", "-")), esc(a.get("t", "-"))])
        doc.table(["#", "详情页 slug", "电压 data-v", "容量 data-a", "尺寸 data-s", "防护 data-i", "技术 data-t"], rows)

    # 4 校验
    doc.h2("四、校验清单")
    doc.p("比对「列表页卡片参数（data-v/a/s/i/t）」与「详情页配置器档位」是否同口径。两者是两套独立硬编码，"
          "改了一边不会自动同步另一边。")
    issues = []
    by_slug = OrderedDict()
    for p in cfg:
        by_slug["/" + p["dir"] + "/" + p["file"].split("/")[-1][:-6]] = p
    slug_cards = OrderedDict()
    for c in cards:
        slug_cards.setdefault(c["slug"], []).append(c)

    # 4.1 卡片指向不存在的详情页
    for slug in slug_cards:
        if slug not in by_slug:
            issues.append(("严重", "有列表页卡片指向 <code>%s</code>，但该详情页文件不存在" % esc(slug)))
    # 4.2 孤儿详情页
    for slug in by_slug:
        if slug not in slug_cards:
            issues.append(("提示", "详情页 <code>%s</code> 没有任何列表页卡片指向它（孤儿页，只能靠直链进入）"
                           % esc(slug)))
    # 4.3 一页多卡
    for slug, cs in slug_cards.items():
        if len(cs) > 1:
            descs = "、".join("%s（%s / %s）" % (c["page"], c["attrs"].get("v", "-"), c["attrs"].get("i", "-"))
                             for c in cs)
            issues.append(("提示", "详情页 <code>%s</code> 被 %d 张卡片共用：%s"
                           % (esc(slug), len(cs), esc(descs))))

    # 4.4 电压 / 容量 / 防护 三档口径比对
    def rng(txt):
        m = re.match(r"^(\d+)~(\d+)A$", txt or "")
        return (int(m.group(1)), int(m.group(2))) if m else None

    ip_diff = []
    for slug, cs in slug_cards.items():
        p = by_slug.get(slug)
        if not p:
            continue
        cv, ci, ca = set(), set(), set()
        for c in cs:
            cv |= set(x for x in (c["attrs"].get("v") or "").split(",") if x)
            ci |= set(x for x in (c["attrs"].get("i") or "").split(",") if x)
            r = rng(c["attrs"].get("a"))
            if r:
                ca.add(r)
        pv = set(p["groups"].get("v", []))
        pi = set(p["groups"].get("p", []))
        pa = [x for x in p["groups"].get("a", []) if re.match(r"^\d+A$", x)]
        if pv and pv - cv:
            issues.append(("提示", "详情页 <code>%s</code> 配置器可选电压 %s，但指向它的卡片 data-v 只有 %s "
                                   "→ 按这些电压筛选时该卡不出现在列表页" % (esc(slug), sorted(pv - cv), sorted(cv))))
        if pv and cv - pv:
            issues.append(("提示", "卡片 <code>%s</code> 的 data-v 含 %s，但详情页配置器没有该电压档"
                           % (esc(slug), sorted(cv - pv))))
        if pi and ci and ci - pi:
            ip_diff.append((slug, sorted(ci - pi)))
        if pa and ca:
            los = min(r[0] for r in ca)
            his = max(r[1] for r in ca)
            bad = [a for a in pa if not (los <= int(a[:-1]) <= his)]
            if bad:
                issues.append(("提示", "详情页 <code>%s</code> 配置器容量档 %s 落在卡片 data-a 范围 %d~%dA 之外"
                               % (esc(slug), bad, los, his)))
        if pa and not ca:
            issues.append(("提示", "详情页 <code>%s</code> 有配置器容量档，但卡片 data-a 为空" % esc(slug)))
    if ip_diff:
        extra_ips = sorted(set(x for _s, xs in ip_diff for x in xs))
        issues.append(("提示", "卡片 data-i 里出现配置器没有的防护档 %s，共 %d 页（%s）。配置器只提供 "
                               "IP20 / IP65 / other，卡片筛选却按 IP30 / IP40 细分 —— 属两套口径，"
                               "确认是否有意为之。" % (extra_ips, len(ip_diff),
                               "、".join("<code>%s</code>" % esc(s) for s, _x in ip_diff))))

    # 4.5 DEF 不在档位内
    for p in cfg:
        for g, val in p["def"].items():
            opts = p["groups"].get(g, [])
            if opts and val not in opts:
                issues.append(("提示", "详情页 <code>%s</code> 默认值 DEF.%s=%s 不在配置器档位 %s 内"
                                       "（访客未勾选时页面会显示这个值）" % (esc(p["file"]), g, val, opts)))
    # 4.6 SPECS 缺键
    for p in cfg:
        keys = set(k for k, _d, _kg in p["specs"])
        miss = [a for a in p["groups"].get("a", []) if a not in keys]
        if miss:
            issues.append(("提示", "详情页 <code>%s</code> 容量档 %s 在 SPECS 表中无键 → 尺寸重量静默回落 "
                                   "d:135 / kg:27" % (esc(p["file"]), miss)))
    # 4.7 前缀风格 / 接线 / 价格
    hyphen = [p["file"] for p in cfg if p["prefix"].endswith("-")]
    under = [p["file"] for p in cfg if p["prefix"].endswith("_")]
    issues.append(("提示", "料号前缀两种风格并存：连字符 %d 个（%s）；下划线 %d 个。建议统一。"
                   % (len(hyphen), "、".join("<code>%s</code>" % esc(x) for x in hyphen), len(under))))
    issues.append(("提示", "接线档（3P3W / 3P4W）在配置器里可选，但<b>没有拼进 partNo</b> —— "
                           "同一容量+电压+安装+防护下，两种接线方式生成相同 SKU。"))
    prices = set(p["price"] for p in cfg if p["price"])
    if len(prices) <= 1:
        issues.append(("提示", "价格全站硬编码为 %s，未按型号/容量区分。" % ("、".join(prices) or "-")))
    nvid = len(legacy)
    if nvid:
        issues.append(("提示", "legacy 页无配置器、不参与 SKU：%s"
                       % "、".join("<code>%s</code>" % esc(p["file"]) for p in legacy)))

    order = {"严重": 0, "提示": 1}
    issues.sort(key=lambda x: order.get(x[0], 9))
    doc.p("共 %d 条（严重 %d 条）。" % (len(issues), sum(1 for k, _v in issues if k == "严重")))
    rows = [[('<span class="miss">%s</span>' % k) if k == "严重" else k, v] for k, v in issues]
    doc.table(["级别", "问题"], rows)
    return doc, len(cfg), len(cards)


# ================================================================ 主流程
def main():
    if not os.path.isdir(OUT):
        os.makedirs(OUT)
    news = build_news()
    dl, n_todo = build_downloads()
    sku, n_cfg, n_cards = build_sku()

    files = [("01-news-cards-and-links", news), ("02-download-links", dl), ("03-product-sku", sku)]
    for name, doc in files:
        wr(os.path.join(OUT, name + ".html"), doc.html(name + ".html"))
        wr(os.path.join(OUT, name + ".md"), doc.md())

    # 索引
    idx = Doc("CHITEK 英文站管理文档", "生成 %s ｜ 目录 docs/en-site/ ｜ 一键重跑：python docs/en-site/_gen/gen_en_site_docs.py" % NOW)
    idx.h1("CHITEK 英文站管理文档", "把英文站的新闻、下载链接、产品 SKU 三块「管理型」数据集中成可检索、可核对的文档。"
            "全部由源码只读生成，不修改站点。")
    idx.h2("〇、三份文档")
    idx.table(["文档", "HTML", "Markdown", "内容"], [
        ["① 新闻卡片与推荐链接",
         '<a href="01-news-cards-and-links.html">01-news-cards-and-links.html</a>',
         '<a href="01-news-cards-and-links.md">.md</a>',
         "列表页卡片总表 + 每篇文章的 3 块推荐链接（相关阅读/推荐产品/相关案例）+ 内链反查 + 校验"],
        ["② 下载链接管理",
         '<a href="02-download-links.html">02-download-links.html</a>',
         '<a href="02-download-links.md">.md</a>',
         "三张列表页卡片下载按钮 + 23 个详情页 Resources 现状 + 待补清单（%d 处）" % n_todo],
        ["③ 产品 SKU 管理",
         '<a href="03-product-sku.html">03-product-sku.html</a>',
         '<a href="03-product-sku.md">.md</a>',
         "SKU 命名规则 + %d 个带配置器产品页的选项/默认值/价格 + 三张列表页 %d 张卡的筛选参数 + 校验"
         % (n_cfg, n_cards)],
    ])
    idx.h2("一、怎么用")
    idx.ul([
        "日常管理 → 直接开 <code>index.html</code>（或对应的 .html），用浏览器打开就能看，不需启动站点。",
        "源码改过之后 → 重跑 <code>python docs/en-site/_gen/gen_en_site_docs.py</code>，两份格式（html + md）一起刷新。",
        "要交给别人 / 贴进文档 → 用同名的 <code>.md</code>，纯文本表格，可直接粘进任何文档系统。",
        "待补清单里的「建议新 href」列 → 在 html 里看、在 md 里填，或直接改 <code>02-download-links.md</code>。",
    ])
    idx.h2("二、数据源（只读）")
    idx.ul(["<code>src/data/enNewsCards.js</code>、<code>src/pages/en/news/*.astro</code>",
            "<code>src/pages/en/products*.astro</code>、<code>src/pages/en/products*/ *.astro</code>",
            "<code>public/assets/pdf/*.pdf</code>"])
    wr(os.path.join(OUT, "index.html"), idx.html("index.html"))

    readme = ["# CHITEK 英文站管理文档",
              "",
              "> 生成 %s ｜ 目录 `docs/en-site/`" % NOW,
              "",
              "把英文站的新闻、下载链接、产品 SKU 三块「管理型」数据集中成 HTML + Markdown 双格式文档。",
              "全部由源码**只读**生成，不修改站点任何文件。",
              "",
              "## 文件清单",
              "",
              "| 文件 | 用途 |",
              "|---|---|",
              "| `index.html` | 总览入口（浏览器打开） |",
              "| `01-news-cards-and-links.html` / `.md` | 新闻卡片与推荐链接汇总 |",
              "| `02-download-links.html` / `.md` | 英文站下载链接管理 |",
              "| `03-product-sku.html` / `.md` | 产品 SKU 管理 |",
              "| `_gen/gen_en_site_docs.py` | 生成器（重跑一次即刷新全部文档） |",
              "",
              "## 重新生成",
              "",
              "```",
              "python docs/en-site/_gen/gen_en_site_docs.py",
              "```",
              "",
              "## 数据源（只读）",
              "",
              "- `src/data/enNewsCards.js` — 列表页新闻卡片",
              "- `src/pages/en/news/*.astro` — 每篇文章的 article 元信息 + 三块推荐链接",
              "- `src/pages/en/products*.astro` + `src/pages/en/products*/ *.astro` — 卡片参数 / 配置器 / 下载按钮",
              "- `public/assets/pdf/*.pdf` — 现有 PDF 资产",
              ""]
    wr(os.path.join(OUT, "README.md"), "\n".join(readme))

    print("OK ->", OUT)
    print("  news: %d 篇 | download 待补: %d | sku 带配置器: %d, 列表卡: %d" % (len(parse_news_pages()), n_todo, n_cfg, n_cards))


if __name__ == "__main__":
    main()
