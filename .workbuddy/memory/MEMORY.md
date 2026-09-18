# CHITEK 长期记忆（MEMORY.md）

> 本文件 = 当前有效的事实与硬规则。施工过程/踩坑见 `.workbuddy/memory/YYYY-MM-DD.md`。
> **专题规范（动对应内容前必读）**：产品页 → `PRODUCT_PAGE_SPEC.md` ｜ 新闻 → `NEWS_SPEC.md` ｜ SEO/hreflang/追踪/运营计划/竞品 → `SEO_SPEC.md`

## 沟通与流程
- 用户非 SEO 出身：术语须「一句话定义 + 生活类比 + 今天能做的一步」。
- 建议要「30 分钟能做完」+ 可复制话术/邮件模板，不要只给框架。
- **不要给甘特式排期表**（周次/月份时间轴）：计划类只写「优先级 → 依赖条件 → 验收清单」。
- 默认不提交 Git（用户说"提交"才 commit/push）。预览走 dev 端口 4321；部署才 `npm run build`。

## 环境约束（踩过坑的）
- `npm run build`/`astro check` 收尾删 dist 会触发 genie-safe-delete（阈值 50 文件/turn）→ 跑不通。验证改用模板核对 / 请用户本地 build。
- dev 启动：vite 首次优化 ~1 分钟才绑 4321；卡死 → taskkill PID → 删 `node_modules/.vite` `.astro` → 托管 node 直跑 `astro.mjs dev`。
- ⚠️ Astro dev 监听器漏掉「程序化写入」：批量改 .astro 后可能不重编译 → 重启 dev 或再 Edit 一次。served HTML 带 `data-astro-cid-*`，精确串匹配不到，正则须容忍。
- `Nav.astro` 是 `fixed top-0 h-[72px]`，页面首元素须自加 `mt-[72px]`；BaseLayout 只渲染 `<main>`。
- ⚠️ 批量替换的 assert 必须挑**该处独有**的正文串（class 串常在多处重复，JSON-LD 里也可能有同名文案，**自己新写的 HTML 注释/JS 选择器也会命中**）→ 尽量数「标签级」串如 `<div data-x`。
- ⚠️ **切段式批量替换的边界陷阱**：用 `s.index("group-hover/ahf")` 这类**属性中段的关键词**切段时，该关键词在 class 属性里出现的位置**之前**的 token（如同一 class 里的 `top-0 bottom-0`）会落进**上一段** → 结果是「目标元素没改到、相邻同类元素被误改」。而且只断言**总数**（如 `top-0 bottom-0` 剩 1 个）会**照样通过**，因为数量守恒、只是改错了对象。
  正确做法：① 按**完整 class 串**（或完整标签）定位，而不是属性里的某个词；② 改完对**每个站点单独断言**（例：AHF 面板应为 `top-0 ml-2`、SiC 面板应为 `top-0 bottom-0`），而不是只数总出现次数。
- `src/pages/` 下任何备份文件都会被当路由编译 → 备份放 `docs/_ref/` 或 `F:\trash`。
- 通用工具链（托管 node / pwsh 7.6.3 / Playwright 共享 venv / Bash 已废）→ 见跨项目记忆。

## 技术栈
- Astro 6.x + Tailwind v4 + Netlify；zh/en/es/ar/pt 五语（新闻仅四语，pt 无新闻）。禁内联 style；scoped `<style>` 引用全局类须 `:global()`。
- **字体规范（全站只有 2 个字族）**：`Barlow`（正文，`--font-barlow`，由 `BaseLayout` 的 `<body class="font-barlow">` 兜底）+ `Barlow Condensed`（标题，`--font-barlow-condensed`）。惯例：**h1/h2 用 Condensed；卡片标题 h3/h4 用 Barlow**。14 个 `@font-face` 全部集中在 `global.css`。
  - 表单控件（input/textarea/button）**不需要**写字体类：Tailwind v4 preflight 已设 `font: inherit`。contact/news 里那些 `font-[inherit]` 是冗余（无害）。
  - 查字体合规**必须**用 Playwright 读 computed style：静态扫 `class="font-*"` 会漏掉继承链与表单控件；且探针若只取「有 textContent」的元素会**漏掉 input/textarea**（它们 textContent 为空），需单独再扫一遍控件。

## 图片资产
- 统一放 `public/assets/images/`，页面按 `/assets/images/xxx.webp` 引用。
- **配图规格（唯一标准）**：**1200×1200 正方形**白底画布 — 整幅等比 contain、**零裁剪**（保留原白底/倒影）→ `WEBP quality 82`。
- 图框也是 1:1（网格视图；列表视图 240×150）→ 出方形图 = **零裁切**。
- ⚠️ **别做 4:3 / 1200×900**（2026-09-18 误做过一版被用户否：「我要的 webp 是正方形的」）。
- 批量脚本（已固化，可重跑）：`docs\_ref\gen_webp_from_pics.py <源目录> [输出目录]`，输出 `<输出目录>/webp/` + `_contact_sheet.png` + `_manifest.json`，自带 Pillow 自愈。Pillow 只在共享 venv 里（托管 python 零第三方包）。

