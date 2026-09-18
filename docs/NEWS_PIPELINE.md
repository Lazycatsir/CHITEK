# 新闻发布流水线（NEWS PIPELINE）

> 完整参考文档。所有新增/修改新闻文章的操作流程、规范、模板、踩坑记录均在此。
>
> 本文原为仓库根目录的 `README.md`，2026-09-18 迁入 `docs/`（内容未改），
> 让根目录 `README.md` 回归「项目首页 + 文档地图」。
> 项目规则见 `CLAUDE.md`。

## 一、流水线总览

```
百家号文章(.txt) ──→ zh .astro ──┐
LinkedIn 长文(.md) ──→ en .astro ─┼─→ 翻译同步（同 slug 共 4 份 .astro）
                                  │
                                  ▼
                        npm run news:sync        ← 只跑这一条
                        （读 120 篇 frontmatter，重写 src/data/*NewsCards.js）
                                  │
                                  ▼
                        列表页 + 分页页自动成型（模板无需改动）
```

> **核心变化（2026-09-18 起）：列表页不再是硬编码 HTML。**
> 新增文章**不需要**手工插卡片、不需要比对日期降序、不需要改分页——
> 列表页从 `src/data/{lang}NewsCards.js` 读卡片，页数由 `NEWS_TOTAL_PAGES` 推导。

## 二、输入源

