# -*- coding: utf-8 -*-
"""
按英文站的新结构生成四语新闻列表页 + 扁平分页页（page_[page]）。

⚠️ 只在【改列表页版式 / 改 UI 文案】时才跑。新增文章【不需要】跑本脚本：
   列表页与分页页从数据文件读 NEWS_TOTAL_PAGES，页数会自动增加。
   新增文章只需跑 _extract_all_news.py。

每次运行都会把被覆盖的旧文件备份到 docs/_ref/news-gen-<时间戳>/（不覆盖历史备份）。

结构要点：hero min-h-[33vh] / mt-[72px] / 内容垂直居中；列表区 pt-10 md:pt-14 pb-16 md:pb-20；
无 "Latest Articles" 标题、无计数行；一页 10 条；分页 URL 扁平 /news/page_2/；分页页 alternates={false}。
"""
import pathlib
import shutil
import datetime

ROOT = pathlib.Path(r"F:\下载\CHITEK")
PAGES = ROOT / "src" / "pages"
REF = ROOT / "docs" / "_ref" / ("news-gen-" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))

T = {
    "zh": dict(
        lang="zh", prefix="", title="新闻资讯 | CHITEK INNOPOWER",
        desc="了解CHITEK INNOPOWER电能质量解决方案的最新动态、技术论文和行业洞察。",
        h1a="新闻与", h1b="洞察",
        sub="了解电能质量技术、行业趋势和CHITEK解决方案的最新动态。",
        readMore="阅读全文", label="新闻分页", prev="上一页", next="下一页",
        pageTitle="新闻资讯 — 第 {n} 页 | CHITEK INNOPOWER",
        pageDesc="CHITEK INNOPOWER 新闻与洞察归档第 {n} 页：技术论文、行业趋势与电能质量案例。",
    ),
    "en": dict(
        lang="en", prefix="/en", title="News & Insights | CHITEK INNOPOWER",
        desc="Stay updated with the latest news, technical papers, and industry insights from CHITEK INNOPOWER power quality solutions.",
        h1a="News & ", h1b="Insights",
        sub="Stay informed with the latest developments in power quality technology, industry trends, and CHITEK solutions.",
        readMore="Read More", label="News pagination", prev="Previous page", next="Next page",
        pageTitle="News & Insights — Page {n} | CHITEK INNOPOWER",
        pageDesc="Page {n} of the CHITEK INNOPOWER news and insights archive: technical papers, industry trends, and power quality case studies.",
    ),
    "es": dict(
        lang="es", prefix="/es", title="Noticias y Perspectivas | CHITEK INNOPOWER",
        desc="Manténgase actualizado con las últimas noticias, artículos técnicos y perspectivas de la industria de CHITEK INNOPOWER.",
        h1a="Noticias y ", h1b="Perspectivas",
        sub="Manténgase informado sobre los últimos desarrollos en tecnología de calidad de energía, tendencias de la industria y soluciones CHITEK.",
        readMore="Leer más", label="Paginación de noticias", prev="Página anterior", next="Página siguiente",
        pageTitle="Noticias y Perspectivas — Página {n} | CHITEK INNOPOWER",
        pageDesc="Página {n} del archivo de noticias y perspectivas de CHITEK INNOPOWER: artículos técnicos, tendencias y casos de calidad de energía.",
    ),
    "ar": dict(
        lang="ar", prefix="/ar", title="الأخبار والرؤى | CHITEK INNOPOWER",
        desc="تابع آخر الأخبار والورقات التقنية ورؤى الصناعة من CHITEK INNOPOWER لحلول جودة الطاقة.",
        h1a="الأخبار والـ", h1b="رؤى",
        sub="تابع أحدث التطورات في تكنولوجيا جودة الطاقة واتجاهات الصناعة وحلول CHITEK.",
        readMore="اقرأ المزيد", label="ترقيم صفحات الأخبار", prev="الصفحة السابقة", next="ال الصفحة التالية".replace("ال ", "ال"),
        pageTitle="الأخبار والرؤى — صفحة {n} | CHITEK INNOPOWER",
        pageDesc="صفحة {n} من أرشيف أخبار ورؤى CHITEK INNOPOWER: أوراق تقنية واتجاهات الصناعة ودراسات جودة الطاقة.",
    ),
}

# (lang, list file, list up, pager file, pager up)
TARGETS = [
    ("zh", "news.astro", "../", "news/page_[page].astro", "../../"),
    ("en", "en/news.astro", "../../", "en/news/page_[page].astro", "../../../"),
    ("es", "es/news/index.astro", "../../../", "es/news/page_[page].astro", "../../../"),
    ("ar", "ar/news/index.astro", "../../../", "ar/news/page_[page].astro", "../../../"),
]

HERO = '''  <!-- Hero Section -->
  <section class="relative w-full overflow-hidden min-h-[33vh] mt-[72px] flex items-center bg-bg-dark text-white">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent"></div>
    </div>
    <div class="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-12">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-barlow-condensed)] tracking-tight mb-6">
        {h1a}<span class="text-brand-orange">{h1b}</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
        {sub}
      </p>
    </div>
  </section>
'''

CARD_BLOCK = '''      <div class="space-y-6">
        {cards.map((card) => (
          <NewsCard
            href={lp(card.href)}
            img={card.img}
            alt={card.alt}
            category={card.category}
            cat={card.cat}
            date={card.date}
            title={card.title}
            desc={card.desc}
            readMore="{readMore}"
          />
        ))}
      </div>
'''

