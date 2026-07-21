# CHITEK 项目长期记忆（MEMORY.md）

## 工作流约定（来自 CLAUDE.md）
- 默认不提交 Git：仅用户明确说"提交"才 commit/push。
- **预览用 `npm run dev`（端口 4321）实时热更新**：改 `src/` 后刷新浏览器即所见即所得，**不必每次 `npm run build`**（build 慢且受删除守卫限制，见下）。
- 仅在需要出最终产物 / 部署时才跑 `npm run build`。

## 关键环境约束（务必记住）
- 本环境 `npm run build` / `astro check` 收尾会删除 `dist/.prerender/.vite/`（vite 临时缓存），触发 WorkBuddy `genie-safe-delete` 批量删除守卫（阈值 50 文件/turn）被拦截，导致 build/check 无法完整跑通。
- `build.noClean:true` 无效，Astro 仍删该目录。`astro check` 重优化依赖时同样会删它。
- 结论：不要在本环境反复尝试 build/check 来"验证无报错"——会被删 dist 守卫阻断。改用：① 与已成功构建的现有页面做模板一致性核对；② 请用户在其本地（无此守卫）`npm run build` 验证；③ 若用户明确允许删除 dist 临时目录，再跑。
- 安装临时校验依赖用 `npm i --no-save @astrojs/check typescript`，避免改 package.json。
- **`npm run dev` 可用且优先用于预览**：首次启动 vite 依赖优化耗时较长（实测约 1 分钟才绑定 4321，期间 netstat 看不到端口、curl 000，并非卡死，耐心等即可）。启动后常驻后台，改 src 自动热更新。
- **重启 dev 若卡死不绑端口**：先 `taskkill /F /PID <pid>`（pkill 常杀不到 node.exe）杀干净 → `rm -rf node_modules/.vite node_modules/.astro .astro`（可重生，rm 被包装进回收站，安全可逆）→ 再用托管 node 直跑 `astro.mjs dev` 重启。旧 vite/astro 缓存锁会让新实例卡在依赖优化、150s 无输出不绑端口。
- **Edit 工具缩进不符会静默空操作**：old_string 缩进与文件实际不符时，Edit 可能返回"成功"但实际未改动（多行/批量尤甚）。改完务必 grep 校验行数/内容；批量改动优先用正确缩进或 Python 脚本带 `assert count == N`。

## 新闻(News)新增规则
- 列表页 `src/pages/news.astro` 为硬编码 HTML，新增文章需手动插到各语言列表页首位。
- 文章 frontmatter 需 title/category/date/dateDisplay/author/readTime/description/keywords；含 Schema.org Article + SEO 关键词标签 + Sidebar。
- 日期设最近日期确保排列表顶部；每翻译一语言必须保证该语言文章文件存在（避免幽灵链接）。
- 配图放 `public/assets/images/blog/`，blog 目录目前仅 `sic-ahf-launch.webp`；无专属图时复用 `public/assets/images/` 下语义匹配图（如 index-product-ahf.webp），ogImage 域名用 chitek-inno.com。

## 技术栈
- Astro 6.x + Tailwind v4(@tailwindcss/vite) + @astrojs/sitemap + Netlify
- 中文默认语言；zh/en/es/ar/pt 五语子域名；新闻仅 zh/en/es/ar 四语
- 禁止内联 style（动态值除外）；Tailwind v4 任意变体 `[&.class]` 扫描不到，用 `<style>` 纯 CSS
- **Astro scoped `<style>` 引用组件外全局类必须 `:global()`**：`<style>` 里每段选择器都会被加 `[data-astro-cid]`，包括写在 `<html>`/`<body>` 上的全局 flag 类（`.js`/`.dark`/`.rtl`）。这些元素在组件外没有 cid → 被 scope 后永不匹配。凡引用组件外元素的类，一律写 `:global(.js) .xxx{}`。曾导致 reveal 滚动动画"标题可见但不动"（隐藏态 `opacity:0` 整条失效）。定位手段：Playwright(共享 venv) headless 读 getComputedStyle。
- **JS 交付方式（重要）**：`.astro` 里普通 `<script>`（无 `is:inline`）会被 Astro/Vite **打包成外部 ES 模块**——build 产物为 `<script type="module" src="/_astro/<hash>.js">`，dev 为 `/src/...?astro&type=script&index=0&lang.ts`，**并非真正内联**在 HTML 里。只有 `<script is:inline>` 与 `<script type="application/ld+json">`（结构化数据，非可执行 JS）才保留在 HTML 内。当前真正 `is:inline` 的仅两处：① `en/products/active-harmonic-filter.astro` 的 `classList.add('js')`；② 各语言 `solutions.astro` 的 `<script is:inline src="/assets/js/lucide.min.js">` 加载本地库。其余交互 JS（Nav、BaseLayout 共享脚本、products 页 psPopIn 动画等）均随普通 `<script>` 被打包成外部模块——功能正常（模块 defer，DOM 就绪后执行）。若需真正单文件内联（如 CSP 禁止外部模块），需给对应 `<script>` 加 `is:inline`（代价：不被打包/压缩、跨页不去重）。