| 来源 | 路径 | 格式 | 产出语言 | 特殊处理 |
|------|------|------|---------|---------|
| 百家号 | `web-crawler/outreach/templates/百家号文章/*.txt` | 纯文本，首行"标题: XXX" | zh | 剔除文末平台署名块(3行{年份}{产品}xxx)；原文无日期→需指定日期；SEO堆词段可精简 |
| LinkedIn | `web-crawler/outreach/templates/blog - linkedin/*.md` | Markdown(#标题/##小节/列表) | en | 剔除末尾 hashtag 行；保留 CTA 提问行(可选) |

## 三、生成 .astro 文件

### 3.1 模板参考

`src/pages/en/news/conformal-coating-ahf-reliability.astro`（标准结构，推荐参照）
或 `src/pages/news/apf-industry-practitioner-2026.astro`（较旧模板）

### 3.2 必需字段

**frontmatter（`article = { ... }` 对象）：**

> ⚠️ 下面 5 个字段是**列表页卡片的硬要求**（标题/分类/日期/摘要都直接取它们），缺 `description` 卡片摘要就是空白：
> `title` · `category` · `date` · `dateDisplay` · `description`

- `title`（文章标题）
- `category`（分类：Technology / Case Study / Product Update / Industry News / Sustainability）
- `date`（ISO yyyy-mm-dd，须与 JSON-LD datePublished 一致）
- `dateDisplay`（本地化可读日期，如 "Jul 1, 2026" / "2026年7月1日" / "1 jul 2026" / "1 يوليو 2026"）
- `author`（"CHITEK Technical Team" 或各语言翻译）
- `readTime`（"5 min read" / "5 分钟阅读"）
- `description`（SEO 描述，截取正文前 120 字）
- `keywords`（SEO 关键词数组）

**Sidebar 数据（3 个数组，须同步翻译）：**
- `otherArticles` — 3 篇相关文章，每项包含 `title / category / href / color`
- `relatedProducts` — 3 个相关产品，每项包含 `name / href / icon`
- `relatedCases` — 3 个客户案例，每项包含 `name / industry`

### 3.3 详情页 HTML 结构

```
<BaseLayout title description lang ogImage>
  <!-- Schema.org JSON-LD (slot="head") -->
  <Sidebar lang="X" />                     ← 自闭合组件
  
  <!-- Hero section -->
  <section class="pt-[72px] bg-bg-dark text-white relative overflow-hidden">
    <a>← Back to News (回链, 带 SVG 箭头)</a>
    <span>{category}</span> · <span>{dateDisplay}</span> · <span>{readTime}</span>
    <h1 class="font-barlow-condensed">{title}</h1>
  </section>
  
  <!-- Content section -->
  <section class="py-12 md:py-16 bg-white">
    <div class="flex flex-col lg:flex-row gap-10">
      <article class="flex-1 max-w-4xl">
        <img class="h-64 md:h-96" src="/assets/images/news/news-img-N.webp" />  ← Featured image
        <div class="prose prose-lg max-w-none">                                 ← 正文容器
          ...body HTML...
        </div>
        <!-- SEO Keywords -->                                                    ← 正文与作者之间，必需的标签区
        <div class="mt-10 pt-6 border-t border-border-light">
          <div class="flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span class="text-xs text-text-muted bg-gray-100 px-3 py-1 rounded-full">#{keyword}</span>
            ))}
          </div>
        </div>
        <!-- Author & Share -->
      </article>
      <aside class="lg:w-[320px]">  ← Inline sidebar
        More Articles / Related Products / Customer Cases
      </aside>
    </div>
  </section>
</BaseLayout>
```

### 3.4 正文 HTML 映射

| Markdown/原文 | Astro HTML |
|------|---------|
| ## 标题 | `<h2 class="text-2xl font-bold font-[family-name:var(--font-barlow-condensed)] text-text-dark mt-10 mb-4">` |
| 段落 | `<p class="text-text-mid leading-relaxed mb-6">` |
| 无序列表 | `<ul class="list-disc list-inside space-y-2 mb-6 text-text-mid leading-relaxed">` |
| 引用 | `<blockquote class="border-l-4 border-brand-orange pl-4 italic text-text-mid my-6">` |
| 表格 | `<table class="w-full border-collapse">` |

### 3.5 JSON-LD 格式

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{desc}",
  "image": "https://chitek-inno.com/assets/images/...",
  "author": { "@type": "Organization", "name": "CHITEK Technical Team" },
  "publisher": {
    "@type": "Organization",
    "name": "CHITEK INNOPOWER",
    "logo": { "@type": "ImageObject", "url": "https://chitek-inno.com/assets/images/logo.webp" }
  },
  "datePublished": "yyyy-mm-dd",
  "dateModified": "yyyy-mm-dd",
  "keywords": "keyword1, keyword2, ..."
}
```

> ⚠️ `publisher.logo.url` **必须用 `logo.webp`**，不要用 `Chitek-logo.png`

### 3.6 `lp()` 函数（链接前缀）

**所有语言必须定义 `lp()` 函数**，否则 `<Sidebar>` 和 inline sidebar 中的链接会报错。

- en：定义带 dev 模式的版本（本地开发加 `/en/` 前缀，线上裸路径）
- zh/es/ar：定义恒等函数 `const lp = (p) => p;`

> 上面说的是**详情页**（文章 `.astro`）。
> **列表页 / 分页页**的 `lp()` 由 `_gen_news_pages.py` 统一生成：en/es/ar 都带 dev 前缀
> （本地 dev 要 `/es/news/…`），zh 为恒等。**不要手改这两个函数**。

## 四、多语言同步

| 语言 | 目录 | 详情页链接格式 | 特殊要求 |
|------|------|---------|---------|
| zh(中文) | `src/pages/news/` | 裸路径 `/news/slug` | import 路径 `../../layouts/` |
| en(英文) | `src/pages/en/news/` | `lp('/news/slug')` | import 路径 `../../../layouts/` + dev 模式 `lp()` |
| es(西语) | `src/pages/es/news/` | 裸路径 `/news/slug` | import 同 en；分类标签西语 |
| ar(阿语) | `src/pages/ar/news/` | 裸路径 `/news/slug` | RTL `dir="rtl"`；阿拉伯月份；blockquote `border-r-4` |
| pt(葡语) | **不支持** | — | 导航、页脚、语言切换器均隐藏新闻入口 |

> ⚠️ **详情页的 `lp()` 写法目前并不统一**（历史遗留）：
> zh 有 19/30 篇根本没有 `lp()` 定义，es/ar 各有 16/30 篇没有；其余用恒等函数，
> 少数用 `isLocal ? '/es'+p : p`（线上都会退回裸路径，所以不影响线上）。
> 新写文章请照 §3.1 的参照模板抄，别再自创写法。**列表页不受此影响**（由生成器统一产出）。
>
> ⚠️ 文章**目录**是 `src/pages/es/news/`、`src/pages/ar/news/`；
> 而**列表页**文件是 `es/news/index.astro` / `ar/news/index.astro`（zh/en 为 `news.astro`）。
> 列表页与分页页由生成器产出，见 §五。

**翻译范围：** title / category / dateDisplay / 全部正文 / sidebar。产品参数和专利号不译。

**"阅读全文"文本：** en"Read More" / zh"阅读全文" / es"Leer Más" / ar"اقرأ المزيد"

## 五、新增一篇文章（标准操作，3 步）

> 列表页已改为数据驱动，**旧的手工插卡片流程作废**。

### 5.1 放好 4 份同 slug 的文章文件

| 语言 | 路径 |
|------|------|
| zh | `src/pages/news/<slug>.astro` |
| en | `src/pages/en/news/<slug>.astro` |
| es | `src/pages/es/news/<slug>.astro` |
| ar | `src/pages/ar/news/<slug>.astro` |

四边的 slug（文件名去掉 `.astro`）**必须完全相同**，否则第 2 步会拦下。

### 5.2 跑一条命令同步列表数据

```bash
npm run news:sync        # = python _extract_all_news.py
```

它做的事：
1. 读 4 个目录下每篇文章 frontmatter 里的 `article` 对象
2. 重写 `src/data/{zh,en,es,ar}NewsCards.js`（卡片顺序 / 总数 / 总页数全部自动）
3. 校验四语 slug 集合一致 —— 不一致时**退出码 1 且不写任何文件**（避免半截数据上线）

> 翻译还没做完、想先只同步一部分？加 `--allow-partial` 放行（仅警告）：
> `npm run news:sync -- --allow-partial`

### 5.3 校验

```bash
npm run news:check                                    # 离线结构检查（81 项，不需要 dev server）
npm run news:check -- --http http://localhost:4321    # 追加在线渲染检查（合计 157 项）
```

### 5.4 不需要做的事

| ❌ 不用做 | 为什么 |
|------|------|
| 手动改 4 个列表页 | 列表页读 `src/data/*NewsCards.js` |
| 手动插卡片、比对日期 | 数据文件按 `article.date` 自动降序 |
| 手动改分页 | `NEWS_TOTAL_PAGES` 由卡片数推导 |
| 手动加 page_4 | 加到第 31 篇时自动出现 `/news/page_4/` |

### 5.5 什么时候才需要 `npm run news:gen`

只有**改列表页版式 / hero / UI 文案**时才跑（= `python _gen_news_pages.py`）。
它会重写 8 个页面文件，并把被覆盖的旧文件备份到 `docs/_ref/news-gen-<时间戳>/`。
**新增文章不要跑它。**

### 5.6 架构（三层）

```
文章 .astro 里 frontmatter 的 article 对象         ← 唯一数据源（人工维护）
        │   npm run news:sync
        ▼
src/data/{zh,en,es,ar}NewsCards.js                ← 自动生成（勿手改）
        │   Astro 构建时读取
        ▼
列表页 {lang}/news.astro  +  分页页 news/page_[page].astro   ← 模板（勿手改）
组件：src/components/news/NewsCard.astro、NewsPager.astro
```

### 5.7 图片资源

- **卡片 & 详情页 featured image**：正文里第一张 `/assets/images/news/*.webp` 或 `/assets/images/blog/*.webp` 会被自动抓为卡片配图
- 正文没有配图 → 自动按 slug 哈希挑一张 `news-img-1~8.webp` 兜底（**稳定**：新增文章不会打乱其他文章的图）
- **ogImage**：`https://chitek-inno.com/assets/images/index-product-{ahf,svg}.webp` 或 `blog/sic-ahf-launch.webp`
- 禁止用 SVG 渐变装饰替代真实图片

**"阅读全文"文本：** en `Read More` / zh `阅读全文` / es `Leer más` / ar `اقرأ المزيد`
（写在 `_gen_news_pages.py` 顶部的 `T` 字典里；改文案后跑 `npm run news:gen`）

## 六、构建验证

```bash
# 1. dev server 预览
cd F:/下载/CHITEK
node_modules/astro/bin/astro.mjs dev --host --port 4321

# 2. 校验（离线 + 在线）
npm run news:check -- --http http://localhost:4321

# 3. 正式构建
npm run build

# 4. 检查产物
# - dist/ 下有 /news/<slug>/index.html
# - dist/ 列表页 HTML 里有新卡片
# - Sitemap 包含新页面与 page_2/page_3

# 5. 部署（git push 触发 Netlify 自动部署）
```

## 七、踩坑备忘录

| # | 坑 | 表现 | 修复 |
|---|-----|------|------|
| 1 | **`article.description` 缺失** | 列表页卡片摘要变空白 | `article` 对象必须有 `description`；脚本会回落 `<BaseLayout description="...">` 并告警 |
| 2 | **`article.dateDisplay` 缺失** | 卡片日期退化成 ISO 或英文格式 | 按各语言格式补：zh `2025年9月15日` / en `Sep 15, 2025` / es `15 sep 2025` / ar `15 سبتمبر 2025`；脚本按 ISO 推导并告警 |
| 3 | **四语 slug 不一致** | 某语言少一篇，列表条数不同 | `news:sync` 直接拦下（退出码 1）；翻译没做完用 `--allow-partial` |
| 4 | **手工改 `src/data/*NewsCards.js`** | 下次 `news:sync` 被覆盖 | 数据文件是生成物，永远改文章 frontmatter |
| 5 | **`article.date` 写成本地化串** | `date: "Oct 05, 2024"` | 必须 `yyyy-mm-dd`；本地化串放 `dateDisplay` |
| 6 | **JSON-LD 日期不匹配** | `datePublished` 与 `article.date` 不一致 | 两者同步为同一 ISO 日期 |
| 7 | **ogImage 用相对路径** | OG 图不生效 | 必须完整域名 `https://chitek-inno.com/assets/images/...` |
| 8 | **`article.keywords` 未定义 / 缺逗号** | `Expected "}" but found "keywords"` | `keywords` 必须在 `article` 对象里；注意 JS 对象尾逗号 |
| 9 | **JSON-LD logo 路径** | 用了 `Chitek-logo.png` | 必须 `{SITE}/assets/images/logo.webp` |
| 10 | **详情页缺 SEO Keywords 标签区** | 正文与 Author 之间无 `#tag` 块 | 必须含 `<!-- SEO Keywords -->` + `article.keywords.map()` |
| 11 | **en 详情页内链少 `lp()`** | 本地 dev 链接 404 | 各语言都定义 `lp()`（en 带 dev 前缀逻辑，zh/es/ar 恒等），sidebar/正文内链走 `lp()` |
| 12 | **ar 日期月份** | 阿语卡片混入数字月份 | 用阿语月名（`أكتوبر` 等），不要 `10/22/2024` |
| 13 | **CRLF 行尾** | 正则 `$` / `\n` 锚点匹配不到 | 本项目 `.astro` 是 CRLF，正则写 `\r?\n` |
| 14 | **生成模板用 `str.format()`** | `unexpected '{' in field name` | 模板含 JSX 花括号 → 用 `replace()` 占位符 |
| 15 | **`src/pages/` 下留备份文件** | 被 Astro 当路由编译 → 垃圾 URL + 进 sitemap | 备份放 `docs/_ref/` 或 `F:\trash` |

## 八、关联文件

| 文件 | 说明 |
|------|------|
| `_extract_all_news.py` | **新增文章后跑这个**（`npm run news:sync`）：读文章 frontmatter → 重写 4 个数据文件 + 校验四语 slug 一致 |
| `_verify_news_i18n.py` | 验证闸门（`npm run news:check`）：离线 81 项结构检查，`--http` 追加在线渲染检查共 157 项 |
| `_gen_news_pages.py` | 只改列表页版式/文案时才跑（`npm run news:gen`）：重写 8 个页面文件并时间戳备份 |
| `src/data/{zh,en,es,ar}NewsCards.js` | 自动生成的卡片数据（**生成物，勿手改**） |
| `src/components/news/NewsCard.astro` / `NewsPager.astro` | 语言无关的卡片 / 分页组件 |
| `README.md`（根目录） | 项目首页 + 快速开始 + 文档地图 |
| `CLAUDE.md`（根目录） | AI 工作规范（新闻部分摘要） |
| `docs/NEWS_PIPELINE.md`（本文） | 新闻发布流水线完整参考 |
| 兄弟仓库 `F:\下载\web-crawler` | 内容外联工作区（**不在本仓库内**）；另见其 `outreach/templates/README.md` 第 8 节 |
| `web-crawler/outreach/templates/workflow/website-publish-pipeline.yaml` | 网站发布流水线的机器可读 YAML 定义（同上，在兄弟仓库内） |

---

*最后更新：2026-09-18*
