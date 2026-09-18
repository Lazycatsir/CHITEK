# products 页面字体合规检查报告

日期：2026-09-18　范围：products 相关的 7 个页面　检查项：**仅字体（font-family）**

## 一、全站字体规范（基准）

来源 `src/styles/global.css`，全站只注册 **两个字族**：

| 字族 | 用途 | 定义处 |
|---|---|---|
| `Barlow` | 正文默认 | `global.css` L153 `--font-barlow`；`BaseLayout.astro` L133 `<body class="font-barlow …">` |
| `Barlow Condensed` | 标题展示 | `global.css` L154 `--font-barlow-condensed` |

全站实际使用情况（1423 处 `font-barlow-condensed`，161 个文件）：**h1 100%、h2 基本 100% 用 Condensed；卡片类标题（h3/h4）绝大多数用 Barlow。**

## 二、结论：**字体族合规 ✅**

7 个 products 页面渲染出来的字族**只有** `Barlow, sans-serif` 与 `"Barlow Condensed", sans-serif`，无任何越界：

- 无第三方/系统字体（无 Arial / Roboto / Inter / system-ui 泄漏）
- 无外部字体请求（无 Google Fonts、无 `fonts.gstatic`）
- 无页面级 `@font-face`（14 个全部集中在 `global.css`）
- 无内联 `style="font-family:…"`、无 `<style>` 块字体覆盖
- 表单控件（input / textarea / button）实测均为 `Barlow`（靠 Tailwind preflight 的 `font: inherit`，故不需要额外写字体类）

### 各页实测（Playwright computed style，1440 视口）

| 页面 | body | 出现的字族 | h1 | h2 | h3 | h4 |
|---|---|---|---|---|---|---|
| `/products`（zh 列表） | Barlow | Barlow / Condensed | Condensed ×1 | Condensed ×13 | Barlow ×42 | Barlow ×19 |
| `/en/products` | Barlow | Barlow / Condensed | Condensed ×1 | Condensed ×1 | Condensed ×4 + Barlow ×7 | Barlow ×3 |
| `/es/products` | Barlow | 同 zh | Condensed ×1 | Condensed ×13 | Barlow ×42 | Barlow ×19 |
| `/pt/products` | Barlow | 同 zh | Condensed ×1 | Condensed ×13 | Barlow ×42 | Barlow ×19 |
| `/ar/products` | Barlow | 同 zh | Condensed ×1 | Condensed ×13 | Barlow ×42 | Barlow ×19 |
| `/en/products/sic-ultra-ahf` | Barlow | Barlow / Condensed | Condensed ×1 | Condensed ×5 | Barlow ×18 | Barlow ×3 |
| `/en/products/active-harmonic-filter` | Barlow | Barlow / Condensed | Condensed ×1 | Condensed ×14 | Condensed ×5 + Barlow ×26 | Barlow ×3 |

## 三、唯一发现的不一致 ⚠️

**产品系列卡的标题，两处用了不同字体。**

| 位置 | 卡片标题 | 字体 |
|---|---|---|
| `en/products/active-harmonic-filter.astro` L303 / L315 / L327 / L339 / L351 | Standard Series (L-Series)、SiC Series (C-Series)、Distributed Series (D-Series)、Anti-Pollution Series (A-Series)、Ultra-Slim Series (U-Series) | **Barlow Condensed**（21.6px/700） |
| 5 个列表页 `{products,en,es,pt,ar}/products.astro` L≈60 / 107 / 154 / 201 | 标准型、SiC、分布式、抗污染型（同概念卡片） | **Barlow**（20.16px/700） |

补充证据：在 `active-harmonic-filter.astro` **本页内**，其它所有卡片标题（Harmonic Mitigation、Data Centers、Units Delivered、Static Var Generator…）用的都是 Barlow——这 5 个是全页唯一的例外。

**对齐建议**：按"全站卡片标题 = Barlow"的多数惯例，把该页这 5 个 h3 的 `font-barlow-condensed` 去掉即可（改 5 处、一行一个）。若更偏好现在的"迷你标题"观感，则应反向给 5 个列表页的同类卡片补上 Condensed（改 20 处）。**未擅自改动，等确认。**

## 四、附带说明（非缺陷）

1. `en/products.astro` 的 Condensed 次数（8）明显低于 4 个兄弟语言（36），原因是该页与兄弟页**结构不同**（英文页是带筛选侧栏的旧版布局，只有 1 个 h2；zh/es/pt/ar 是带 Tab 与产品系列区的新版，有 13 个 h2）。属页面结构差异，不是字体问题。
2. `en/products.astro` L63 / 74 / 119 / 132 的侧栏面板标题用 `<h3 class="font-barlow-condensed">`。面板标题按"区块标题"处理用 Condensed 是合理的；4 个兄弟页没有这个侧栏，无对照组。
3. contact / news 页上写的 `font-[inherit]`（各 5 处）**是冗余的**——Tailwind preflight 已对表单控件设 `font: inherit`，products 页不写也同样渲染成 Barlow。留着无害，属可清理项。
4. 详情页 FAQ 用 `<summary>`（继承 Barlow），列表页 FAQ 用 `<h4>`（Barlow）——字体一致 ✅。

## 五、证据文件

- `font_runtime.log` / `font_runtime.json`：7 页逐元素 computed font-family 汇总
- `font_controls.log`：表单控件字体实测（含 contact 对照组）
- `font_series.log`：产品系列卡标题字体逐条对比（定位本报告第三节）
- `font_audit.txt`：全站"自行声明字体"排查（865 条命中全部落在 global.css 的 14 个 `@font-face`）
- `series_zh_list_barlow.png` / `series_ahf_detail_condensed.png`：两处系列卡对比截图