PAGER_BLOCK = '''      <NewsPager
        current={current}
        total={total}
        url={pageUrl}
        label="{label}"
        prevLabel="{prev}"
        nextLabel="{next}"
      />
'''


def lp_line(t):
    if t["prefix"]:
        return (
            "const isLocal = /localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0/.test(Astro.url.host);\n"
            "const lp = (p: string) => isLocal ? '%s' + p : p;" % t["prefix"]
        )
    return "const lp = (p: string) => p;"


def fill(block, mapping):
    """模板里含大量 JSX 花括号，用 replace 而不是 str.format。"""
    out = block
    for k, v in mapping.items():
        out = out.replace("{%s}" % k, v)
    return out


def list_page(t, up):
    L = t["lang"]
    hero = HERO.format(h1a=t["h1a"], h1b=t["h1b"], sub=t["sub"])
    cards = fill(CARD_BLOCK, {"cards": L + "NewsCards", "readMore": t["readMore"]})
    pager = fill(PAGER_BLOCK, {"label": t["label"], "prev": t["prev"], "next": t["next"]})
    return f"""---
import BaseLayout from '{up}layouts/BaseLayout.astro';
import Sidebar from '{up}components/Sidebar.astro';
import NewsCard from '{up}components/news/NewsCard.astro';
import NewsPager from '{up}components/news/NewsPager.astro';
import {{ {L}NewsCards, NEWS_PER_PAGE, NEWS_TOTAL_PAGES }} from '{up}data/{L}NewsCards.js';

{lp_line(t)}

const current = 1;
const total = NEWS_TOTAL_PAGES;
const cards = {L}NewsCards.slice(0, NEWS_PER_PAGE);
const pageUrl = (n: number) => (n === 1 ? lp('/news/') : lp('/news/page_' + n + '/'));
---
<BaseLayout title="{t['title']}" description="{t['desc']}" lang="{L}" alternateLangs={{['zh', 'en', 'es', 'ar']}}>
  <Sidebar lang="{L}" />

{hero}
  <!-- Latest Articles -->
  <section id="articles" class="pt-10 md:pt-14 pb-16 md:pb-20 bg-white">
    <div class="max-w-7xl mx-auto px-5 md:px-12">
{cards}
{pager}    </div>
  </section>
</BaseLayout>
"""


def pager_page(t, up):
    L = t["lang"]
    hero = HERO.format(h1a=t["h1a"], h1b=t["h1b"], sub=t["sub"])
    cards = fill(CARD_BLOCK, {"cards": "cards", "readMore": t["readMore"]})
    pager = fill(PAGER_BLOCK, {"label": t["label"], "prev": t["prev"], "next": t["next"]})
    return f"""---
import BaseLayout from '{up}layouts/BaseLayout.astro';
import Sidebar from '{up}components/Sidebar.astro';
import NewsCard from '{up}components/news/NewsCard.astro';
import NewsPager from '{up}components/news/NewsPager.astro';
import {{ {L}NewsCards, NEWS_PER_PAGE, NEWS_TOTAL_PAGES }} from '{up}data/{L}NewsCards.js';

// Flat URL: /{L}/news/page_2/ ... (empty prefix for zh => /news/page_2/)
// getStaticPaths runs before the top-level statements below, so it can only use
// values that come from imports (NEWS_TOTAL_PAGES), never local consts.
export function getStaticPaths() {{
  return Array.from({{ length: NEWS_TOTAL_PAGES - 1 }}, (_, i) => ({{ params: {{ page: String(i + 2) }} }}));
}}

const total = NEWS_TOTAL_PAGES;
const current = Number(Astro.params.page);
const start = (current - 1) * NEWS_PER_PAGE;
const cards = {L}NewsCards.slice(start, start + NEWS_PER_PAGE);

{lp_line(t)}
const pageUrl = (n: number) => (n === 1 ? lp('/news/') : lp('/news/page_' + n + '/'));
---
<BaseLayout
  title={{`{t['pageTitle'].replace('{n}', '${current}')}`}}
  description={{`{t['pageDesc'].replace('{n}', '${current}')}`}}
  lang="{L}"
  alternates={{false}}
>
  <Sidebar lang="{L}" />

{hero}
  <!-- Articles (page 2+) -->
  <section id="articles" class="pt-10 md:pt-14 pb-16 md:pb-20 bg-white">
    <div class="max-w-7xl mx-auto px-5 md:px-12">
{cards}
{pager}    </div>
  </section>
</BaseLayout>
"""


REF.mkdir(parents=True, exist_ok=True)
print("备份目录:", REF.as_posix())
for lang, list_rel, list_up, pager_rel, pager_up in TARGETS:
    t = T[lang]
    for rel in (list_rel, pager_rel):
        src = PAGES / rel
        if src.exists():
            backup_name = rel.replace("\\", "/").replace("/", "__")
            shutil.copyfile(src, REF / backup_name)
            print("backup", rel, "->", backup_name)
    (PAGES / list_rel).write_text(list_page(t, list_up), encoding="utf-8", newline="\n")
    print("written", list_rel)
    (PAGES / pager_rel).write_text(pager_page(t, pager_up), encoding="utf-8", newline="\n")
    print("written", pager_rel)
