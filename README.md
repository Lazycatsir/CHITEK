# CHITEK INNOPOWER — 官网新闻发布流水线

> 完整参考文档。所有新增/修改新闻文章的操作流程、规范、模板、踩坑记录均在此。

## 一、流水线总览

```
百家号文章(.txt) ──→ zh .astro ──→ en/es/ar 翻译同步
LinkedIn 长文(.md) ──→ en .astro ──→ es/ar 翻译同步
                                      ↓
                             4 语列表页手工插卡片
                             (硬编码 HTML，非 Astro.glob)
```

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

## 四、多语言同步

| 语言 | 目录 | 链接格式 | 特殊要求 |
|------|------|---------|---------|
| zh(中文) | `src/pages/news/` | 裸路径 `/news/slug` | import 路径 `../../layouts/` |
| en(英文) | `src/pages/en/news/` | `lp('/news/slug')` | import 路径 `../../../layouts/` + dev 模式 `lp()` |
| es(西语) | `src/pages/es/news/` | 硬编码 `/es/news/slug` | import 同 en；分类标签西语 |
| ar(阿语) | `src/pages/ar/news/` | 硬编码 `/ar/news/slug` | RTL `dir="rtl"`；阿拉伯月份；blockquote `border-r-4` |
| pt(葡语) | **不支持** | — | 导航和页脚隐藏新闻入口 |

**翻译范围：** title / category / dateDisplay / 全部正文 / sidebar。产品参数和专利号不译。

**"阅读全文"文本：** en"Read More" / zh"阅读全文" / es"Leer Más" / ar"اقرأ المزيد"

## 五、列表页更新（最关键步骤）

### 5.1 4 个硬编码文件

| 语言 | 文件 |
|------|------|
| zh | `src/pages/news.astro` |
| en | `src/pages/en/news.astro` |
| es | `src/pages/es/news/index.astro` |
| ar | `src/pages/ar/news/index.astro` |

所有卡片写在 `<div class="space-y-6">` 内，每条增删必须手动修改 4 个文件。

### 5.2 卡片 HTML 模板

```html
<!-- {DATE}: {SLUG} -->
<a href="{HREF}" class="group bg-white rounded-xl overflow-hidden border border-border-light hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row no-underline">
  <div class="relative w-full md:w-[320px] lg:w-[380px] h-48 md:h-64 bg-gray-50 overflow-hidden shrink-0">
    <img src="/assets/images/news/news-img-N.webp" alt="{title}" class="w-full h-full object-cover" loading="lazy" />
  </div>
  <div class="p-6 md:p-8 flex flex-col justify-center flex-1">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{category}</span>
      <span class="text-xs text-text-muted">{dateDisplay}</span>
    </div>
    <h3 class="text-xl font-bold text-text-dark mb-3 group-hover:text-brand-orange transition-colors">{title}</h3>
    <p class="text-text-mid text-sm leading-relaxed mb-4">{description}</p>
    <span class="inline-flex items-center text-brand-orange text-sm font-semibold">
      {read_more}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 ml-1">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </span>
  </div>
</a>
```

### 5.3 插入规则

- **日期严格降序**：找到比新卡片日期旧的现有卡片，插在这张之前。不能简单堆顶部。
- **卡片必须用真实图片**：`<img src="/assets/images/news/news-img-N.webp">`，禁止 SVG 渐变装饰。
- **分页结构**（满 8 张出现）：`<div class="flex items-center justify-center gap-2 mt-16">` + 左箭头(`M15 19l-7-7 7-7`) + 页码 + 右箭头(`M9 5l7 7-7 7`)。确保 `<!-- Pagination -->` 注释存在。

### 5.4 分类标签色值

| 分类 | CSS 类 |
|------|--------|
| Technology | `text-brand-orange bg-brand-orange/10` |
| Case Study | `text-[#2e7d32] bg-[#e8f5e9]` |
| Product Update | `text-[#1565c0] bg-[#e3f2fd]` |
| Industry News | `text-[#7b1fa2] bg-[#f3e5f5]` |
| Sustainability | `text-[#00695c] bg-[#e0f2f1]` |

### 5.5 图片资源

- **新闻配图**：`public/assets/images/news/news-img-1.webp` ~ `news-img-8.webp`（8 张通用图）
- **ogImage**：`https://chitek-inno.com/assets/images/index-product-ahf.webp`（产品通用）或 `blog/sic-ahf-launch.webp`
- 新增文章时挑一张不冲突的 `news-img-N.webp`，卡片和详情页 featured image 用同一张

## 六、构建验证

