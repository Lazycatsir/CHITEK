# 英文站字体审计（字族 · 字重 · 字符调整）

> 审计对象：`F:\下载\CHITEK\src\pages\en` 下全部 .astro 页面（核心页 + 新闻页）。生成于 2026-10-09。

# 英文站字体审计（字族 · 字重 · 字符调整）

审计对象：`F:\下载\CHITEK\src\pages\en` 下全部 .astro 页面（核心页 + 新闻页）。生成于 2026-10-09。

## 1. 字体系统总览

全站只使用 **2 个字族**：

- **Barlow** —— 正文默认字族。`BaseLayout.astro` 的 `<body class="font-barlow ...">` 让所有元素默认继承 Barlow。
- **Barlow Condensed** —— 标题字族，仅当某个元素显式带 `font-barlow-condensed` 类时才生效。
> **关键发现（"有些看起来不一样"的结构性原因）：**
> 
> `global.css` 只定义了 `--font-barlow-condensed` 这个 CSS 变量（第 154 行），**没有任何全局 CSS 规则把 h1/h2/h3/h4 强制设为 Condensed**。
> 标题是否用 Condensed，取决于每个元素自己有没有写 `font-barlow-condensed` 类。结果就是：同一个页面、甚至在"看起来都像标题"的位置，有的渲染成 Barlow（宽），有的渲染成 Barlow Condensed（窄）——视觉上明显不一致。

## 2. 全站唯一签名汇总（字族 · 字重 · 字符调整 · 次数）

下表按出现次数降序，覆盖全站所有带字体语义的元素。"字符调整"列含字距（tracking）与大小写（uppercase 等）。

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 1447 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 480 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 444 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 264 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 257 |
| Barlow | font-bold（700 加粗） | tracking-tight（字距 -0.025em，收紧） | 35 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 32 |
| Barlow Condensed | font-bold（700 加粗） | uppercase（全大写） | 14 |
| Barlow | font-bold（700 加粗） | tracking-wide（字距 +0.025em，放宽） | 13 |
| Barlow Condensed | font-semibold（600 中粗） | 无（不调间距/大小写） | 13 |
| Barlow Condensed | font-semibold（600 中粗） | tracking-[0.2em]（字距 0.2em） | 11 |
| Barlow | font-bold（700 加粗） | uppercase（全大写） | 10 |
| Barlow Condensed | 未指定（继承 400 常规） | tracking-[-0.02em]（字距 -0.02em） | 10 |
| Barlow | 未指定（继承 400 常规） | tracking-[0.15em]（字距 0.15em） | 9 |
| Barlow Condensed | font-bold（700 加粗） | tracking-[0.06em]（字距 0.06em） | 8 |
| Barlow | 未指定（继承 400 常规） | 无（不调间距/大小写） | 7 |
| Barlow Condensed | font-semibold（600 中粗） | tracking-[0.05em]（字距 0.05em） | 7 |
| Barlow Condensed | 未指定（继承 400 常规） | 无（不调间距/大小写） | 6 |
| Barlow Condensed | font-bold（700 加粗） | tracking-wide（字距 +0.025em，放宽） | 5 |
| Barlow | font-semibold（600 中粗） | tracking-[0.06em]（字距 0.06em） | 3 |
| Barlow | font-bold（700 加粗） | tracking-[0.05em]（字距 0.05em） | 3 |
| Barlow | font-bold（700 加粗） | capitalize（首字母大写） | 3 |
| Barlow | font-semibold（600 中粗） | tracking-[0.08em]（字距 0.08em） | 3 |
| Barlow | font-semibold（600 中粗） | tracking-[0.1em]（字距 0.1em） | 2 |
| Barlow | font-bold（700 加粗） | tracking-[0.1em]（字距 0.1em） | 2 |
| Barlow Condensed | font-medium（500 中等） | 无（不调间距/大小写） | 1 |
| Barlow Condensed | font-semibold（600 中粗） | tracking-widest（字距 +0.1em，最宽） | 1 |
| Barlow Condensed | font-bold（700 加粗） | tracking-[0.04em]（字距 0.04em） | 1 |

## 3. 为什么"有些看起来不一样"——根因分析

字重（加粗程度）和字符调整（字距 / 大小写）是**逐元素、逐页面**手工写的，全站没有统一的"字号 / 字重 / 字距"刻度表（type scale）。三类不一致叠加，导致观感不统一：

### 3.1 标题字族不统一（Condensed 占比对照）

