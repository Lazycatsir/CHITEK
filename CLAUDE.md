# CHITEK B2B Industrial Website

## 项目概述

B2B 工业网站，目标：将访问者转化为询盘。已迁移到 Astro 静态站点框架。

- **框架**：Astro 6.x + Tailwind CSS v4 (@tailwindcss/vite)
- **字体**：Barlow + Barlow Condensed，自托管 WOFF2
- **部署目标**：Netlify
- **当前语言**：中文（默认）+ 英文/西语/阿语/葡语（多语言已配置）

## 文档地图（本仓库的说明文件都在哪）

> 根目录**只有** `README.md` + `CLAUDE.md` 两个说明文件；`.claude/worktrees/` 下的副本已于 2026-09-18 清空，别再找。

| 文件 | 管什么 | 谁维护 |
|------|--------|--------|
| `README.md` | 项目首页 + 快速开始 + 本文档地图 | 人工 |
| `CLAUDE.md`（本文件） | AI 助手工作规范：技术栈 / 路由 / 编码 / CSS 令牌 / 构建坑 | 人工 |
| `docs/NEWS_PIPELINE.md` | **新闻发布全流程** + 15 条踩坑表（原 `README.md` 正文） | 人工 |
| `docs/交接文档/` | 环境准备 / 首次启动 / 日常任务 / 工具清单 | 人工 |
| `.workbuddy/memory/` | `MEMORY.md`（长期有效事实）+ `PRODUCT_PAGE_SPEC.md` / `NEWS_SPEC.md` / `SEO_SPEC.md`（专题规范）+ `YYYY-MM-DD.md`（每日施工日志） | AI 助手 |
| `docs/_ref/` | 历史备份，**不要**当页面源（会被 Astro 当路由） | AI 助手 |
| 兄弟仓库 `F:\下载\web-crawler` | 百家号 / LinkedIn 原始稿 + 内容外联（**不在本仓库内**） | 人工 |

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
├── README.md                      # 项目首页 + 文档地图
├── CLAUDE.md                      # 本文件：AI 工作规范
└── docs/                          # 新闻流水线 / 交接文档 / 历史备份
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

### 原始开发模式
- **默认不提交 Git**：改完代码后不主动 git commit/push，只在用户明确说"提交"时才执行
- **构建验证**：改完代码后运行 `npm run build` 验证无报错

### 交接后（非技术人员用 OpenCode 管理）
- **工作流**：用户说人话 → AI 改代码 → `npm run build` 验证 → git commit+push → Netlify 自动构建部署
- **构建验证是铁律**：每次实质性修改后必须先 `npm run build` 确保无报错，再推送到 GitHub
- **常见构建失败原因**：`.astro` frontmatter 的 `const article = {...}` 对象字面量缺逗号（尤其是 `readTime` 后接 `keywords` 时最容易漏）
- **构建失败不致命**：Netlify 保留上次成功部署，网站不会下线，只是不更新。修复后重新推送即可
- **多语言同步后再推送**：创建新闻/页面后必须保证各语言文件都存在，避免跳转层上的死链

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
- zh / en / es / ar 各 **30 篇**，四语 slug 完全一致
- pt(葡语)：**无新闻页面**，导航、页脚、语言切换器均不出现新闻入口

### 发布流水线（完整流程 → 见 `docs/NEWS_PIPELINE.md`）

```
百家号 .txt ──→ zh .astro ──┐
LinkedIn .md ──→ en .astro ─┼─→ 翻译同步（同 slug 共 4 份）
                            ▼
                  npm run news:sync     ← 只跑这一条
                            ▼
                  列表页 + 分页页自动成型
```

### ⚠️ 列表页已是数据驱动（2026-09-18 起，旧的硬编码插卡片流程作废）

| 层 | 文件 | 谁维护 |
|----|------|--------|
| 数据源 | 每篇文章 frontmatter 的 `article` 对象 | 人工 |
| 卡片数据 | `src/data/{zh,en,es,ar}NewsCards.js` | `npm run news:sync` 生成，**勿手改** |
| 页面模板 | `{lang}/news.astro` + `news/page_[page].astro` | `npm run news:gen` 生成，新增文章时**不需要**动 |
| 组件 | `src/components/news/NewsCard.astro`、`NewsPager.astro` | 一般不动 |

**新增一篇文章 =**
1. 放 4 份同 slug 的 `.astro`（zh/en/es/ar 各一）
2. `npm run news:sync`（= `python _extract_all_news.py`）
3. `npm run news:check`（离线 81 项）；dev 起了就加 `-- --http http://localhost:4321`（157 项）

**不需要**：手改列表页 / 手插卡片 / 比对日期降序 / 改分页 / 加 page_N。

### 输入源
- **百家号 .txt**：`web-crawler/outreach/templates/百家号文章/`，纯文本，首行"标题: XXX"，产出中文站
- **LinkedIn .md**：`web-crawler/outreach/templates/blog - linkedin/`，Markdown，产出英文站

### 生成 .astro 文件必需字段