## 文档结构（2026-09-18 起）
- **根目录只保留 2 个 md**：`CLAUDE.md`（AI 协作规则 + 顶部「文档地图」）+ `README.md`（项目首页/快速开始/文档地图，~2.5KB）。
- 新闻流水线文档在 **`docs/NEWS_PIPELINE.md`**（原根 README，已迁移）；不要再往根目录堆 README。
- ⚠️ `Glob **/CLAUDE.md` 会冒出一堆**：`node_modules/*` 自带的（无关）+ 历史 `.claude/worktrees/*`（4 个陈旧 agent worktree，每个 43.7MB 整仓拷贝，已删并备份到 `F:\trash\chitek-worktrees-backup-20260918`）。判断「文件多」前先排除这两类。

## 产品页筛选机制（改规格必看）
- 筛选面板的属性与产品卡是**配对**关系，**改一处必须同步另一处**，否则筛选立刻失效：
  - `en/products.astro`：面板 `data-filter="v|a|s|i"` + `value="…"` ⇄ 卡片 `<li class="cbp-vm-li" data-v/data-a/data-s/data-i="…, …">`
  - `en/products/sic-ultra-ahf.astro`：面板 `data-group="v|a|c|i"` + `data-val="…"`
- 电压档标准值：**208V / 400V / 480V / 690V**（en 还有 800V）。JS 里 `voltColorMap`/`vLabel`/`colors` 只有这四个 key
  —— **220V 不是本站的档位**（208V 档代表 200~240V 区间）。2026-09-18 已把 en 残留的 220V 全改 208V（筛选档 + 额定电压范围 220–690V → 208–690V）。
- **额定电压范围统一写 `208–690V`**（AHF 系列）。⚠️ 破折号两种写法并存：**页面展示用 en dash `–`**（`208–690V` / `208–690 V`），
  **meta description / JSON-LD 用连字符 `-`**（`208-690V`）。替换时看清字符，用错 Edit 会匹配失败。
- 同一处规格会散落在**多处**，改一处要全扫：**页面展示 + 规格表 + FAQ 正文 + meta description + JSON-LD（PropertyValue / FAQPage）**。
  实测：`sic-ultra-ahf` 的电压范围散落 5 处、容量散落 5 处；`active-harmonic-filter` 的容量散落 4 处（**两页合计 9 处**）。
  一次捞全的正则：`grep -E "15\s*A\s*[–-]\s*200|15-200A|15A to 200A"` 这类**同时覆盖空格/en dash/连字符/连写**的写法。
- **AHF 系列额定参数基准值（2026-09-18 统一）**：额定电压 **208–690 V**；额定容量 **50 A – 200 A per module**（并联可扩展，标准柜到 3000 A+）。
  ⚠️ 改数值时**保留各处的句式与括号说明**（如 `(parallel expandable, unlimited)`），只换数字；不要整串替换（会丢并联信息）。
  ⚠️ 别误伤：新闻页 `blog-chitek-ahf-advantages` 里的 `150 A–200 A, 4U` 是**高容量型号**，不属基准值。

## 跨语言待办（长期挂账）
- **en 已删顶部吸附 Tab 栏（`#sticky-tab-bar`），zh/es/ar/pt 仍保留**：en 页无 `.tab-panel` 实体（纯装饰，删掉无损失）；
  兄弟页有 10 个 `.tab-panel`，那根栏是 AHF↔SVG **唯一切换入口** → 想删必须另给切换 UI。详见 `PRODUCT_PAGE_SPEC.md`。
- zh/es/ar/pt 兄弟产品页未同步 en 系列的全部产品页改动。
- ⚠️ **反向也要查**：en 版也会落后于兄弟页（2026-09-18 实测 en products 电压档还写着 220V，而 zh/es/pt/ar 早已是 208V）。
  改 en 前先 grep 全站同一串，判断是"en 要改"还是"en 是基准"。
- 🐞 **en/products.astro 缺「AHF 选型矩阵」区块（既有 bug，未修）**：JS `renderMatrix()` 取 `#matrix-tbody`（L782）后 `.closest('table')`，
  但英文页 HTML 里**没有** `#matrix-tbody` / `#matrix-title`（zh/ar/es/pt 的 `products.astro` 都有）→ 每次加载必报
  `TypeError: Cannot read properties of null (reading 'closest')`，选型矩阵功能在英文页是缺失的。修法：补回该表格区块，或给 JS 加空值守卫。
- en/products 侧栏（`aside.n_left`）2026-09-18 删掉了 "New Products" 卡片，现为 3 块：Product Categories / Filter / Contact Us。

## 运营计划（独立站）
- 文档：`docs/独立站运营计划.{md,html}`，当前 **v2.4**（纯结构优化，不改结论）。ASCII 副本在 `C:\Users\lenovo\WorkBuddy\00_中转站\CHITEK-website-operations-plan.{md,html}`。
- 结构逻辑链：**§0 画像（决定服务谁/分什么词）→ §二 关键词矩阵 → §三 产品页塑造 → §五 内链/外链/社媒 → §四 数据周报 → §六 底层原理（规则依据）**。
- v2.4 关键落点：① 词按角色分层，规范词/how-to-choose 由 **4 个 Hub 页**（AHF 选型指南 / SVG 选型指南 / 标准合规 / 行业场景）承接；② 同义词变体**不建换皮页**，用 FAQ + FAQPage Schema 接（见 §二 + §六 6.3/6.4）；③ 无甘特排期，只写验收清单（与用户"不要日期规划"一致）。
