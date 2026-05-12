# CHITEK B2B Industrial Website

## 项目概述

纯静态 B2B 工业网站，目标：将访问者转化为询盘。

- **无框架**：纯 HTML + CSS + 极简 JS（即将迁移到 Astro）
- **Tailwind CLI v4**：本地构建 CSS，不依赖 CDN
- **字体**：Barlow + Barlow Condensed，自托管 WOFF2
- **部署目标**：Netlify
- **无多语言**：当前仅英文

## 目录结构

```
CHITEK/
├── index.html                   # 首页
├── pages/                       # 内页（即将转为 Astro 路由）
│   ├── about.html
│   ├── contact.html
│   ├── products.html
│   ├── services.html
│   └── solutions.html
├── assets/
│   ├── css/
│   │   ├── input.css            # Tailwind v4 入口（@theme + @font-face + 自定义样式）
│   │   └── tailwind.css         # CLI 构建产物（gitignored）
│   ├── fonts/                   # 自托管字体（Barlow, Barlow Condensed）
│   ├── images/                  # 图片资源
│   └── js/
│       ├── include.js           # HTML 公共组件加载器
│       ├── main.js              # 全局 JS（图标系统、滚动效果）
│       └── nav.js               # 导航交互
├── includes/                    # HTML 片段（nav, footer, sidebar）
│   ├── _nav.html
│   ├── _footer.html
│   └── _sidebar.html
├── docs/superpowers/            # 设计文档与计划
│   ├── specs/
│   └── plans/
├── package.json
├── serve.bat                    # 本地开发脚本
└── .gitignore
```

## 编码规范

- **HTML**：语义化标签（`section`, `h2`, `ul` 等）
- **CSS 类名**：Tailwind utility 类为主，camelCase 自定义类
- **JS**：极简，模块化 IIFE 模式，避免内联样式
- **禁止**内联 `style` 属性

## CSS 规范

以 **Tailwind v4 CLI 本地构建**为核心方案。

### 原则

| 场景 | 方案 | 理由 |
| --- | --- | --- |
| 常规样式 | Tailwind 工具类 | 开发快、一致性高 |
| 复杂样式 | 原生 CSS（`input.css` 中） | Tailwind 处理复杂场景冗长 |
| 全局基础样式 | `input.css` 的 `@theme` | 全站共享设计令牌 |

### 自定义 CSS

所有自定义样式写在 `assets/css/input.css` 中：

- `@import "tailwindcss"` — 框架入口
- `@theme { ... }` — 设计令牌（颜色、字体、间距、z-index、动画）
- `@keyframes` — 自定义动画
- `.fade-up / .fade-up.visible` — 滚动出现动画

### 设计令牌

| 令牌 | 值 | 用途 |
|------|-----|------|
| `brand-orange` | `#ff6b1a` | 品牌主色 |
| `bg-dark` | `#07101e` | 深色背景 |
| `text-dark` | `#1a1a1a` | 正文色 |
| `font-family-barlow` | `"Barlow", sans-serif` | 正文字体 |
| `font-family-barlow-condensed` | `"Barlow Condensed", sans-serif` | 标题字体 |

### 禁止事项

- ❌ 不用内联 `style`（除非动态计算值）
- ❌ 不用 `styled-components` 或 `sass`
- ❌ 不用 CDN 加载 Tailwind 或 Google Fonts

## 图片路径规则

在 `bg-[url()]` 中使用**绝对路径**（以 `/` 开头）：

```html
<!-- ✅ 正确 -->
<div class="bg-[url('/assets/images/hero.jpg')]" />

<!-- ❌ 错误：相对路径在 CSS 中解析错误 -->
<div class="bg-[url('assets/images/hero.jpg')]" />
```

## 写作风格

- B2B 工业风：清晰、专业、建立信任
- 避免夸张营销语言
- 聚焦技术指标和实际效益（如 THD 18% → 4.1%）

## 本地开发

```bash
npm run dev     # Tailwind watch 模式
npm run build   # 生产构建（minify）
serve.bat       # 构建 + HTTP 服务器
```

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Tailwind CSS v4 CLI | 原子化 CSS 构建 |
| 原生 CSS（input.css） | @theme + @font-face + 自定义样式 |
| 自托管 WOFF2 | Barlow + Barlow Condensed 字体 |
| Netlify（即将） | 静态部署 + 表单处理 |

## 页面结构规范

每个 section 必须包含：

- headline（标题）
- supporting text（支持性文本）
- 可选的 CTA（行动号召按钮）
