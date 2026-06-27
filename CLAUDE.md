# CHITEK B2B Industrial Website

## 项目概述

B2B 工业网站，目标：将访问者转化为询盘。已迁移到 Astro 静态站点框架。

- **框架**：Astro 6.x + Tailwind CSS v4 (@tailwindcss/vite)
- **字体**：Barlow + Barlow Condensed，自托管 WOFF2
- **部署目标**：Netlify
- **当前语言**：仅英文（多语言计划中）

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
│   │   ├── index.astro            # 首页（hero/about/products/solutions）
│   │   ├── about.astro            # 关于我们
│   │   ├── contact.astro          # 联系我们
│   │   ├── products.astro         # 产品中心（tab切换/WebGL/产品矩阵/案例轮播/FAQ）
│   │   ├── services.astro         # 服务
│   │   └── solutions.astro        # 解决方案（JS动态渲染/6大行业切换/案例/FAQ）
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
