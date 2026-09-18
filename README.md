# CHITEK INNOPOWER — 官网

B2B 工业站点（AHF / SVG 电能质量设备），目标：把访问者转成询盘。

- **框架**：Astro 6.x + Tailwind CSS v4（`@tailwindcss/vite`）
- **语言**：zh（默认，根路径）+ en / es / ar / pt（子目录 / 子域名）
- **部署**：Netlify（静态构建 + 表单处理）
- **字体**：Barlow + Barlow Condensed，自托管 WOFF2

---

## 快速开始

```bash
npm run dev      # 本地预览 → http://localhost:4321
npm run build    # 生产构建 → dist/
npm run preview  # 预览构建产物
```

新闻流水线（三件套）：

```bash
npm run news:sync    # 新增文章后跑（重写 src/data/*NewsCards.js）
npm run news:gen     # 只在改列表页版式 / hero / UI 文案时跑
npm run news:check   # 校验：离线 81 项；加 -- --http http://localhost:4321 共 157 项
```

---

## 文档地图（先看这里）

| 想了解什么 | 去哪看 |
|------|------|
| AI 助手要遵守的项目规则（技术栈 / 路由 / 编码 / CSS 令牌 / 构建坑） | `CLAUDE.md` |
| **新闻发布全流程** + 15 条踩坑表 | `docs/NEWS_PIPELINE.md` |
| 接手 / 交接（环境准备、首次启动、日常任务、工具清单） | `docs/交接文档/` |
| 产品页施工规范 / 新闻规范 / SEO 规范 | `.workbuddy/memory/` 下 `*_SPEC.md` |
| 站点日常管理手册（运营向） | `docs/站点管理手册.html` |
| 竞品分析 / 独立站运营计划 / 转化追踪 | `docs/` |
| 历史备份（**不要**当页面源） | `docs/_ref/` |
| 百家号 / LinkedIn 原始稿 + 内容外联 | 兄弟仓库 `F:\下载\web-crawler`（**不在本仓库内**） |

> 注：仓库根目录**只有** `README.md` 和 `CLAUDE.md` 两个说明文件，其余分散在上表各处。

---

## 目录结构（简）

```
src/pages/        zh 根路径 + en/ es/ ar/ pt/ 子目录
src/components/   Nav / Footer / Sidebar / news/
src/layouts/      BaseLayout.astro（head / meta / OG / hreflang）
src/data/         {zh,en,es,ar}NewsCards.js   ← 生成物，勿手改
src/styles/       global.css（@theme 设计令牌 + @font-face）
public/assets/    fonts（Barlow 系列 WOFF2）+ images
docs/             文档 + 交接资料 + _ref 历史备份
```

---

## 两条最容易踩的约定

- **默认不提交 Git**：只有明确说「提交」时才 `commit` / `push`。
- **改完代码先 `npm run build`** 验证无报错，再推 GitHub（Netlify 自动部署）。构建失败不致命——Netlify 保留上次成功部署。

---

*最后更新：2026-09-18*
