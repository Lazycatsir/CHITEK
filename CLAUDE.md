# CHITEK B2B Industrial Website

## 项目概述

B2B 工业网站，目标：将访问者转化为询盘。已迁移到 Astro 静态站点框架。

- **框架**：Astro 6.x + Tailwind CSS v4 (@tailwindcss/vite)
- **字体**：Barlow + Barlow Condensed，自托管 WOFF2
- **部署目标**：Netlify
- **当前语言**：中文（默认）+ 英文/西语/阿语/葡语（多语言已配置）

## 目录结构

```
CHITEK/
├── public/
│   └── assets/
│       ├── fonts/                   # 自托管 WOFF2（Barlow + Barlow Condensed）
│       └── images/                  # 图片资源
│   └── robots.txt                   # SEO 爬虫规则
├── src/
│   ├── components/
│   │   ├── Nav.astro               # 全局导航（desktop + mobile menu）
│   │   ├── Footer.astro           # 全局页脚
│   │   └── Sidebar.astro          # 右侧联系栏
│   ├── env.d.ts                    # Astro 类型声明
│   ├── i18n/
│   │   └── index.ts               # 多语言路径映射（getHreflang/getAltHref）
│   ├── layouts/
│   │   └── BaseLayout.astro       # 基础布局（head/meta/OG/Nav/Footer/Sidebar/scroll动画）
│   ├── pages/
│   │   ├── index.astro            # 中文首页（默认语言，根路径）
│   │   ├── about.astro            # 中文 - 关于我们
│   │   ├── contact.astro          # 中文 - 联系我们
│   │   ├── products.astro         # 中文 - 产品中心
│   │   ├── services.astro         # 中文 - 服务
│   │   ├── solutions.astro        # 中文 - 解决方案
│   │   ├── news.astro             # 中文 - 新闻
│   │   ├── news/                  # 中文新闻文章
│   │   ├── en/                    # 英文页面
│   │   ├── es/                    # 西语页面
│   │   ├── ar/                    # 阿语页面
│   │   └── pt/                    # 葡语页面
│   └── styles/
│       └── global.css             # Tailwind v4 入口（@theme + @font-face + @keyframes）
├── astro.config.mjs
├── netlify.toml                   # 部署配置 + 重定向规则
├── package.json
├── .gitignore
└── CLAUDE.md
```

## 多语言路由

Astro i18n 已配置，中文为默认语言：

| 语言 | 路由 | 域名 |
|------|------|------|
| 中文（zh） | 根路径：`/about`, `/products` | chitek-inno.com |
| 英文（en） | `/en/about`, `/en/products` | en.chitek-inno.com |
| 西语（es） | `/es/about`, `/es/products` | es.chitek-inno.com |
| 阿语（ar） | `/ar/about`, `/ar/products` | ar.chitek-inno.com |
| 葡语（pt） | `/pt/about`, `/pt/products` | pt.chitek-inno.com |

- `astro.config.mjs` 中 `i18n.defaultLocale: 'zh'`，`prefixDefaultLocale: false`
- Netlify `netlify.toml` 配置各语言子域名重定向（`force = true`，静态资源 `/_astro/*` 和 `/assets/*` 排除在外）
- 语言切换逻辑在 `Nav.astro` 的 `langHref()` 函数
- hreflang + canonical 在 `BaseLayout.astro` 中根据 `lang` prop 自动生成各语言子域名 URL
- 中文 canonical → `chitek-inno.com/*`，英文 → `en.chitek-inno.com/*`，西语 → `es.chitek-inno.com/*`，阿语 → `ar.chitek-inno.com/*`，葡语 → `pt.chitek-inno.com/*`
- **新闻页面仅支持 zh/en/es/ar**，葡语（pt）无新闻内容，导航栏和页脚不显示新闻链接
- Sitemap 由 `@astrojs/sitemap` 自动生成，按语言子域名分配 URL

## 工作流程

- **默认不提交 Git**：改完代码后不主动 git commit/push，只在用户明确说"提交"时才执行
- **构建验证**：改完代码后运行 `npm run build` 验证无报错

## 编码规范

- **Astro**：`.astro` 组件文件，frontmatter + HTML + `<style>` + `<script>`
- **CSS 类名**：Tailwind utility 类为主，camelCase 自定义类
- **JS**：页面级 `<script>` 标签，module-scoped。全局函数用 `window.* = function(){}` 暴露给 onclick 属性
- **禁止**内联 `style` 属性（除非动态计算值或 Tailwind v4 不支持的非标准 delay 值）