| 核心页面 | Barlow 元素数 | Condensed 元素数 | 说明 |
| --- | --- | --- | --- |
| 404.astro | 3 | 1 | Condensed 占比 25% |
| about.astro | 18 | 16 | Condensed 占比 47% |
| contact.astro | 16 | 3 | Condensed 占比 16% |
| index.astro | 25 | 14 | Condensed 占比 36% |
| products / active-harmonic-filter.astro | 57 | 47 | Condensed 占比 45% |
| products / anti-pollution-ahf.astro | 80 | 7 | Condensed 占比 8% |
| products / distributed-ahf.astro | 78 | 7 | Condensed 占比 8% |
| products / ip65-ahf.astro | 78 | 7 | Condensed 占比 8% |
| products / ip65-sic-fanless-ahf.astro | 78 | 7 | Condensed 占比 8% |
| products / sic-fanless-ahf.astro | 78 | 7 | Condensed 占比 8% |
| products / sic-ultra-ahf.astro | 79 | 7 | Condensed 占比 8% |
| products / ultra-slim-ahf.astro | 78 | 7 | Condensed 占比 8% |
| products-asvg / anti-pollution-asvg.astro | 82 | 7 | Condensed 占比 8% |
| products-asvg / anti-pollution-hv-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg / distributed-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg / ip65-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg / ip65-sic-fanless-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg / sic-fanless-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg / sic-ultra-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg / ultra-slim-asvg.astro | 80 | 7 | Condensed 占比 8% |
| products-asvg.astro | 17 | 7 | Condensed 占比 29% |
| products-svg / anti-pollution-hv-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg / anti-pollution-svg.astro | 82 | 8 | Condensed 占比 9% |
| products-svg / distributed-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg / ip65-sic-fanless-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg / ip65-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg / sic-fanless-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg / sic-ultra-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg / ultra-slim-svg.astro | 80 | 8 | Condensed 占比 9% |
| products-svg.astro | 17 | 7 | Condensed 占比 29% |
| products.astro | 24 | 16 | Condensed 占比 40% |
| services.astro | 126 | 26 | Condensed 占比 17% |
| solutions / [slug].astro | 11 | 22 | Condensed 占比 67% |
| solutions.astro | 16 | 13 | Condensed 占比 45% |

新闻页几乎全是 Barlow（Condensed 占比≈0%）；而 about / index / products 详情页大量使用 Condensed。跨页跳转时，标题"宽窄"会突然变化。

### 3.2 同一逻辑位置字重不一致

- `products/active-harmonic-filter.astro`：标题级大量用 **Condensed + font-bold（700）** 34 处，外加 **Condensed + font-semibold + tracking-[0.2em]** 11 处（超宽字距）。
- `products/sic-ultra-ahf.astro`：标题级几乎不用 Condensed（仅 7 处 bold），主体是 **Barlow + font-semibold（600）** 58 处 + **Barlow + font-medium（500）** 17 处——比上者"细"且"宽"。
- `services.astro`：用 **Condensed 默认字重（400）+ tracking-[-0.02em]** 10 处（细且收紧）+ **Barlow + font-medium（500）** 52 处，整体观感又不同。
### 3.3 字符调整（字距 / 大小写）随心所欲

- 字距跨度极大：`tracking-tight`（-0.025em，收紧，新闻正文 35 处）、`tracking-wide`（+0.025em，about/index 13 处）、`tracking-[0.2em]`（超宽，active-harmonic-filter 11 处）、`tracking-[0.15em]`（about 9 处）、`tracking-[-0.02em]`（services 10 处）、`tracking-[0.05/0.06/0.08/0.1em]` 散落在 index/contact/about。
- 大小写混用：`uppercase` 在 Condensed bold（14）、Barlow bold（10）、Barlow 默认（32）、Barlow semibold（257）等处反复出现，没有统一"标签用大写"的规则。
> **结论：**新闻页内部高度一致（Barlow + bold/semibold + tracking-tight），观感统一；**不一致集中在核心页（about / contact / index / products / 产品详情 / services / solutions）**，它们之间的字重、字距、是否用 Condensed 差异明显。若要让"看起来都一样"，需要给全站定一套统一的 type scale（字号 + 字重 + 字距 + 何时用 Condensed），再批量归一化核心页。

## 4. 各核心页面字体签名明细

### 404.astro （共 4 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | tracking-[0.06em]（字距 0.06em） | 2 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 1 |

### about.astro （共 34 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-bold（700 加粗） | tracking-wide（字距 +0.025em，放宽） | 10 |
| Barlow | font-bold（700 加粗） | uppercase（全大写） | 4 |
| Barlow | 未指定（继承 400 常规） | tracking-[0.15em]（字距 0.15em） | 2 |
| Barlow | font-bold（700 加粗） | tracking-[0.05em]（字距 0.05em） | 1 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 6 |
| Barlow Condensed | font-bold（700 加粗） | uppercase（全大写） | 5 |
| Barlow Condensed | font-bold（700 加粗） | tracking-wide（字距 +0.025em，放宽） | 5 |

### contact.astro （共 19 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 7 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 3 |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 2 |
| Barlow | font-bold（700 加粗） | uppercase（全大写） | 2 |
| Barlow | font-semibold（600 中粗） | tracking-[0.06em]（字距 0.06em） | 1 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |

### index.astro （共 39 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 6 |
| Barlow | font-bold（700 加粗） | uppercase（全大写） | 4 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 4 |
| Barlow | font-bold（700 加粗） | capitalize（首字母大写） | 3 |
| Barlow | font-semibold（600 中粗） | tracking-[0.08em]（字距 0.08em） | 3 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 2 |
| Barlow | font-semibold（600 中粗） | tracking-[0.1em]（字距 0.1em） | 2 |
| Barlow | font-bold（700 加粗） | tracking-[0.05em]（字距 0.05em） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 9 |
| Barlow Condensed | font-bold（700 加粗） | uppercase（全大写） | 5 |

### products / active-harmonic-filter.astro （共 104 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 39 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 12 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 6 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 34 |
| Barlow Condensed | font-semibold（600 中粗） | tracking-[0.2em]（字距 0.2em） | 11 |
| Barlow Condensed | font-semibold（600 中粗） | tracking-widest（字距 +0.1em，最宽） | 1 |
| Barlow Condensed | font-semibold（600 中粗） | 无（不调间距/大小写） | 1 |

### products / anti-pollution-ahf.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products / distributed-ahf.astro （共 85 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 46 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products / ip65-ahf.astro （共 85 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 46 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products / ip65-sic-fanless-ahf.astro （共 85 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 46 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products / sic-fanless-ahf.astro （共 85 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 46 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products / sic-ultra-ahf.astro （共 86 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 47 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products / ultra-slim-ahf.astro （共 85 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 46 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / anti-pollution-asvg.astro （共 89 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 50 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / anti-pollution-hv-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / distributed-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / ip65-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / ip65-sic-fanless-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / sic-fanless-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / sic-ultra-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg / ultra-slim-asvg.astro （共 87 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-asvg.astro （共 24 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 12 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 4 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products-svg / anti-pollution-hv-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / anti-pollution-svg.astro （共 90 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 50 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / distributed-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / ip65-sic-fanless-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / ip65-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / sic-fanless-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / sic-ultra-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg / ultra-slim-svg.astro （共 88 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 48 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 17 |
| Barlow | font-semibold（600 中粗） | uppercase（全大写） | 11 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 3 |
| Barlow | 未指定（继承 400 常规） | uppercase（全大写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 8 |

### products-svg.astro （共 24 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 12 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 4 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 1 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |

### products.astro （共 40 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 12 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 6 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 6 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |
| Barlow Condensed | 未指定（继承 400 常规） | 无（不调间距/大小写） | 6 |
| Barlow Condensed | font-semibold（600 中粗） | 无（不调间距/大小写） | 2 |
| Barlow Condensed | font-medium（500 中等） | 无（不调间距/大小写） | 1 |

### services.astro （共 152 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 52 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 43 |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 13 |
| Barlow | 未指定（继承 400 常规） | tracking-[0.15em]（字距 0.15em） | 7 |
| Barlow | 未指定（继承 400 常规） | 无（不调间距/大小写） | 7 |
| Barlow | font-bold（700 加粗） | tracking-wide（字距 +0.025em，放宽） | 3 |
| Barlow | font-bold（700 加粗） | tracking-[0.05em]（字距 0.05em） | 1 |
| Barlow Condensed | 未指定（继承 400 常规） | tracking-[-0.02em]（字距 -0.02em） | 10 |
| Barlow Condensed | font-semibold（600 中粗） | tracking-[0.05em]（字距 0.05em） | 7 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 5 |
| Barlow Condensed | font-bold（700 加粗） | uppercase（全大写） | 4 |

### solutions / [slug].astro （共 33 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 4 |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 4 |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 3 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 9 |
| Barlow Condensed | font-bold（700 加粗） | tracking-[0.06em]（字距 0.06em） | 8 |
| Barlow Condensed | font-semibold（600 中粗） | 无（不调间距/大小写） | 5 |

### solutions.astro （共 29 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 11 |
| Barlow | font-medium（500 中等） | 无（不调间距/大小写） | 3 |
| Barlow | font-bold（700 加粗） | tracking-[0.1em]（字距 0.1em） | 2 |
| Barlow Condensed | font-bold（700 加粗） | 无（不调间距/大小写） | 7 |
| Barlow Condensed | font-semibold（600 中粗） | 无（不调间距/大小写） | 5 |
| Barlow Condensed | font-bold（700 加粗） | tracking-[0.04em]（字距 0.04em） | 1 |

## 5. 新闻页字体签名（35 篇汇总）

全部新闻页签名高度一致，下方为合并统计。

### 新闻页（35 篇汇总） （共 587 处带字体语义的元素）

| 字族 | 字重 | 字符调整（字距 / 大小写） | 次数 |
| --- | --- | --- | --- |
| Barlow | font-bold（700 加粗） | 无（不调间距/大小写） | 312 |
| Barlow | font-semibold（600 中粗） | 无（不调间距/大小写） | 240 |
| Barlow | font-bold（700 加粗） | tracking-tight（字距 -0.025em，收紧） | 35 |