```bash
# 1. Dev server 预览（推荐，优先使用）
cd F:/下载/CHITEK
node_modules/astro/bin/astro.mjs dev --host --port 4321
# 分别访问 /news /en/news /es/news /ar/news 及各详情页，确认 200

# 2. 正式构建
npm run build

# 3. 检查产物
# - dist/ 下有对应 /news/slug/index.html
# - 列表页 dist HTML 中新卡片存在
# - Sitemap 包含新页面

# 4. 部署
# git push 触发 Netlify 自动部署
```

## 七、踩坑备忘录

| # | 坑 | 表现 | 修复 |
|---|-----|------|------|
| 1 | **列表页是硬编码** | 改 detail 不自动更新列表 | 每次新增必须手动改 4 个列表文件 |
| 2 | **日期不是严格降序** | 2025 文章跑到了 2026 前面 | 插入前比对全量日期，用脚本验证降序 |
| 3 | **href 缺引号** | 生成成 `href=/ar/news/slug`(非法 HTML) | en 用 `lp()` 不受影响；zh/es/ar 必须 `href="/..."` |
| 4 | **孤儿卡片** | 新卡被插在 `<Sidebar>` 和 Hero 之间而非 `#articles` 内 | 确保在 `space-y-6` 容器内操作 |
| 5 | **分页块重复/缺失** | 两个分页容器或缺少左箭头/注释 | 核对 en 模板，用 grep 检查唯一性 |
| 6 | **`article.date` 写成本地化串** | `date: "Oct 05, 2024"` 而非 ISO | 强制用 `yyyy-mm-dd` 格式，`dateDisplay` 单独保留 |
| 7 | **JSON-LD 日期不匹配** | `datePublished` 与 `article.date` 不一致 | 两者必须同步为同一 ISO 日期 |
| 8 | **ogImage 路径不对** | 使用相对路径而非完整域名 | 必须是 `https://chitek-inno.com/assets/images/...` |
| 9 | **添加后忘记校验** | 列表卡片顺序看似正确但实际降序断裂 | 生成后跑一次日期降序扫描脚本 |
| 10 | **en 详情页的 `otherArticles` href** | 使用了 `/news/slug` 而非 `lp('/news/slug')` | en 必须加 `lp()` 包装 |
| 11 | **ar 卡片日期格式** | 中文月份混入阿语列表 | 5 月用 `مايو` 而非 `5月` |
| 12 | **卡片用 SVG 渐变代替真实图片** | 列表页卡片左侧为 SVG 图标，无图片 | 必须用 `<img>` + `news-img-N.webp` |
| 13 | **详情页缺少 Back to News 回链** | Hero 区无返回新闻列表链接 | 参照标准模板加回链 + SVG 箭头 |
| 14 | **详情页缺少 featured image** | 正文前无主图 | 在 prose 前加 `h-64 md:h-96` 图片容器 |
| 15 | **Sidebar 中 `globals()` 不存在** | ReferenceError | 所有语言定义 `lp()`；非 en 恒等函数 |
| 16 | **详情页标题字体不一致** | 使用 `font-heading` 而非 `font-barlow-condensed` | 统一用 `font-[family-name:var(--font-barlow-condensed)]` |
| 17 | **`${}` 与 Python f-string 冲突** | 模板生成语法错误 | 用 `__PLACEHOLDER__` + `.replace()` 避开 f-string |
| 18 | **JSON-LD logo 路径不一致** | 使用 `Chitek-logo.png` 而非 `logo.webp` | 必须用 `{SITE}/assets/images/logo.webp` |
| 19 | **非 en 语言缺少 `lp()` 定义** | `<Sidebar>` 中链接调用 `lp()` 报错 | 所有语言统一定义 `lp()`；非 en 用恒等函数 |
| 20 | **图片路径缺少 `/news/` 子目录** | 写成 `news-img-6.webp` 而非 `/assets/images/news/news-img-6.webp` | 完整路径：`/assets/images/news/news-img-N.webp` |
| 21 | **详情页缺少 SEO Keywords 标签区** | 正文与 Author 之间无 `#tag` 关键词块 | 所有详情页 **必须** 包含 `<!-- SEO Keywords -->` + `<div>` 渲染 `article.keywords.map()` |
| 22 | **`article.keywords` 未定义或遗漏** | 编译错误 `Expected "}" but found "keywords"` | `keywords` 数组必须在 `article` 对象中定义，位于 `readTime` 之后；注意 JS 对象须逗号分隔 → `readTime: "5 min read",\n  keywords: [...]` |

## 八、关联文件

| 文件 | 说明 |
|------|------|
| `CLAUDE.md` | WorkBuddy 工作规范（新闻部分摘要） |
| `web-crawler/outreach/templates/README.md` | 内容外联工作区 — 第 8 节为新闻流水线的独立文档 |
| `web-crawler/outreach/templates/workflow/website-publish-pipeline.yaml` | 网站发布流水线的机器可读 YAML 定义 |

---

*最后更新：2026-07-20*