## CSS 规范

以 **Tailwind v4 + @tailwindcss/vite** 为核心方案。

### 原则

| 场景 | 方案 | 理由 |
| --- | --- | --- |
| 常规样式 | Tailwind 工具类 | 开发快、一致性高 |
| 复杂样式 | `<style>` 标签（.astro 组件内） | Tailwind 处理复杂场景冗长 |
| 全局基础样式 | `src/styles/global.css` 的 `@theme` | 全站共享设计令牌 |

### Tailwind v4 + Astro 注意事项

- **任意变体 `[&.class]`** 不会被 Tailwind v4 的 Rust-based scanner 检测到（scanner 在 Astro 编译前读取源文件）
- **解决方案**：使用 `<style>` 标签写纯 CSS 替换
- **标准工具类**（非任意 variant）正常检测

### 设计令牌

定义在 `src/styles/global.css` 的 `@theme` 块中：

| 令牌 | 值 | 用途 |
|------|-----|------|
| `color-brand-orange` | `#ff6b1a` | 品牌主色 |
| `color-bg-dark` | `#07101e` | 深色背景 |
| `color-text-dark` | `#1a1a1a` | 正文色 |
| `font-family-barlow` | `"Barlow", sans-serif` | 正文字体 |
| `font-family-barlow-condensed` | `"Barlow Condensed", sans-serif` | 标题字体 |

## 图片路径规则

在 Astro 中使用**绝对路径**（以 `/` 开头），指向 `public/` 目录：

```html
<!-- 正确 -->
<div class="bg-[url('/assets/images/hero.jpg')]" />

<!-- 错误：相对路径在 CSS 中解析错误 -->
<div class="bg-[url('assets/images/hero.jpg')]" />
```

## 写作风格

- B2B 工业风：清晰、专业、建立信任
- 避免夸张营销语言
- 聚焦技术指标和实际效益（如 THD 18% → 4.1%）

## 本地开发

```bash
npm run dev     # astro dev（热更新）
npm run build   # astro build（生产构建到 dist/）
npm run preview # astro preview（预览生产构建）
```

## 打开首页

用户说"打开首页"时，执行：

1. 检查 dev server 是否在运行：`curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/`（返回 200 即正常）
2. 如果没运行，后台启动：
   ```bash
   cd /f/下载/CHITEK && /c/Users/lenovo/.workbuddy/binaries/node/versions/22.22.2/node.exe node_modules/astro/bin/astro.mjs dev --host --port 4321
   ```
3. 等待端口绑定（首次启动 vite 依赖优化约需 1–2 分钟，用 curl 重试循环检测）
4. 返回 URL `http://localhost:4321/`（中文首页）或 `http://localhost:4321/en/`（英文首页）

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Astro 6.x | 静态站点框架 |
| Tailwind CSS v4 (@tailwindcss/vite) | 原子化 CSS |
| @astrojs/sitemap | 自动生成 sitemap（按子域名分配 URL） |
| 全局 CSS（global.css） | @theme + @font-face + 自定义样式 |
| 自托管 WOFF2 | Barlow + Barlow Condensed 字体 |
| Netlify | 静态部署 + 表单处理 |

## 页面结构规范

每个 section 必须包含：

- headline（标题）
- supporting text（支持性文本）
- 可选的 CTA（行动号召按钮）

## 新闻系统（News）

### 文章总数
- zh(中文): 20 篇（含测试新增 `blog-ahf-water-treatment-plants`）
- en(英文): 20 篇
- es(西语): 20 篇
- ar(阿语): 20 篇
- pt(葡语): **无新闻页面**，导航和页脚隐藏新闻入口

### 发布流水线（完整流程 → 见 `README.md`）

```
百家号 .txt ──→ zh .astro ──→ en/es/ar 翻译同步
LinkedIn .md ──→ en .astro ──→ es/ar 翻译同步
                                  ↓
                         4 语列表页手工插卡片(硬编码 HTML)
```

### 输入源
- **百家号 .txt**：`web-crawler/outreach/templates/百家号文章/`，纯文本，首行"标题: XXX"，产出中文站
- **LinkedIn .md**：`web-crawler/outreach/templates/blog - linkedin/`，Markdown，产出英文站

### 生成 .astro 文件必需字段