**frontmatter (`article = { ... }` 对象) —— 以下 5 个字段缺一不可（列表页卡片要用）：**
- `title`、`category`、`date`(ISO yyyy-mm-dd)、`dateDisplay`(本地化)、`description`(SEO ~120字)

**其余：** `author` / `readTime` / `keywords`(数组)

**Sidebar 数据：** `otherArticles`(3篇)、`relatedProducts`(3个)、`relatedCases`(3个)，需同步翻译

**SEO：** `<title>` + OG 标签 + Schema.org Article JSON-LD（`datePublished`/`dateModified` 硬编码 ISO，与 `article.date` 一致）

**ogImage：** `https://chitek-inno.com/assets/images/index-product-{ahf,svg}.webp` 或 `blog/sic-ahf-launch.webp`

### 详情页结构（参照 `en/news/conformal-coating-ahf-reliability.astro`）
1. `BaseLayout` + JSON-LD (slot="head") + `<Sidebar lang="X" />`（自闭合组件）
2. Hero section：深色背景 `pt-[72px] bg-bg-dark` → 回链"Back to News" → 分类标签+日期+阅读时间 → 标题(`font-barlow-condensed`)
3. Content section：白色背景 `py-12 md:py-16` → flex 布局 → 左侧 `article`：
   - Featured image：`h-64 md:h-96`，`/assets/images/news/news-img-N.webp`
   - 正文包在 `<div class="prose prose-lg max-w-none">` 内
   - **SEO Keywords 标签区**：正文与 Author 之间，`article.keywords.map()`
4. 右侧 `<aside>` inline sidebar：More Articles / Related Products / Customer Cases

### 列表页 / 分页页结构（模板，勿手改）
- 列表页 `alternateLangs={['zh','en','es','ar']}`（pt 无新闻，不能进 hreflang）
- 分页页 `alternates={false}`，扁平 URL `/{lang}news/page_2/`
- hero `min-h-[33vh] mt-[72px]`、列表区 `pt-10 md:pt-14 pb-16 md:pb-20`、无 "Latest Articles" 标题、无计数行
- 一页 10 条；`getStaticPaths` 只能用 import 的值（`NEWS_TOTAL_PAGES`），不能用本文件 const

### 构建验证
```bash
cd F:/下载/CHITEK
node_modules/astro/bin/astro.mjs dev --host --port 4321
npm run news:check -- --http http://localhost:4321   # 离线 + 在线
npm run build
# 检查 dist/ 有 /news/<slug>/index.html，sitemap 含 page_2/page_3
```

### 踩坑速查
- 数据文件 `src/data/*NewsCards.js` 是生成物，改文章 frontmatter 才是正路
- data 里 href **不带语言前缀**（存 `/news/<slug>`，前缀交给页面 `lp()`）
- 四语 slug 必须一致；`news:sync` 会硬拦
- `article.date` 必须 ISO；`dateDisplay` 单独放本地化串
- `article.keywords` 必须在 `article` 对象里，注意 JS 对象尾逗号
- 详情页 JSON-LD 中 `publisher.logo.url` 必须用 `logo.webp`
- 生成模板含 JSX 花括号 → 用 `replace()` 占位符，别用 `str.format()`
- `src/pages/` 下**不要**放备份文件（会被当路由编译）
- **完整踩坑表（15 条）→ 见 `docs/NEWS_PIPELINE.md` §七**

## ⚠️ 常见构建失败原因

### 1. frontmatter 对象字面量缺逗号
这是最常见的 `npm run build` 失败原因。当给 `const article = { ... }` 追加字段（如 `keywords`）时，前一行末尾必须加逗号：

```
  readTime: "5 min read"     ← 缺逗号 → 报错 Expected "}" but found "keywords"
  keywords: ["..."]           ← 正确：readTime: "5 min read",
```

每次修改涉及 frontmatter 对象属性时，检查前一行是否有尾逗号。用 AI 批量修改时尤其容易漏。

### 2. CRLF 行尾（仅当用正则匹配时需要注意）
本项目 `.astro` 文件是 CRLF 行尾。用正则匹配行尾时，`\n` 锚点匹配不到，必须写 `\r?\n`。

### 3. 阿拉伯语（ar）文件的 UTF-8 BOM

**仅 3 个文件带 BOM**（2026-09-18 全站扫描确认，ar 下共 38 个 `.astro`）：

```
src/pages/ar/products.astro
src/pages/ar/services.astro
src/pages/ar/solutions.astro
```

其余 ar 文件（含全部 30 篇新闻文章）**没有 BOM**。

**正确做法是"保持原样"，不要统一加 BOM 也不要统一去 BOM**：

```python
raw = path.read_bytes()
bom = raw.startswith(b"\xef\xbb\xbf")          # 记下来
text = raw[3:].decode("utf-8") if bom else raw.decode("utf-8")
# ...改 text...
data = text.encode("utf-8")
path.write_bytes((b"\xef\xbb\xbf" + data) if bom else data)
```

### 4. 构建失败不致命
Netlify 保留上次成功部署，网站不会下线。失败后修复 → 重新推送即可。构建日志在 Netlify → Deploys 页面。

