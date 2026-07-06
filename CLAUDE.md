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
│       ├── css/.gitkeep
│       ├── fonts/                   # 自托管 WOFF2（Barlow + Barlow Condensed）
│       └── images/                  # 图片资源
├── src/
│   ├── components/
│   │   ├── Nav.astro               # 全局导航（desktop + mobile menu）
│   │   ├── Footer.astro           # 全局页脚
│   │   └── Sidebar.astro          # 右侧联系栏
│   ├── env.d.ts                    # Astro 类型声明
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
│   │   ├── en/                    # 英文页面
│   │   ├── es/                    # 西语页面
│   │   ├── ar/                    # 阿语页面
│   │   └── pt/                    # 葡语页面
│   └── styles/
│       └── global.css             # Tailwind v4 入口（@theme + @font-face + @keyframes）
├── docs/superpowers/              # 设计文档与计划
│   ├── specs/
│   └── plans/
├── astro.config.mjs
├── package.json
├── .gitignore
└── CLAUDE.md
```

## 多语言路由

Astro i18n 已配置，中文为默认语言：

| 语言 | 路由 | 域名 |
|------|------|------|
| 中文（zh） | 根路径：`/about`, `/products` | www.chitek-inno.com |
| 英文（en） | `/en/about`, `/en/products` | www.en.chitek-inno.com |
| 西语（es） | `/es/about`, `/es/products` | www.chitek-inno.com/es/... |
| 阿语（ar） | `/ar/about`, `/ar/products` | www.chitek-inno.com/ar/... |
| 葡语（pt） | `/pt/about`, `/pt/products` | www.chitek-inno.com/pt/... |

- `astro.config.mjs` 中 `i18n.defaultLocale: 'zh'`，`prefixDefaultLocale: false`
- Netlify `netlify.toml` 配置 `en.chitek-inno.com` → `/en/` 重定向
- 语言切换逻辑在 `Nav.astro` 的 `langHref()` 函数
- hreflang SEO 标签在 `BaseLayout.astro`

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

1. 检查 server 是否在运行：`netstat -ano | findstr "LISTENING" | findstr "4321"`
2. 如果没运行，后台启动：`Start-Process cmd "/c cd /d F:\下载\CHITEK && npm run dev" -WindowStyle Minimized`
3. 等 10 秒让 server 启动
4. 打开浏览器：`Start-Process "http://localhost:4321/"`

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Astro 6.x | 静态站点框架 |
| Tailwind CSS v4 (@tailwindcss/vite) | 原子化 CSS |
| 全局 CSS（global.css） | @theme + @font-face + 自定义样式 |
| 自托管 WOFF2 | Barlow + Barlow Condensed 字体 |
| Netlify | 静态部署 + 表单处理 |

## 页面结构规范

每个 section 必须包含：

- headline（标题）
- supporting text（支持性文本）
- 可选的 CTA（行动号召按钮）

## News/Blog 规范

- 文章列表按日期从新到旧排列（最新在最前面）
- 新增文章日期应设为最近日期，确保排在列表顶部
- 每篇文章需要：frontmatter（title/category/date/description/keywords）+ Schema.org Article 结构化数据 + SEO 关键词标签
