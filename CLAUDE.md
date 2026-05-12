# CHITEK B2B Industrial Website

## 项目概述

纯静态 B2B 工业网站，目标：将访问者转化为询盘。

- **无框架**：纯 HTML + CSS + 极简 JS（无 React/Vue/Next.js）
- **无构建工具**：无需编译，可直接在浏览器中打开
- **无多语言**：当前仅英文

## 目录结构

```
CHITEK/
├── index.html                   # 首页
├── pages/                       # 内页
│   ├── page-solutions.html      # 解决方案页
│   └── ......
├── assets/
│   ├── css/
│   │   ├── variables.css        # CSS 变量/设计令牌
│   │   ├── reset.css            # 重置样式
│   │   ├── layout.css           # 布局样式
│   │   ├── components.css       # 组件样式
│   │   └── pages/               # 页面私有样式
│   │       └── page-solutions.css
│   └── js/
│       ├── main.js              # 全局 JS（图标系统、滚动效果、移动端菜单）
│       └── page-solutions.js    # 解决方案页 JS
└── assets/images/solutions/     # 页面图片
```

## 编码规范

- **HTML**：语义化标签（`section`, `h2`, `ul` 等）
- **CSS 命名**：kebab-case
- **CSS 组织**：variables → reset → layout → components → pages
- **JS**：极简，模块化 IIFE 模式，避免内联样式
- **禁止**内联 `style` 属性

## CSS 规范

以 **Tailwind 为主、原生 CSS 为辅**的方案。

### 原则

| 场景 | 方案 | 理由 |
| --- | --- | --- |
| 常规样式（边距、颜色、布局、响应式） | Tailwind 工具类 | 开发快、一致性高 |
| 复杂样式（伪元素、复杂动画、多值渐变等） | 原生 CSS | Tailwind 处理这些场景代码冗长 |
| 页面独有的大型区块 | `pages/page-name.css` | 样式隔离 |
| 全局基础样式（变量、重置、字体） | `variables.css` / `reset.css` | 全站共享 |

### 示例

```html
<!-- 常规样式用 Tailwind -->
<div class="flex items-center gap-4 px-6 py-4 text-lg font-medium" />

<!-- 复杂样式用原生 CSS -->
<div class="hero-grid" />
```

### CSS Modules 类名

采用 camelCase：

```css
/* page-solutions.css */
.heroGrid { ... }
```

### 禁止事项

- ❌ 刻意只用 Tailwind 追求"零 CSS"——该写原生时就写原生
- ❌ 为了一点简单样式也开单独 CSS 文件
- ❌ 不用内联 `style`（除非动态计算值）
- ❌ 不用 `styled-components` 或 `sass`

## 页面结构规范

每个 section 必须包含：

- headline（标题）
- supporting text（支持性文本）
- 可选的 CTA（行动号召按钮）

## 写作风格

- B2B 工业风：清晰、专业、建立信任
- 避免夸张营销语言
- 聚焦技术指标和实际效益（如 THD 18% → 4.1%）

## 组件架构（JS）

所有页面级的 JS 采用 IIFE 自执行函数模式，通过 `window` 对象暴露公共 API：

- `window.PowerQ` — 全局工具（escapeHtml, IconSystem, ScrollEffects, MobileMenu）
- `window.SolutionsPage` — 解决方案页（setIndustry, sceneGo, toggleCase 等）

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Tailwind CSS v4 | 原子化 CSS 框架 |
| CSS Modules | 页面级样式隔离 |
| 原生 CSS（variables/reset/layout） | 全局基础样式 |
| PostCSS | CSS 编译（Tailwind） |