**frontmatter (`article = { ... }` 对象)：**
- `title` / `category` / `date`(ISO yyyy-mm-dd) / `dateDisplay`(本地化) / `author` / `readTime` / `description`(SEO ~120字) / `keywords`(数组)

**Sidebar 数据：** `otherArticles`(3篇)、`relatedProducts`(3个)、`relatedCases`(3个)，需同步翻译

**SEO：** `<title>` + OG 标签 + Schema.org Article JSON-LD（`datePublished`/`dateModified` 硬编码 ISO，与 `article.date` 一致）

**ogImage：** `https://chitek-inno.com/assets/images/index-product-{ahf,svg}.webp` 或 `blog/sic-ahf-launch.webp`

### 详情页结构（参照 `conformal-coating-ahf-reliability.astro`）
1. `BaseLayout` + JSON-LD (slot="head") + `<Sidebar lang="X" />`（自闭合组件）
2. Hero section：深色背景 `pt-[72px] bg-bg-dark` → 回链"Back to News" → 分类标签+日期+阅读时间 → 标题(`font-barlow-condensed`)
3. Content section：白色背景 `py-12 md:py-16` → flex 布局 → 左侧 `article`：
   - Featured image：`h-64 md:h-96`，`/assets/images/news/news-img-N.webp`
   - 正文包在 `<div class="prose prose-lg max-w-none">` 内
4. 右侧 `<aside>` inline sidebar：More Articles / Related Products / Customer Cases

### 列表页更新 —— 最关键步骤

**⚠️ 4 个列表文件是硬编码 HTML**，非 `Astro.glob()` 动态生成：

| 语言 | 文件 |
|------|------|
| zh | `src/pages/news.astro` |
| en | `src/pages/en/news.astro` |
| es | `src/pages/es/news/index.astro` |
| ar | `src/pages/ar/news/index.astro` |

**卡片规则：**
- `<img src="/assets/images/news/news-img-N.webp">` — 必须用真实图片，禁止 SVG 渐变装饰
- 分类标签 CSS：`text-xs font-semibold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full`
- 日期：`text-xs text-text-muted`
- Read More：`inline-flex items-center text-brand-orange text-sm font-semibold`
- 箭头 SVG：`path d="M5 12h14M12 5l7 7-7 7"`，`ml-1`
- **日期严格降序**，新卡片必须按实际日期找到正确插入位置

**分页结构（满 8 张后出现）：**
`<div class="flex items-center justify-center gap-2 mt-16">` + 左箭头(`M15 19l-7-7 7-7`) + 页码 + 右箭头(`M9 5l7 7-7 7`)

### 多语言差异
- zh: 裸路径 `/news/slug`，无 `lp()` 包裹
- en: `lp('/news/slug')`——本地 dev 加 `/en/` 前缀，线上裸路径
- es: 硬编码 `/es/news/slug`
- ar: 硬编码 `/ar/news/slug` + `dir="rtl"`
- pt: 跳过（无新闻页）

**阅读全文文本：** en"Read More" / zh"阅读全文" / es"Leer Más" / ar"اقرأ المزيد"

### 构建验证
```bash
# 优先 dev server 预览
cd F:/下载/CHITEK
node_modules/astro/bin/astro.mjs dev --host --port 4321
# 检查 /zh/en/es/ar/news 及各详情页是否 200

# 生产构建
npm run build
# 检查 dist/ 下有对应 /news/slug/index.html + sitemap 包含新页面
```

### 踩坑速查
- 卡片必须插在 `space-y-6` 内（不是 Sidebar 和 Hero 之间）
- 卡片 href 必须引号包裹：`href="/news/slug"`（非 `href=/news/slug`）
- `article.date` 必须 ISO，`dateDisplay` 单独保留本地化
- 所有语言必须定义 `lp()`：en 带 dev→/en/ 逻辑，非 en 用 `const lp = (p) => p;`
- JS 模板 `${}` 与 Python f-string 冲突 → 用 `.replace()` 避开
- 详情页 JSON-LD 中 `publisher.logo.url` 必须用 `logo.webp`（非 `Chitek-logo.png`）
- **每篇详情页必须包含 SEO Keywords 标签区**：`<!-- SEO Keywords -->` + `<div>` 渲染 `article.keywords.map()`，位于正文与 Author 之间。`article.keywords` 必须在 frontmatter 中定义，注意 JS 对象逗号分隔
- 新增后必须跑一次日期降序校验
- **完整踩坑表（22 条）→ 见 `README.md`**
