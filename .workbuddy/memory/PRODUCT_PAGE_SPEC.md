# 产品页施工规范（CHITEK）

> **动任何产品页之前必读**。模板 = `src/pages/en/products/sic-ultra-ahf.astro`，克隆新页照抄。
> 本文件 2026-09-22 精简重写（27.8KB → 15.0KB）：删掉施工过程/调参史/源图清单，明细归档当日日志。

## 页面结构
- 面包屑通栏在 `lg:flex` **外**（`mx-auto max-w-7xl px-6` + `mt-[72px]`）→ flex 内左列 `aside.hidden lg:block lg:w-[140px]` + `nav.sticky top-[72px]`（标题 `PAGE GUIDE`）→ 右列 `div.flex-1 min-w-0`。手机另有 `lg:hidden sticky top-[72px]` 横向 nav（共 2 个 section-nav）。
- **正文容器必须左贴边**：`div.max-w-none.px-3.lg:pl-6.lg:pr-10`（写 `mx-auto max-w-7xl` 会在 flex 列里二次居中）。改则所有 section 一起改。侧栏右缘 = 正文左缘 x=140。
- **分节（7 页模板，2026-09-23 实测 6 个 section）**：`#overview`（configurator + 图轮播，`scroll-mt-[72px]`）/ `#description` / `#parameters` / `#why` / `#faq`（后四者 `scroll-mt-[120px]`）/ Related Products（**无 id**）。h2 全部 `text-left`。
  - **nav 项数 = 7（✅ 2026-09-23 22:2x 起 sic-ultra，最后一条来自 `Manufacturing & QA`）**：Overview / Product Description / Technical Parameters / Why CHITEK / **Manufacturing & QA** / FAQ / Application。
    - ⚠️ `#manufacturing` **不是独立 section** —— 它是 `#why` 内的制造块外壳 `<div id="manufacturing" class="mt-8 scroll-mt-[120px]">`（`scroll-mt` 也能挂普通 div）。所以**锚点数(7) ≠ section 数(6)**：`#overview`/`#description`/`#parameters`/`#why`/`#faq`/`#application` 是 6 个 section，第 7 个锚点在 section 内部。
    - ⚠️ **已知取舍（用户认可的设计）**：`#manufacturing` 在 `#why` 内部，`pick()` 取「已越过判定线的最后一节」→ 读到制造块**之后的 Certifications 时，高亮仍停在 `Manufacturing & QA`**（spy 无法感知内嵌锚点何时结束）。要彻底解决需给 Certifications 也加锚点或把制造块提成独立 section。
    - ⚠️ 仅 sic-ultra 有 `#application` 与 `#manufacturing`（其余 6 页都没有）→ **不能把这 7 项当 7 页通用模板**。
    - ⚠️ 侧栏仅 140px（文本可用 107px）→ **长文案本来就折行**：`Product Description` / `Technical Parameters` / `Manufacturing & QA` 实测均 `h=55`（2 行），`Overview` / `Why CHITEK` / `FAQ` / `Application` 为 `h≈34–36`（1 行）。**折行是既有风格，不是缺陷**；判定"是否异常"要跟既有最长项比 h，别用固定行数公式。
  - ⚠️ **nav 有两处镜像、必须同时改**：桌面 `aside > nav.sticky`（`a.js-secnav`，10 空格缩进）+ 手机 `nav.lg:hidden.sticky`（8 空格缩进，**无 `js-secnav`**）。**只有桌面的 `<a>` 带 `js-secnav`**（scroll-spy 只挂桌面）；手机那条靠同一 `href="#id"` 直接锚点跳转。
  - ✅ **scroll-spy 是自动纳入的**：`pick()` 用 `querySelectorAll('.js-secnav')` 按 DOM 顺序配 `getElementById(href.slice(1))` → **新加一条 `<a href="#x" class="js-secnav">` 只要 `#x` 存在就自动参与高亮，无需改 JS**。前提：**nav 里的书写顺序必须 == section 的 DOM 顺序**（否则 `pick()` 的 `break` 会提前终止）。加项后务必断言 `nav 顺序 == DOM 顺序`。
- **`#overview` 顶部内边距 = `pt-[clamp(14px,1.5vw,24px)]`**（2026-09-23 由 `clamp(28px,3vw,48px)` 收小；1440 实测 21.6px）→ 决定 **H1 与右侧 `[data-gallery]` 图卡离面包屑的距离**（两者同时上移，相对对齐不变：卡片 `pt-2` 保留）。⚠️ 只有 `#overview` 这行改，`#description` 仍是 `clamp(28px,3vw,48px)`；文件里两串共存，批量替换必须锚定 `id="overview" data-product-top`。7 个详情页同模板，需要一起改。

## 字体
- 全站**只有 2 个字族**：`Barlow`（正文）/ `Barlow Condensed`（标题）。14 个 `@font-face` 全在 `global.css`。表单控件无需写字体类（Tailwind v4 preflight 已 `font: inherit`）。
- ⚠️ **用户裁定（勿再提）**：`active-harmonic-filter.astro` 的系列卡标题用 Condensed、列表页同概念卡用 Barlow —— **不算问题**。判定标准只有一条：**是否用了 Barlow/Condensed 之外的字族**，两者之间选哪个都对。
- 核查**必须**用 Playwright 读 computed style；探针只取「有 textContent」的元素会漏 input/textarea（**还要单独扫一遍 `input/textarea/button`**）。
- **英文站（2026-09-23 字体统一 Phase 1）已实装，口径与上面不同，别再按「h1/h2 用 Condensed」核查 en 页**：
  - `global.css` `@layer base` 内：`html[lang="en"] h1..h6 { font-family: var(--font-barlow) }` + 统一 Type Scale（h1 `clamp(2.25rem,5vw,2.75rem)`/800/-0.01em/lh1.12、h2 `clamp(1.75rem,3.5vw,2rem)`/700/-0.01em/lh1.2、h3 `1.375rem`/600、h4 `1.125rem`/600）。base 层→**页面工具类可逐处覆盖**（如 H1 写 `font-bold` 就落到 700，属设计内，不算违规）。
  - `@layer` **外**的保险丝：`html[lang="en"] { --font-barlow-condensed: var(--font-barlow) }` + `html[lang="en"] .font-barlow-condensed { font-family: … }`。改「变量指向」能同时拦住 `.font-barlow-condensed` 与 `font-[family-name:var(--font-barlow-condensed)]` 两种写法（新闻页大量用后者）。
  - **验收口径（2026-09-23 实测 sic-ultra-ahf）**：渲染字族只有 `Barlow`（340/349 个渲染元素；另 9 个是 `<title>/<script>/<style>` 不渲染节点，不算违规）；**Barlow Condensed 命中 0**；网络只请求 `Barlow-400/500/600/700.woff2` 4 个文件、**Condensed 的 3 个 woff2 零请求**；渲染字重 400/500/600/700 全在已加载集合内（无合成粗体）。
  - **字距只有两种用法**：标题收紧 `-0.01em`（h1/h2，见 global.css base 层）／标签放宽（小号大写标签）。本页自身用 `-0.01em` + `0.08em` + `0.15em` 三个值即达标。
- 🚧 **Phase 2 待办（全站，与本页无关的别算到某一页头上）**：① 删残留 `font-barlow-condensed` 类名（sic-ultra-ahf 现有 7 处 = h1×1 + h2×6，渲染已合规）；② 归一化字距 —— 共享 `Nav.astro` / 页脚贡献 **6 种 em 量级**（0.02/0.03/0.04/0.06/0.08/0.15）；③ 统一 h3/h4 字重（h3 已 100% =600；h4 页脚栏目名是 700，本页正文 h4 是 600）。
- 审计脚本（可复用，路径与 `verify_*` 同目录 `00_中转站\`）：`font_src_scan.py`（源码层）/ `font_audit_sic.py`（运行时，输出 `_font_audit_sic.txt` + `_font_rows.json` 349 条明细）/ `font_trace.py`·`font_trace2.py`（字距/内联 style 来源定位，靠 `data-astro-cid-*` 判断归属组件）。

## 参数表 / Related / 滚动高亮
- 参数表：`text-[clamp(14px,1.1vw,16px)] leading-tight`；每格 `py-2 px-4 pr-10`（末行 `Communication` 无 `border-b`）。
  - **标签列 = `w-[22%]` + `whitespace-nowrap`（2026-09-23 起，7 页统一）**。原 `w-1/6` = 193px（1440）会让
    `Switching Frequency`、`THDi (after compensation)` 折成 2 行（7 页全部有这个问题，已实测）。
    `w-[22%]` = 255px / 1366 下 240px，刚好单行。`<td>` 侧本来就 `whitespace-nowrap`，**两列都保留**。
    - 宽度由**同列最宽单元格**决定 → `w-[22%]` 写在任一 `<th>` 上即可；现 6 个页面写在全部 17 个 `<th>`（保持原结构），`sic-ultra-ahf` 写在首个。
    - 改完必须跑双档实测（1440/1366）：`th` 行高 ≈37/36（单行）、`th`+`td` 都不换行、表格 `scrollWidth == clientWidth`、页面横向溢出 0。
  - `#parameters` 容器单独 `lg:pr-[clamp(40px,8vw,160px)]`。
  - **行交替底色（斑马纹，2026-09-23）**：规则写在 `src/styles/global.css` **末尾、`@layer` 之外** ——`#parameters tbody tr:nth-child(odd) > * { background-color:#ffffff }` / `(even) > * { background-color:#f2f5f8 }`。⚠️ **必须用 `> *`**（同时命中 `th`+`td`）：`th` 自带 `bg-[#fafbfc]`，只给 `<tr>` 上色会被它自己的背景盖住 → 标签列不参与交替（变成「一列恒灰 + 一列斑马」）；写在 `@layer` 之外才能盖过 Tailwind `utilities` 层。7 个英文详情页共用 `#parameters`（其它语种无此 id）→ **一处生效**，改深浅只需动 `#f2f5f8`。
  - ⚠️ **`#parameters` 表不是一个共用模板，几乎每行都逐页不同**（2026-09-23 21:0x 全量抽取确认）：**sic-ultra = 16 行**，其余 6 页 = **17 行**（末尾多一行 `Dimensions`）。差异行（均逐页不同）：`Rated Voltage` / `Rated Capacity` / `Frequency` / `Wiring Mode` / `Filtering Range` / `Full Response Time` / `Switching Frequency` / `Efficiency` / `Power Loss` / `THDi` / `Topology` / `IP Class` / `Installation` / `Standard` / `Communication`；**只有 `Function` 是 7 页统一**。⟹ **改参数表先问「哪几页」，绝不能把某一页的值套到 7 页**（会把 8–20A / IGBT / 20kHz 机型写假）。
  - **sic-ultra 16 行现行值（2026-09-23 21:0x 用户改定）**：`208 VAC/400 VAC/480 VAC` │ `50 A/75 A/100 A/150 A/200 A per module (up to 16 units in parallel)` │ `50 Hz (47–53 Hz) / 60 Hz (57–63 Hz)` │ `Three-phase four-wire (3P4W) or three-phase three-wire (3P3W)` │ `2nd – 51st order harmonic (amplitude adjustable)` │ `Harmonic mitigation, reactive compensation, imbalance phase balancing` │ `< 5 ms` │ `up to 40 kHz (SiC)` │ `Up to 99%` │ `< 1.8% of rated kVA` │ `< 3% (closed loop)` │ `3-level NPC, SiC MOSFET` │ `IP20 (other IP levels is customizable)` ⚠️语法待定 │ `Wall mounted /Rack mounted` │ `IEEE 519 / IEC 61000-3-6 /EN 62477-1` │ `Modbus  RTU, TCP/IP`。改造脚本 `00_中转站\patch_params_sicultra.py`（备份 `F:\trash\20260923-210745_params-sic-ultra\`）／验证 `00_中转站\verify_params_sicultra.py`（fails=0/16）。抽取对照脚本 `00_中转站\dump_params_tables.py` → `_params_tables.txt`。
  - 其余 6 页参数表**原样未动**。若要收敛到同一套 16 行，**必须逐页给真值**（尤其 `Rated Capacity`：anti-pollution 50–200A、distributed 30–50A、ip65/ip65-sic-fanless/sic-fanless 8–20A、ultra-slim 8/15/20A；`Topology`：ip65-sic-fanless/sic-fanless 是 SiC，其余 4 页 IGBT）。
- Related Products：4 张同显自动轮播（`[prev]` + `[data-rel-viewport].flex-1` + `[next]`）；track `gap-10`、卡 `w-[calc((100%-7.5rem)/4)]`（1440 实测 253px）、img `aspect-square`、**只有标题无描述**；6s 循环、hover/滚出暂停。JS 步长 = 运行时 `cards[1].left-cards[0].left`。⚠️ 断言 `data-rel-*` 前先切出 section 片段（底部 JS 同串）。
- 滚动高亮：确定性 `pick()`（`top-(72+120)<=0` 的最后一节，滚到底强制末节）+ rAF，**不要 IntersectionObserver**。高亮类 `:global(.js-secnav.is-active)`。
  - ⚠️ **判定线 = `NAV_H(72)+BUFFER(120)` = 192px**。页面停在顶部时 `#overview` 顶通常已越过 192 → **开局就高亮 `Overview` 是正确行为，不是 bug**；但 768/390 因为多一条 sticky 横 nav 把内容顶下去，开局反而**不高亮**。→ **断言写「开局高亮为 0 项 或 仅 Overview」，别写「必须 0 项」**（2026-09-23 22:1x 踩过）。

- **WHY 区块**（`<section id="why">`，位于 `#parameters` 与 `#faq` 之间、Certifications 上方）：
  - 结构 = `<h2>`（**H2 标题逐页不同**：sic-ultra `WHY CHITEK SiC MOSFET Active Harmonic Filter?`、anti-pollution/distributed/ip65/ultra-slim `WHY CHITEK Active Harmonic Filter?`、ip65-sic-fanless `WHY CHITEK IP65 SiC-Fanless & Low Noise Active Harmonic Filter?`、sic-fanless `WHY CHITEK SiC-Fanless & Low Noise Active Harmonic Filter?`）+ `<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">` 里 **4 张卡**。
  - 卡片类：`<div class="rounded-2xl border border-border-light p-6">` ／ 卡标题 `<h3 class="text-brand-orange font-semibold mb-2 text-[clamp(15px,1.35vw,22px)]">` ／ 正文 `<p class="text-text-mid text-[clamp(13px,1.15vw,17px)] leading-relaxed">`。
  - ⚠️ **2026-09-23 21:1x 起 sic-ultra 这一页已分化**：其他 6 页仍是旧 4 卡（`Performance you can specify` / `One module, any size of plant` / `Already running in your industry` / `Engineers before and after the order`，其中第 1 张卡按页写 `SiC MOSFET` 或 `IGBT`）。**sic-ultra 换成**：① `Easy to install and commission`（`sm:col-span-2`，卡内 **Hardware**/**Software** 两个加粗小标题，Hardware 下 2 项 `<ul>`）② `Potting Protection` ③ `Smart Sleep Mode`（`<ul>` 3 项）④ `Resonance suppression`（`sm:col-span-2`，`<ul>` 2 项）。
  - 加粗小标题用 `text-text-dark font-bold text-[clamp(13px,1.15vw,17px)]`；多行项目用 **`<ul class="list-disc pl-5 space-y-1">`**（项目既有写法，`products.astro` 在用；**必须带 `list-disc pl-5`**，Tailwind preflight 会把 `ul` 的圆点和缩进清掉）。
  - 改造脚本 `00_中转站\patch_why_sicultra.py`；验证 `00_中转站\verify_why_sicultra.py`（20/20 PASS）。

- **两个新增区块（2026-09-23 21:2x 建壳，仅 sic-ultra；**正文均已填**，见下）**：
  1. **Manufacturing & Quality Assurance Capabilities** —— 位于 **`#why` 内部**、4 张卡之后、`Certifications` 之前（**不是独立 section**，故不计入 section 数）。**✅ 2026-09-23 21:3x 正文已填**：`<div id="manufacturing" class="mt-8 scroll-mt-[120px]">` + `<h3>`（同 Certifications 的 class）+ 1 段引言 + **4 张卡**（`<div data-mfg-qa-slot class="grid grid-cols-1 sm:grid-cols-2 gap-5">`，卡内 `<h4 class="text-brand-orange font-semibold mb-2 text-[clamp(14px,1.25vw,20px)]">`）：
     - ✅ **2026-09-23 22:2x 挂了锚点 + 进了 nav**（用户要求「Manufacturing & Quality Assurance Capabilities 对应的是 **Manufacturing & QA**」）→ 外壳 div 加 `id="manufacturing"` 与 `scroll-mt-[120px]`；桌面 PAGE GUIDE + 手机横 nav 各插入一条 **`Manufacturing & QA`**（`&` 写成 `&amp;`），位置 **排在 `Why CHITEK` 之后 / `FAQ` 之前**（与锚点 DOM 位置一致）。
       - ⚠️ **锚点定位技巧**：`<div class="mt-8">` 在文件里有 **2 处**（不唯一）→ 必须用**上一行注释**做锚：`'      <!-- Manufacturing & Quality Assurance Capabilities -->' + CRLF + '      <div class="mt-8">'`（该两行组合唯一）。
       - 脚本 `00_中转站\patch_nav_manufacturing.py`（fails=0）／ 验证 `00_中转站\verify_nav_manufacturing.py`（**73/73 PASS**）。备份 `F:\trash\20260923-222424_nav-manufacturing\`。850 → 852 行。
     - `ISO 9001:2015 quality system` ／ `Complete in-house production line` ／ `Every unit burn-in tested` ／ `Proven in the field`
     - 层级：h2（WHY）→ **h3（Manufacturing）** → h4（卡片）；与同层 `Certifications` h3 平级。
     - 事实来源（**全部站内既有，未新编**）：`en/about.astro` 的 ISO 9001:2015（SGS）/ CE（TÜV）/ UL 508 / IEC 61000 / RoHS；`en/news/apf-industry-practitioner-2026.astro` L230-237 的 2,300 m² 自有厂房、自研老化柜（**专利 CN22268956U**）、AHF 5–200A、1U–4U、10+ 国家；`en/services.astro` 的 15 道工序（IQC → SMT/DIP → Board FCT → IPQC → 安规 → ATE → Potting → Aging → Post-Aging FQC）。
     - 脚本 `00_中转站\fill_mfg_block.py` ／ 验证 `00_中转站\verify_mfg_block.py`（19/19 PASS）。
  2. **Application of the SiC Ultra AHF** —— **独立 section**：`<section id="application" class="bg-white pt-[clamp(28px,3vw,48px)] pb-[clamp(40px,4vw,72px)] scroll-mt-[120px]">`，H2 与其它节同 class。位置 = **`#faq` 之后 / Related Products 之前**。
     - ⚠️ 背景色用 `bg-white` 而非 `#fafbfc`：`#faq` 与 Related 都是 `#fafbfc`，插入白色正好把两个同色块隔开（原本相邻冲突）。
     - **✅ 2026-09-23 22:0x 正文已填 = 从 `en/solutions.astro` 挑的 3 张案例卡**：容器 `<div data-application-slot class="grid grid-cols-1 lg:grid-cols-3 gap-5">`，每张 `<article class="flex flex-col rounded-2xl border border-border-light p-6">`。
       - 卡内**固定 5 件套顺序**：行业 kicker `<p class="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-3">` → 标题 `<h3 class="text-[clamp(15px,1.35vw,21px)] font-semibold text-text-dark mb-3 text-left">` → 描述 `<p class="text-text-mid text-[clamp(13px,1.15vw,17px)] leading-relaxed mb-4">` → 结果行 `<p class="text-[13px] font-semibold text-brand-orange mb-5">` → **Read 链接** `<a href={lp('/')} class="mt-auto inline-block text-[13px] leading-snug font-semibold text-brand-orange hover:underline">`（`mt-auto` 让三卡的 Read 底对齐）。
       - ⚠️ **Read 的锚文本 = 用户指定的整串 SEO 长文案**——`China Active Harmonic Filter, SVG Static Var Generator Suppliers, Manufacturers, Factory - CHITEK`（103 字符），**3 张卡各 1 条、全部 `href={lp('/')}`**，**不是**单词 "Read"。用户原话口径：`read改成<那串>` + 「正常有个 read 按钮」（2026-09-23 22:0x）。
       - 三例（**跨行业挑，全部取自 solutions 页既有案例数据，未新编**）：`Data Center` 40 MW hyperscale（THD 14.0%→2.8%，AHF-200A×6）／ `Industrial Manufacturing` 12-inch wafer fab（sag < 5 ms，良率 +3 pt）／ `Commercial & Medical` 2,000-bed hospital（THD 18.3%→4.1%，AHF-200A×2）。描述实测 **76 / 71 / 71 词**（满足用户「足够的描述」）。
       - 卡片**无图**（纯文字，与 Manufacturing 4 卡一致）；特殊符号走实体：`&mdash;` / `&rarr;` / `&middot;` / `&deg;` / `&minus;`。
       - 脚本 `00_中转站\fill_application_cards.py` ／ 验证 `00_中转站\verify_application_cards.py`（**89/89 PASS**）。备份 `F:\trash\20260923-220614_application-cards\`。826 → 848 行。
       - ✅ **2026-09-23 22:1x 已进 nav**（用户要求「左边的 PAGE GUIDE 有个 Application 指引」）→ 桌面侧栏 + 手机横 nav 各加一条 `Application`（排在 FAQ 之后，与 `#application` 的 DOM 位置一致）。脚本 `00_中转站\patch_nav_application.py`（纯插入：`js-secnav` 5→6、行数 +2、`href="#application"` 0→2、字节增量 == 两行 + 2 个 CRLF、**difflib opcodes 只允许 `insert`**、nav 顺序 == DOM 顺序）；验证 `00_中转站\verify_nav_application.py`（**51/51 PASS**，含点击跳转 + 三处 scroll-spy 高亮）。备份 `F:\trash\20260923-221426_nav-application\`。848 → 850 行。
       - ⚠️ 侧栏宽 **140px**（`aside`，含 1px 右边框）→ 内部 `nav` 实测 **139**，`Application` 链接 13px 单行不换行（实测 h≈34 < 42）。量侧栏宽要量 `aside`，别量 `nav`（差 1px 会误判成 FAIL）。
  - 占位文案统一 `Placeholder block — content to be added.`；**✅ 2026-09-23 22:0x 起 `[data-mfg-qa-slot]` / `[data-application-slot]` 两个占位框都已替换为真内容**（钩子保留、值可直接定位）。
  - 脚本 `00_中转站\add_two_shell_sections.py`（两处插入**一次拼接**；断言：head/mid/tail 原位未变 + **difflib opcodes 只允许 `equal`/`insert`**（即纯插入、无修改无删除）+ `</section>`/h2/h3 各 +1 + 行尾全 CRLF）。备份 `F:\trash\20260923-212124_two-shell-sections\`。764 → 776 行。
  - 验证 `00_中转站\verify_two_shells.py`（**14/14 PASS**）：`#application` 存在且 H2 文案对 + DOM 顺序 `#faq(4) < #application(5) < Related(6)` + `#why` 内 H3 顺序 = 4 张卡 → Manufacturing → Certifications + 两个空壳可见（h=77）且 `border-style:dashed` + 无横向溢出 + 无 JS 报错。

## Certifications 区块（7 个模板页都有）
- 位置：`#description` 分节底部（`<h3>Certifications</h3>` + `div.grid.grid-cols-2.md:grid-cols-4.gap-4`），内含 4 个 `div.cert-slot`。
- **格内盒子比例 = `aspect-[3/4]`（2026-09-23 起）**。原来是 `aspect-[4/3]`，但证书是 **A4 竖版**（1:√2），塞进 4:3 横格会被 `object-contain` 压到 ~172×232px，纸面文字完全看不清；改竖格后 1440 下渲染 279×378，4 格等高（网格行高 422px）。
- 已填真图（**2026-09-23 起 7 个模板详情页全部同步**，4 格同一套）：
  | 格 | 文件（`public/assets/images/`） | 内容 | 说明文字 |
  |---|---|---|---|
  | 01 | `certificate-01-eutest-ce.webp` | CE — LVD 2014/35/EU & EMC 2014/30/EU（EUTEST，No. TD11432302.R1） | `CE — LVD & EMC (EUTEST, 2023)` |
  | 02 | `certificate-02-tuv-sud.webp` | LVD 2014/35/EU（TÜV SÜD，No. N8A 136516 0001 Rev. 00） | `LVD 2014/35/EU (TÜV SÜD, 2026)` |
  | 03 | `certificate-03-ccic-emc-report.webp` | EMC 测试报告（CCIC-SET，Report No. SET2022-01936，CNAS L1659） | `EMC test report (CCIC-SET, 2022)` |
  | 04 | `certificate-04-ccic-ce-lvd.webp` | CE 安规（CCIC-SET，No. SET2022-02884 / EN 62477-1:2012+A11:2014 / LVD 2014/35/EU） | `CE / LVD 2014/35/EU (CCIC-SET, 2022)` |
- ⚠️ legacy `active-harmonic-filter.astro` **没有 Certifications 区块**（无 `cert-slot`）→ 任何证书批处理都要跳过它。
- ⚠️ 03/04 两张 CCIC 件上的申请人/品牌是 **Shenzhen Origin New Energy Technology Co., LTD（品牌 ORIGIN）**，不是 CHITEK，且为 2022 年签发 → 与 01/02 的公司名不一致。
- ⚠️ `en/about.astro` 也有一块「Certifications & Honors」（`#certCarousel`），但那是 **4 张文字/图标卡**（CE / UL / ISO 9001 / IEC 字样块），不是证书图格 → 未动。
- 结构模板：`<a href="/assets/images/xxx.webp" target="_blank" rel="noopener noreferrer" class="group block">` → `<div class="aspect-[3/4] rounded-xl border border-border-light bg-white overflow-hidden flex items-center justify-center p-2 transition-shadow group-hover:shadow-md">` → `<img class="w-full h-full object-contain" width height loading="lazy" decoding="async" />`，`</a>` 后接一行 `p.mt-2.text-[13px].text-text-muted.text-center` 说明。**不做灯箱** —— 点缩略图 = 新标签打开原图。
- 图片规格（**证书是例外，不套产品图那条 1200×1200 方图规则**）：源为 A4 竖版扫描件 → 白底展平（源 PNG 是 RGBA，不展平透明处会变黑）、宽 1200、WEBP q82 → 1200×1696 / 1200×1697，约 164KB / 104KB。
- 脚本：`00_中转站\cert_sync_all.py`（**转图 + 7 页一次同步**：读/写用 `newline=''` 保 CRLF；用 div 配平定位网格、只在网格区间内断言；可复用）。单页版 `cert_to_webp.py` / `patch_cert_slots.py`。
- ⚠️ **`certificate-01-eutest-ce.webp` 有效期 02.07.2026 已过期**（签发 11.07.2023，3 年制）→ 上线前必须换新证。
- 验收：4 图 `naturalWidth/Height` = 1200×1696 / 1200×1697 且 `complete=true`、4 格同高（422px @1440）、`aspect-[4/3]` 残留 0、0 JS 报错、改动 diff **只落在证书网格内**（每格 -8/+6 行）。⚠️ Playwright `requestfailed` 里出现的懒加载图片（如 `products-ahf-sic.webp`）多为关页时 abort，**必须另用 HTTP 实测**确认是否真坏图。

## 顶部区域结构（2026-09-23 16:3x 重构；7 个模板页同模板，惯例 7 页全改）
- 左栏自上而下 = **H1 → Tags 行 → 9 行陈述块**（到陈述块就结束）；右栏 = **图卡 → configurator 卡片**（configurator 已从左栏移走，落在图卡下沿）。
  - 📌 **2026-09-23 17:5x：SKU 框 / Quote / Download 已从左栏下移到 configurator 卡片底部的汇总条** → 全页只剩 **1 个** `quote` 表单。
  - ⚠️ 副作用（2026-09-23 20:5x 实测 @1440）：左栏高 **517px**、右栏（图卡 532 + 间距 + 卡片 559）高 **1119px** → **左栏下方留白 602px**（7 行块时为 449 / 674）。要收掉留白只能把卡片改成跨两栏的通栏卡（`右下角` 语义会变）—— **用户 18:0x 明确「先别改成通栏」**。
- **Tags 行**：`<p class="text-[clamp(12px,1.05vw,15px)] text-text-mid leading-[1.5] mb-5 uppercase">`，内部 `<strong class="… font-bold normal-case">Tags</strong>` —— ⚠️ **`normal-case` 不能去**，否则「Tags」标签本身也被大写；6 个 tag = `<a href={lp('/')}>`，色 `#0000EE` + `hover:underline`。
- **陈述块**：`<div class="text-[clamp(14px,1.25vw,20px)] text-text-mid leading-[1.9] mb-5">`，**9 行**同构 `<p><strong class="text-text-dark font-bold">X:</strong> 值</p>`，**顺序固定**（2026-09-23 20:5x 用户改定，原 7 行）：
  `Function:` → `Rated Voltage:` → `Power Capacity:` → `Efficiency:` → `Filter Performance:` → `Nominal Frequency:` → `Connection Type:` → `Installation:` → `Warranty:`
  （演进：4 行 → 17:15 改 7 行 → 20:5x 改 9 行。）
  1440 实测：9 个 `<p>` 但**渲染 10 个行框**（`Function` 的值在 590px 宽下折 2 行）、**块高 342px**、字号 18px / 行距 **34.2px（`leading-[1.9]`）**、标签 700。
  - **7 页同文案的 5 行**：`Function:`、`Filter Performance: up to 97%`、`Nominal Frequency: 50/60HZ`、`Connection Type: 3 Phase 3 Wire / 3 Phase 4 Wire`、`Warranty: Standard 2 years/negotiable`。
    ⚠️ `Filter Performance` 与 `Connection Type` 是 **2026-09-23 新增字段**，`#parameters` 表里**没有对应行** → 7 页只能是同一个写死的值（`up to 97%` / `3 Phase 3 Wire / 3 Phase 4 Wire`），**如需按页取值要先补表**。
    ⚠️ `Frequency:` 已**改名** `Nominal Frequency:`（值仍 `50/60HZ`）—— 别在别处再写裸 `Frequency:`。
    `Connection Type` 的值 = configurator `Wiring` 组 `3P3W`/`3P4W` 的展开写法（两处口径一致，改动时一起看）。
  - `Rated Voltage:` 随页：sic-ultra / ultra-slim / distributed / ip65-ahf / sic-fanless = `208/400/480 VAC`；anti-pollution = `208/400/480/690/800 VAC`；ip65-sic-fanless = `400/480/690 VAC`。
  - `Power Capacity:` 随页，取该页 configurator `data-group="a"` 选项 + 统一后缀 ` single module (unlimited for parallel)`：`50/75/100/150/200A`（sic-ultra / anti-pollution / ip65）· `30/50A`（distributed / sic-fanless）· `8/15/20A`（ultra-slim）· `8/20A`（ip65-sic-fanless）。
  - `Efficiency:` 随页，取该页 `#parameters` 表：sic-ultra `up to 99%`（用户原文小写）；`≥ 97%`（anti-pollution / ultra-slim / distributed / ip65）；`≥ 98%`（ip65-sic-fanless / sic-fanless）。
  - `Installation:` 7 页统一 `Wall mounted/Rack mounted/Cabinet`（斜杠两侧不加空格）。⚠️ **`/Cabinet` 是 2026-09-23 20:5x 用户新加的**，但同页 configurator 的 `Installation` 组**只有 `Wall` / `Rack` 两个选项、没有 Cabinet** → 两处口径暂时对不上（已回报，未擅自加选项，因为会连带改料号的 `i` 段）。
  - 🔎 **`Installation` 这个字段全站共 4 种写法**（改之前必须四处一起看）：① 顶部块 = `Wall mounted/Rack mounted/Cabinet`（7 页）；② configurator `data-group="i"` = `Wall` / `Rack`（7 页，无 Cabinet）；③ `#parameters` 表 = `Wall mounted / floor stand cabinet`（6 页）；④ `#parameters` 表 · sic-ultra = `Wall mounted /Rack mounted`（仅此页；2026-09-23 21:0x 用户由 `rail mounted` 改）。
  - ⚠️ **顶部这几行与 `#parameters` 表有既有口径冲突（未解决，等用户定）**：① `Installation` 表里写 `Wall mounted / floor stand cabinet`（sic-ultra 表写 `Wall mounted / rail mounted`）—— 顶部新加的 `/Cabinet` 与表的 `floor stand cabinet` 方向一致但措辞不同；② `ip65-ahf` 与 `sic-fanless-ahf` 的表 `Rated Capacity` 是 `8 A – 20 A`，与该页 configurator/顶部的 50–200A、30/50A 打架；③ sic-ultra 顶部有 `200A` 而表里只列到 `150 A`。
- 9 行改造脚本 `00_中转站\meta_9lines.py`（**从旧块里原样抽出 Rated Voltage / Power Capacity / Efficiency 的本页真值再重排**，所以不会把 sic-ultra 的 200A 套到 8A 机型上）；验证 `00_中转站\verify_meta9.py`（7 页：9 个标签顺序 + 文案 + 行距 34.2px/25.5px + 溢出 + JS 报错）。
  - ✅ **静态复核用 `00_中转站\final_check9_v2.py`（fails=0/7）**——它**先切 111 行那个 statement block 的 div 再比对**。⚠️ 别用旧版 `final_check9.py`：它拿**整文件**正则扫 `<strong>`，会把 `#parameters` 表里的 `<strong>` 也算进 `== EXPECT`，7 页全报假阴性 BAD。**教训：核对脚本必须先切目标区域，再 `==`。**
- 改造脚本 `00_中转站\meta_7lines.py`（正则锁定旧 4 行块 → 写 7 行；断言「块前/块后逐字节未变」+ 新标签顺序）；行距脚本 `00_中转站\leading_17.py`。
- ⚠️ 陈述块与 Tags 段的 `leading-[1.7]`、块间 `mb-5` 都是 **2026-09-23 多轮微调**的结果（先 1.9/1.625 → 收 1.5 → 17:23 放回 1.7；块间 `mt-[clamp(20px,2vw,32px)]` 是 16:3x 重构那一轮新增）。
- **右栏必须多包一层裸 `<div>`**：`<div>` → `<div data-gallery …>`（缩进 +2）→ 空行 → configurator **卡片** `<div class="mt-[clamp(20px,2vw,32px)] rounded-2xl border border-border-light bg-white overflow-hidden">`（缩进 +2）。1440 实测：图卡底 674 → 卡片顶 703（间距 29px），两列 left 均 810、宽均 590；卡片 **559px** 高。
- 改造脚本 `00_中转站\transform_top_area.py`（含幂等判断，可重复跑）+ `polish_top_area.py`（修纯空白）；校验 `check_top_area.py`（13 断言）。
- ⚠️ **行距（2026-09-23 17:32 用户定）**：**参数块（7 行陈述块）= `leading-[1.9]`**（34.2px @18px，块高 274px）；**Tags 行 = `leading-[1.7]`**（25.5px @15px）—— **两段故意不同**，用户只要求放大「顶部参数」的行距。别把 Tags 一起改掉。
  - 只替换这两段**完整 class 串**（裸串 `leading-[1.5]`/`leading-[1.7]` 在文件里恰好各只 1~2 处，但仍按完整串走）：
    `text-[clamp(12px,1.05vw,15px)] text-text-mid leading-[1.7] mb-5 uppercase`（Tags）
    `text-[clamp(14px,1.25vw,20px)] text-text-mid leading-[1.9] mb-5`（参数块）
  - 演进史：1.9 / 1.625 →（11:31 收）1.5 →（17:23 放）1.7 →（17:32 参数块再放）**1.9**。
  - 块间 `mb-5`(20px) **始终未动**（那是段间距不是行距）。

## 顶部 configurator = 「Configure your SKU」卡片（2026-09-23 17:5x 重构，7 页同模板）
- **卡片外壳**：`<div class="mt-[clamp(20px,2vw,32px)] rounded-2xl border border-border-light bg-white overflow-hidden">`，从上到下 3 段：
  **① 头部**（标题 + SKU chip）→ **② 副标题 + 分组区**（`div.px-5.pb-5.space-y-4`）→ **③ 汇总条**。
- **头部**：`<p class="m-0 text-[clamp(16px,1.4vw,22px)] font-bold text-text-dark">Configure your SKU</p>` + 右侧 chip
  `<span class="inline-flex items-center gap-1.5 rounded-md border border-border-light bg-[#fafbfc] px-3 py-1.5 text-[14px] whitespace-nowrap"><span class="text-text-muted">SKU:</span> <span data-sku-chip-val class="font-semibold text-brand-orange">&mdash;</span></span>`
  ⚠️ 标题用 `<p>` **不是 `<h3>`**（页内 h1 之后直接是 h2，加 h3 会跳级）。
- **副标题**：`Pick voltage, capacity, wiring and installation — the selector fills in the matching part number.`
- **分组标签**：`text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-2`（旧 `text-[clamp(14px,1.25vw,20px)] font-bold text-text-dark` 已废）；
  文字仍为 **`Rated Voltage` / `Power Capacity` / `Wiring` / `Installation`**（`Wiring:` 的冒号已去掉）。
- **选项 = 纯按钮**：`<label class="inline-flex items-center rounded-md border border-border-light bg-white px-3.5 py-2.5 text-[16px] font-medium text-text-mid cursor-pointer transition-colors hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange has-[:checked]:text-white">`；
  选中态 = **实心品牌橙 `rgb(255,107,26)` + 白字**；复选框 `<input type="checkbox" class="sr-only" data-group=…>` **视觉隐藏**。
  ⚠️ `sr-only` 是 `position:absolute` → **用 `offsetParent !== null` 判「可见」会误判成 13 个都可见**；要量 `getBoundingClientRect()` 的宽高（实测 1×1）。
- **汇总条** `div.border-t.border-border-light.bg-[#fafbfc].px-5.py-3.5`：`flex flex-wrap items-center gap-3` →
  form（`class="m-0 flex-1 min-w-[280px]"`）+ 按钮组（`shrink-0 sm:ml-auto`）：只剩 **`Quote this configuration →`**（`type="submit" form="ahf-quote-form"`，实心橙，按钮在 form 外靠 `form` 属性关联）。
  - 🗑️ **`Download` 按钮已于 2026-09-23 21:5x 用户要求删除**（含它那段落盘 `data-download-config` 的 JS handler，一并删除；`data-download-config` 全站该页已清零）。旧规格「白底描边 Download」作废。
  - ⚠️ **`min-w-[280px]` + `flex-wrap` 是刻意的**：卡片只有 590px，SKU 行（~78 字符）与按钮无法同行 → 让按钮换到第二行，**SKU 行拿到全宽**；窄屏（卡片通栏）时又能回到同一行。别改回 `flex-col sm:flex-row`。
- **料号行 = 隐藏字段 + 样式化文本块（2026-09-23 21:5x 重构，替换掉原来的只读 textarea）**：
  原 `<textarea data-inquiry-summary name="message" readonly rows="2">` **已删** —— 因为 **textarea 无法给局部文字单独上色/加粗**（浏览器限制）。现结构：
  ```html
  <input type="hidden" data-inquiry-summary name="message" />
  <p data-summary-view class="m-0 text-[13.5px] leading-snug text-brand-orange"></p>
  ```
  - 隐藏 `<input>` **保留 `data-inquiry-summary` + `name="message"`** → `build()` 的 `b.value = sku` 与回填脚本 `form[name="quote"] [name="message"]` **都不用改**（实测 OK）。⚠️ 旧代码里 `if (b.tagName === 'TEXTAREA') { b.style.height = … }` 已删（不再有 textarea）。
  - JS 在 `build()` 里用 **DOM 创建 3 个 span**（不用 innerHTML，避免注入）：`t1` = `'SKU: '` + `class="text-text-mid"`；`t2` = `partNo + ' · 500 × 550 × {d} mm · {kg} kg · '`（继承父级橙色）；`t3` = `'1300$(EXW)'` + `class="font-bold"`。
  - ⚠️ JS 里 **`partNo` 先单独算出来**（`var partNo = 'CHITEK-SiC-AHF-' + a + '-' + v + '-' + i + '-' + p;`），`sku = 'SKU: ' + partNo + …`，chip 与 t2 都复用它 —— 别再把前缀写死在 sku 串里。
  - 实测色值（1440）：父 `p` = `rgb(255, 107, 26)`；`SKU: ` = `rgb(68, 68, 68)`（`text-text-mid`）；价格 fw = **700**。文本 = `SKU: CHITEK-SiC-AHF-100A-400V-Rack-IP20 · 500 × 550 × 135 mm · 27 kg · 1300$(EXW)`。
  - 验证 `00_中转站\verify_label_line.py`（31/31 PASS，含换选项后隐藏字段与可视行同步、200A→118mm/38kg）。
- **分组排布（2026-09-23 18:0x 起 = 5 组，3 行）**：
  | 行 | 左列 | 右列 |
  |---|---|---|
  | 1 | `Rated Voltage`（`data-group="v"`） | **`Protection Rate`（`data-group="p"`）** |
  | 2 | `Power Capacity`（`data-group="a"`，通栏） | — |
  | 3 | `Wiring`（`data-group="c"`） | `Installation`（`data-group="i"`） |
  第 1、3 行都用 `grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3`（所以文件里这个 grid 串应恰好出现 **2 次**）。
  1440 实测：Rated Voltage 标签 x=831 / Protection Rate 标签 x=1121、**同一 y=818**；卡片高仍 **559px**（新组是并排进来，没长高）。
- **Protection Rate 组**（用户 2026-09-23 18:0x 要求「Rated Voltage 右侧多个 PROTECTION RATE 选择，下面有 IP20 IP65 other」）：选项 `IP20`（**默认**）/ `IP65` / `other`；标签文字写 `Protection Rate`（CSS 大写显示）。
  已并入料号：`DEF` 加 `p: 'IP20'`、脚本加 `var p = pick('p')[0] || DEF.p;`、料号尾部追加 `-{p}` → 例 `CHITEK-SiC-AHF-100A-400V-Rack-IP20`。chip 靠「取 SKU 串第一段」自动带上，无需另改。
- **档位（各页不同，勿套用）**：Rated Voltage 208/400/480V（anti-pollution 还有 690/800V、ip65-sic-fanless 是 400/480/690V）· Protection Rate 7 页统一 IP20/IP65/other · Power Capacity 看各页 `data-group="a"` 选项 + 「Unlimited for parallel (up to 16 modules)」· Wiring 3P3W/3P4W · Installation Wall/Rack。sic-ultra 页合计 **16 个选项**。
- ⚠️ **`Protection Rate` 与独立页 `ip65-ahf` / `ip65-sic-fanless-ahf` 有语义重叠**（IP65 本来是独立产品页），7 页一律加了该组，**用户尚未就此表态**。
- 施工脚本 `00_中转站\cfg_card_all.py`（`20260923-174635_cfg-card-all-ahf` 备份）→ 后续微调 `patch_bar.py`（汇总条换行）、`patch_chip.py`（chip 取前缀）；验证 `verify_cfg_card.py` + `smoke_cfg_all.py`。
- Quote = **站内直发询盘**（同 contact 的 Send Message，非跳转）：`<form name="quote" method=POST data-netlify netlify-honeypot="bot-field" data-lead-form>` + `form-name` 隐藏域 + `[data-utm-fields]` + `bot-field`；textarea `name="message"` 预填 SKU；成功块沿用 contact 的 **`[data-form-success]`** 契约（勿自造属性名）。
  - ⚠️ **[历史，2026-09-23 21:5x 后不再适用]** 「Download 必须在 `<form>` 之外」—— Download 按钮已删，无此约束。
  - ⚠️ **`showSuccess()` 末尾会 `form.reset()`** → 承载 SKU 的表单字段会被清空，且 reset 在 fetch resolve 之后：submit 前存快照 + **100ms 轮询约 10s 回填**，`setTimeout(…,0)` 无效。
    现在该字段是**隐藏 `<input name="message">`**（不再是 textarea），回填脚本按 `form[name="quote"] [name="message"]` 查找 → **仍然有效，无需改**。而且**可视的 `[data-summary-view]` 不受 reset 影响**（它是独立的 `<p>`），所以**不再有「料号行被清空」的视觉闪空问题**。

## 右栏 Resources 卡（2026-09-23 21:4x 新增；**目前仅 sic-ultra**）
- **位置**：`#overview` 右栏、`[data-gallery]` 图卡**正下方**（同一个右栏 `<div>` 里，图卡在前、资源卡在后）。左栏由此变成 `H1 → 标签行 → 9 行参数块 → Configure your SKU 卡`。
- **卡片外壳**：`<div class="mt-[clamp(20px,2vw,32px)] rounded-2xl border border-border-light bg-white overflow-hidden">`（与 configurator 卡同观感），从上到下 2 段：
  **① 定义区** `div.px-5.pt-5.pb-4.space-y-3` → **② 链接清单** `ul.m-0.p-0.list-none.border-t.border-border-light`。
- **① 定义区**（2026-09-23 21:4x 用户要求「值放到右边，和下面同一列」→ **改成左右两列行，值右对齐**）：
  每组 = `<div class="flex items-center justify-between gap-4">`，**标签在左**（`m-0 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted`，⚠️ **不再带 `mb-1`**）、**值在右**（`m-0 text-[15px] font-medium text-text-dark text-right`）：
  `Product` → `SiC MOSFET Active Harmonic Filter`；`Voltage level` → `208/400/480 VAC`。
  ⚠️ **右侧不留 `mb-1`，靠 `items-center` 垂直居中**；值必须 `text-right`，这样右缘和下方 `Download`/`Watch` 共线。
- **② 链接清单**：每行 `<li class="flex items-center justify-between gap-4 px-5 py-3 border-b border-border-light">` = 左侧名称 `span.text-[15px].text-text-dark` + 右侧链接
  `<a href="#" data-doc-link="<key>" data-link-pending class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-orange hover:underline whitespace-nowrap">`。
  实测 5 行（`key` / 名称 / 链接文字）—— ⚠️ **名称统一「首字母大写」（2026-09-23 21:5x 用户定）**：
  | `data-doc-link` | 名称 | 文字 |
  |---|---|---|
  | `hmi-manual` | HMI Manual | Download |
  | `datasheet` | **Datasheet** | Download |
  | `catalog` | **Catalog** | Download |
  | `device-manual` | Device Manual | Download |
  | `installation-video` | Installation and Commission | **Watch** |
  ⚠️ **`data-doc-link` 的值一律保持小写**（`datasheet` / `catalog`），只有**显示名称**改title case —— 钩子是给 JS/替换脚本用的，别跟着一起改。另：卡片上方定义区标签经 CSS `uppercase` 显示为 `PRODUCT` / `VOLTAGE LEVEL`，与这 5 行的大小写风格**是两套**，不要「顺手统一」。
- ✅ **URL 到位后的替换口径（2026-09-29 起沿用，别再自创）**：`href="#" data-doc-link="X" data-link-pending class="..."` → `<a href="<真实URL>" data-doc-link="X" target="_blank" rel="noopener" class="...">`，**删掉 `data-link-pending`**，其余属性一律不动。（`target="_blank" rel="noopener"` 与同卡其它 PDF 链接同款，GA4 自动追踪 PDF 下载。）
- 📌 **5 行链接当前状态（2026-10-08 复核）**：`hmi-manual` / `datasheet` / `catalog` 已全站接真实 PDF；`installation-video` 已改不可点灰字 `<span>Watch</span>`（有视频再换回链接）；**`device-manual` 是唯一还剩占位的** —— 24 个详情页里 23 个有该行（legacy `active-harmonic-filter.astro` 无），**已接 6 个 / 仍 `#` 17 个**：
  - 已接：`sic-ultra-{ahf,svg,asvg}` → `sic-module-user-manual-en.pdf`；`anti-pollution-{ahf,svg,asvg}` → `high-protection-series-user-manual-en.pdf`。
  - 仍 `#`：AHF 的 distributed / ip65 / ip65-sic-fanless / sic-fanless / ultra-slim；SVG、ASVG 各 6 个（含 `anti-pollution-hv-svg` / `anti-pollution-hv-asvg`）。
  - ⚠️ 列表页（三张 `products*.astro`）卡片另有 8 个 `<a href="#" class="cbp-dl-btn">Device Manual</a>`，**只有 sic-ultra 卡已接**，其余 7 个仍 `#`。
- 📌 **同一份手册跨多族共用时按「系列」命名**，不按产品 slug：`sic-module-user-manual-en.pdf`（SiC 模块手册）、`high-protection-series-user-manual-en.pdf`（High Protection Series, APF/SVG/ASVG, 50 页）。
- 1440 实测几何：左栏 `left=164 w=590`（H1 与 configurator 同栏）；右栏 `left=810 w=590`（gallery 与 Resources 同栏）；Resources `top 703 ≥` gallery `bottom 674`。
- ✅ **右缘共线实测（2026-09-23 21:4x）**：`Product` 值、`Voltage level` 值、5 个 `Download`/`Watch` 链接的 `right` **全部 = 1379**（卡片 `right=1400` − `px-5` 20px = 1380，1px 为亚像素）→ **spread = 0.0px**，1440 / 768 / 390 三档均为 0。验证脚本 `00_中转站\verify_res_right_col.py`（18/18 PASS）。
- ✅ **2026-09-24 已移植到全部 6 个其它模板页**（用户指令）—— 先做样板 `ip65-ahf`（139/139），确认口径后一次铺完其余 5 页，**6 页 × 3 视口 = 888/888 PASS** + 源码级 132/132 PASS。见下方「7 页复用」章节。5 个链接仍是 `href="#"` 占位，**等用户给 PDF / 视频地址**。
- 施工脚本 `00_中转站\move_cfg_add_resources.py` → 值右移 `00_中转站\patch_resources_right_col.py`；验证 `00_中转站\verify_moved_cfg.py`（20/20 PASS）+ `verify_res_right_col.py`（18/18 PASS）；备份 `F:\trash\20260923-213928_move-cfg-add-resources\`、`F:\trash\20260923-214854_resources-right-col\`。
- 💡 **交互测试注意**：选项 `input` 是 `sr-only`，**必须点外层 `<label>`**（`label:has([data-group="v"][data-val="208V"])`），点 input 会被 label 拦截超时。且 **HTML 里没有 `checked`** —— 初始 SKU 来自页面 JS 默认值（100A/400V/Rack/IP20），别断言成占位符 `—`。

- 顶部右侧 3 图轮播（**2026-09-23 起被裹在右栏一层裸 `div` 里**，configurator 是它的兄弟节点）：保持外层 grid `items-start` + 主图 `max-h-[400px]`，**不要 `items-stretch`/`lg:h-full`**（两栏互相撑高）。图卡自身内边距固定 `px-6 pb-6 pt-2`，⚠️ `pt-2` 别写回 `p-6`（会让产品图比左侧 H1 低 25px）。

## 7 页复用：sic-ultra 结构 → 其它 AHF 详情页（2026-09-24）

**用户指令**（2026-09-24）：「其它 AHF 的英文详情页也全部复用本页的内容结构，只修改产品名，参数参考已有的表，没有的话照搬该页面」。
**口径**（AskUserQuestion 逐条确认）：WHY 区照搬 4 卡只换产品名 · Application 照搬 3 例只换标题产品名 · **先做 1 页样板**、确认后再铺开 · 产品名「和卡片一致」= 列表页 `/en/products` 卡片 `h3.h4 > a` 的文本。

**范围**：英文 AHF 详情页共 8 个 = legacy `active-harmonic-filter`（**跳过**，另一套 12-section 结构、无 configurator/gallery/证书钩子）+ **7 个模板页**（源 `sic-ultra-ahf` + 6 个目标）。

**要复用的 7 项结构**（sic-ultra 有 / 其它 6 页都没有）：
1. **nav 桌面 + 手机 各 5 → 7 项**（`Manufacturing & QA` 插在 Why CHITEK 后、`Application` 插在 FAQ 后）—— **两处镜像必须同改**，书写顺序 = 锚点 DOM 顺序
2. **configurator 卡 右栏 → 左栏**（**只改缩进 −2，卡片本体一字不动**）
3. **汇总条**：`textarea` → `input[type=hidden][data-inquiry-summary][name=message]` + `p[data-summary-view]`（分段着色），**删 `Download` 按钮 + 其 download handler**
4. 右栏新增 **Resources 卡**（`Product` / `Voltage level` 两行 + 4×Download + 1×Watch）
5. **WHY H2 改名 + WHY 4 卡**（Easy to install and commission〔含 Hardware / Software 子段〕/ Potting Protection / Smart Sleep Mode / Resonance suppression；**卡 1、卡 4 带 `sm:col-span-2`**）
6. `#why` 内新增 **Manufacturing & QA 块**：`<div id="manufacturing" class="mt-8 scroll-mt-[120px]">` + h3 + 引言 + **4 卡**（`h4`），位置 = **WHY 4 卡之后 / Certifications 之前**
7. `#faq` 后新增独立 **`#application` section**：`bg-white`（刻意隔开两侧 `#fafbfc`）、`scroll-mt-[120px]`、H2 + `data-application-slot` 内 **3 张 `<article>`** 案例卡（kicker / h3 / 描述 / 橙色结果行 / 底部 Read 长锚 → `lp('/')`）

**❌ 不动的（各页自己的参数与文案）**：顶部 9 行块、Technical Parameters 表（各页 **17 行**）、H1、tags、Product Description 6 卡、FAQ 正文、Related Products、Certifications 与证书图。

**移植参数表**（`Voltage level` 取各页**顶部 9 行块**的 `Rated Voltage`；**6 页已全部落盘**）：
| 页 | Resources `Product` 值 | `Voltage level` | SKU 前缀 | WHY H2 现状 |
|---|---|---|---|---|
| **ip65-ahf** ✅ | IP65 Active Harmonic Filter | 208/400/480 VAC | `IP65_AHF_` | 通用名 |
| **distributed-ahf** ✅ | Distributed Active Harmonic Filter AHF | 208/400/480 VAC | `DISTRIBUTED_AHF_` | 通用名 |
| **ultra-slim-ahf** ✅ | Ultra-slim Active Harmonic Filter AHF | 208/400/480 VAC | `ULTRA_SLIM_AHF_` | 通用名 |
| **sic-fanless-ahf** ✅ | SiC-Fanless & Low Noise Active Harmonic Filter | 208/400/480 VAC | `SIC_FANLESS_AHF_` | 已带具体名 |
| **ip65-sic-fanless-ahf** ✅ | IP65 SiC-Fanless & Low Noise Active Harmonic Filter | **400/480/690 VAC** | `IP65_SIC_FANLESS_AHF_` | 已带具体名 |
| **anti-pollution-ahf** ✅ | Anti-Pollution Active Harmonic Filter AHF | **208/400/480/690/800 VAC** | `ANTI_POLLUTION_AHF_` | 通用名 |

⚠️ **WHY H2 改名分两种情况**：3 页原为通用名 `WHY CHITEK Active Harmonic Filter?`（整串替换）；2 页已带具体名（`&amp;` 实体写法）→ 移植脚本的 `why_old` 参数**直接传该页 H2 现状全文**，`replace` 退化为 no-op，**不做分支**。传参错 → 断言 `WHY H2 唯一` 直接拦下、不写文件。
⚠️ **`anti-pollution-ahf` 的卡片标题带电压前缀**（`208V/400V/480V …` / `690V/800V …` 两条卡指向同一页）→ 产品名取**页面自身名（去电压前缀）**，与 H1 / breadcrumb 一致。**已按此处理，待用户确认**。

**施工方式**：`00_中转站\port_sicultra_structure.py` —— **从 sic-ultra 现场提取模板块**（`_blocks/` 目录留档，不手工抄），按页参数化移植；带 **`DRY=1` 干跑开关**（只导出不写原文件，且跳过备份）。**每页 44 条断言**，任一不过即 `return`、**不写原文件**。
- 验证 1（渲染）：`00_中转站\verify_port_pages.py` —— 6 页 × 1440/768/390，**888/888 PASS**。
- 验证 2（源码）：`00_中转站\verify_5pages_src.py` —— 对**移植前备份**做「不该动区域」逐字节 + 行级清单比对，**132/132 PASS**。
- 备份：`F:\trash\20260924-0922xx_port-ip65-ahf\`（样板）与 `F:\trash\20260924-094130_port-<page>\`（其余 5 页）。
- ⚠️⚠️ **移植脚本的头号坑：「先做改变长度的替换、后用先前算好的坐标」**。实测：先 `replace` 右栏注释（长度 −25），**之后**才用先前算的 `c0/c1` 去切 configurator 卡 → 坐标整体前移 25，`c0` 落到注释行中间，**把左栏的 `</div>` 一起吃掉了**（症状：`<div>` 87:86 不平衡、两段注释被拼成同一行 `<!-- Configu          <!-- Resources:`）。
  → **规则：同一函数里，凡「先算坐标、后改字符串」，中间不得夹任何改变长度的操作**；要么把改长度的替换提到坐标计算之前，要么改完立即重算坐标。已写进 `safe-source-patch` 技能 #10。
- ⚠️⚠️ **回归比对的坑：不要用「锚点 A → 锚点 B」切区域去证「这段没变」**。实测：`<!-- LEFT: title…` → `<!-- Configurator: SKU selector card` 这段在本轮**被搬动过**（移植前 configurator 在右栏、位于 gallery 之后），旧版区域于是**横跨整个 gallery**（旧 4226 字符 / 新 2208 字符）→ 假报 FAIL 5 次。
  → **规则：证「未变」优先用「行级清单」**（按特征串抽整行、比对两个列表，如 `9 行规格` / `顶部 tag 链接 6 条` / `gallery 缩略图 4 行` / `参数表 <tr> = 17`）；区域逐字节比对只用在**锚点两侧结构化、位置固定**的地方（如整个 `<section id="X">` 到它自己的 `</section>`）。
- 📌 **本轮顺带修掉 2 个页面的既有缺陷**：`sic-fanless-ahf` / `ip65-sic-fanless-ahf` 的 **JSON-LD FAQ 里写着 `the SiC Ultra AHF`**（从 sic-ultra 抄来没改名，各 1 处；可见 FAQ 正文无此污染）→ 已改为各页自己的产品名。是移植脚本的 `残留 SiC Ultra AHF == 0` 断言**抓出来的**。

## SKU
- 串：`SKU: {PREFIX}{a}-{v}-{i} · 500 × 550 × {d} mm · {kg} kg · 1300$(EXW)`（`1300$` 是固定后缀，照抄）。
- ⚠️⚠️ **`{PREFIX}` 每页不同，绝对别写死 `CHITEK-SiC-AHF-`**（2026-09-23 踩过：卡片头部 chip 硬编码该前缀 → **6 个页面显示错料号**，只有 sic-ultra 恰好对）。实测：
  | 页面 | SKU 前缀 |
  |---|---|
  | sic-ultra-ahf | `CHITEK-SiC-AHF-`（连字符） |
  | anti-pollution-ahf | `ANTI_POLLUTION_AHF_` |
  | distributed-ahf | `DISTRIBUTED_AHF_` |
  | ip65-ahf | `IP65_AHF_` |
  | ip65-sic-fanless-ahf | `IP65_SIC_FANLESS_AHF_` |
  | sic-fanless-ahf | `SIC_FANLESS_AHF_` |
  | ultra-slim-ahf | `ULTRA_SLIM_AHF_`（后 6 个用下划线） |
  → **卡片 chip 不要自己拼前缀，直接从 SKU 串取第一段**（一劳永逸）：
  `if (chip) chip.textContent = sku.replace(/^SKU:\s*/, '').split('\u00b7')[0].trim();`
- `SPECS` / `DEF` **随页**（不是全局常量）：sic-ultra `{50A:{d:150,kg:21},75A:{142,24},100A:{135,27},150A:{100,31},200A:{118,38},Unlimited:{135,27}}`、`DEF={v:'400V',a:'100A',i:'Rack'}`；
  ultra-slim `DEF.a='8A'`、ip65-sic-fanless `DEF.a='20A'`。`SPECS[a]` 缺失时有兜底 `|| {d:135,kg:27}`。
- ⚠️ `build()` 必须在脚本末尾额外裸调一次。
- **汇总条 textarea 自适应高度**：只读 textarea 放长 SKU 串会被截 → `build()` 里补
  `if (b.tagName === 'TEXTAREA') { b.style.height = 'auto'; b.style.height = b.scrollHeight + 'px'; }`。

## SVG 列表页 `en/products-svg.astro`
- = `en/products.astro` 的 SVG 版：同 hero（canvas 波浪）/ 面包屑 / 左栏 / 网格↔列表 / 筛选 JS。路由 `/en/products-svg`。
- ✅ **2026-09-24 09:5x 起 8 张卡**（与 AHF 页**完全同构**：`data-v/a/s/i/t` 逐张相同、filter 面板逐字节相同、(N) 同值），**只有产品名 / alt / tags 是 SVG 版文案**、卡片 href 仍是 `#`。
- **图沿用 AHF 的 `products-ahf-*.webp`**（用户明示「图一样」）→ 换真图只改 8 张卡各自的 1 处 `img src`。
- 卡片与 View More 的 href **目前仍是 `#`**（SVG 详情页未建）。将来做 slug 建议 `products-svg/<name>`。
- 生成方式：脚本取 `en/products.astro` **前 440 行**做底再替换。441 行以后是死代码（sticky tab / `renderMatrix` / FAQ / 四系列轮播），**故意不复制** → 新页零 JS 报错（对照见文末待决缺陷）。
- `decorIn` keyframes **必须带上**（hero 菱形靠它显形，各 products 页自定义，global.css 没有）；`hero-fade` 是全站无定义的死类（无害）。
- 互链：AHF 侧栏 → `lp('/products-svg')`；SVG 侧栏 → `lp('/products')`。
- `Nav.astro` 里 `productsSvgHref = lang==='en' ? prefix+'/products-svg' : productsHref+'#svg'`，5 处引用。**只 en 走新页**（zh/es/ar/pt 的 `#svg` 锚点是 AHF↔SVG 唯一切换入口，改掉会 404）。⚠️ 批量替换这段时先换引用再插定义（helper 定义行本身含 fallback 串）。

## ASVG 列表页 `en/products-asvg.astro`
- 从 `products-svg.astro` 克隆而来（2026-09-22），**7 张卡**，路由 `/en/products-asvg`。卡片 href 仍是 `#`（无 ASVG 详情页）。
- **2026-09-23 已与 `en/products.astro` 做同款结构处理**（脚本 `00_中转站\sync_asvg_structure.py`）：
  ① 删左侧 `Product Categories`（`div.left_nav`）；
  ② Filter 加 **Technology 组**（`data-filter="t"`，卡 `data-t` = `SiC,IGBT,IGBT,IGBT,SiC,IGBT,SiC`），JS 升到 5 组并补上 `cb.value.split('|')` 收值；
  ③ `Category intro` 移到卡片下方（`mb-6` → `mt-10`），视图切换留在上方。
  → 当前 **17 个勾选项、0 死档**；勾 SiC→3 张、IGBT→4 张。
- ✅ **2026-09-24 09:5x 内容层面也已对齐（原三条待办作废）**：filter 面板整体照抄 `en/products.astro`、8 张卡 `data-*` 逐张对齐 →
  ① IP 面板改 3 档合并写法（`IP30|IP40` = other/negotiable、`IP20(standard)`）；② IP65 卡 `data-i` 收敛；③ `IP65 ASVG` 电压 `208V,400V,480V`；④ Dimensions 升到 AHF 的 7 档。
  - （原待办：IP 面板 4 独立档 / IP65 卡带 `IP30` / #6 电压 `400V,480V` / Dimensions 只 3 档 —— 均已解决。）

## 三张列表页的结构状态 & 通用脚本（2026-09-23）
- `en/products.astro`(AHF) / `en/products-svg.astro`(SVG) / `en/products-asvg.astro`(ASVG)
  ✅ **2026-09-24 起三页完全同构：同为 8 张卡、filter 面板逐字节相同、(N) 计数同值**（AHF 是基准页，另两页由 `00_中转站\port_filter_to_svg_asvg.py` 同步）。
  侧栏 = Filter + Contact Us + **Company 卡** + **交叉推荐 3 卡（均为 2026-09-24 新增）**／Filter = Technology+Voltage+Current+IP+Dimensions／
  右栏顺序 = 视图切换 → 卡片 → intro 文字块。
  ⚠️ **仅 AHF 页在 intro 之后还有 3 段**（2026-09-24 依次新增）：**Benefits（6 条 bullet）→ Application（4 栏图标）→ Working Principle（正文 + 图片占位符）**，详见文末「汇总页」节。三页结构同构的说法**不覆盖这 3 段**。
  侧栏宽 **340px**、底部询盘 textarea **rows=2**（实测高 65px）、20 个选项各带 `<span data-count>(N)</span>`。
- **顶部视图切换旁 = 3 个「系列跳转」按钮（2026-09-24 11:4x 新增，三页同改）**：
  位置 = `.cbp-vm-options` 内、两个宫格/列表图标按钮**之后**，被 `<nav class="ml-2 flex items-center gap-2 flex-wrap" aria-label="Product series">` 包住：
  `Active Harmonic Filter` → `lp('/products')`、`Static Var Generator` → `lp('/products-svg')`、`Advanced Static Var Generator` → `lp('/products-asvg')`。
  - 样式 `.cbp-vm-tab`：**`height:38px`**（= 图标按钮实测高 38px，满足"等高"）/ `padding:0 14px` / `border:1px solid #e5e7eb` / `border-radius:8px` / `13px 600` / `inline-flex` / `white-space:nowrap` / 无阴影。
    hover = `#fb923c` 边 + `#ea580c` 字 + `#fff7ed` 底；**当前页** = `cbp-vm-tab-active` + `aria-current="page"`（`#fff7ed` 底 + `#f97316` 边 + `#ea580c` 字）。
  - ⚠️ **必须包 `<nav>` —— 否则点击不跳转**：视图切换 JS 用 `container.parentNode.querySelectorAll('.cbp-vm-options > a')`（**无空值/类型守卫**）给所有直接子级 `<a>` 挂 `preventDefault()`，
    新 tab 若直接挂在 `.cbp-vm-options` 下会被一起拦掉（`verify_series_tabs.py` 首跑 30/36 抓出来的真 bug）。
    **一句话规则：往 `.cbp-vm-options` 里加任何链接，都要包一层容器隔开，或先给那段 JS 选择器加限定。**
  - 脚本 `00_中转站\add_series_tabs.py`（+14 行/页：HTML 4 + CSS 10）+ `00_中转站\wrap_tabs_in_nav.py`（+2 行/页）；验证 `00_中转站\verify_series_tabs.py` **36/36 PASS**。
  - ⚠️ 写防重复检查别用 `'<nav' in raw`（页面本来就有面包屑 `<nav>`，会误判"已跑过"）→ 查专属标记 `'aria-label="Product series"'`。
- **通用脚本（改任一列表页都用这两个，路径作参数，幂等可重复跑）**：
  - `00_中转站\sync_list_page_structure.py <文件绝对路径>` —— 删目录区 + 加 Technology 组 + intro 下移；`data-t` **自动按卡名含 `SiC` 判定**。
  - `00_中转站\check_list_page.py <url> <期望卡片数>` —— 死档检查 + Playwright 真点筛选 + intro 位置 + JS 报错 + 截图。
  - `00_中转站\gen_3pages_cards.py` —— 三页卡片参数并排对照（**按型号关键词匹配，不可按序号**）。
- ✅ **2026-09-24：SVG/ASVG 也已 8 卡** —— 把 Anti-Pollution 按电压拆成 `208V/400V/480V` + `690V/800V` 两张；第二张由第一张派生（换图 `products-ahf-anti-pollution-690v-800v.webp`、h3/alt 前缀改 `690V/800V`、tags 前两条改 `690V/800V Anti-Pollution X` / `High-Voltage Anti-Pollution X` + 第一张的 2~7 条）→ **与 AHF 页同构**。
  → 旧说法「AHF 8 卡 vs SVG/ASVG 7 卡、anti-pollution 要按并集处理」**已作废**。
- ⚠️ 仍成立：跨页对齐**不能按下标推产品名**，必须按**图片文件名 / 型号关键词**（三页的名称是 AHF·SVG·ASVG 三套文案，但 `data-*` 参数是同一套）。
- **口径同步脚本 `00_中转站\port_filter_to_svg_asvg.py`**（带 `DRY=1`，改完先干跑；DRY 会导出 `_preview_*.txt` 供肉眼核对新卡）。
  做法 = ① 按 div 平衡切出 AHF 的 `filter_card` 整块直接替换；② 按图片文件名把 AHF 8 张卡的 `data-*` 行逐张套到目标页自身的 li 上；③ 把 AHF 的 `matchOthers` 动态计数块插进目标页 `apply()`。**不动目标页的产品名/alt/tags/href（仍是 `#`）**。
- ⚠️ 跑 Playwright 时 **PowerShell 直接带数字参数会被安全策略拦**（`Command blocked: Encoded commands…`）→ 写 `.ps1` 再用 pwsh 7.6.3 `-File` 执行。

## 详情页 ↔ 汇总页卡片
- ⚠️ **卡片清单会频繁变动，本文件不再维护卡表快照**（2026-09-22 一天内 9→7→8 张）。要看当前「卡名 ↔ slug ↔ data-v/a/s/i/t ↔ 图 ↔ tag ↔ 筛选项命中」一律**现跑**：
  `python C:\Users\lenovo\WorkBuddy\00_中转站\gen_products_matrix.py` → 产出 `CHITEK-en-products-matrix.html/.md`（同目录）。
  - 脚本**自动从筛选面板发现筛选组**（按组小标题切段），加/删筛选组**不用改脚本**；表一有 Technology 列；第六节自动做一致性校验（卡值无筛选项 / 筛选项 0 命中 / 详情页缺失 / 详情页 v=并集、a 落在范围内 / SPECS 缺键）。**改完产品页跑一次即可同时拿到最新对照表 + 校验结论。**
- `src/pages/en/products/` 下**现存 8 个** `.astro`（`rack-mounted-ahf`、`advanced-ahf` 的详情页已随列表页删卡一并删除，全站已无引用）。**多对一 2 例**：`anti-pollution-ahf` 被「208/400/480V」与「690/800V」两张卡共用；`sic-fanless-ahf` 被「SiC-Fanless」与「IP65 SiC-Fanless」两张卡共用（2026-09-22 用户定，`ip65-sic-fanless-ahf` 自此从列表页不可达，但 6 个子详情页的相关产品区仍链它）。**孤儿页 2 个**：`ip65-sic-fanless-ahf`、`active-harmonic-filter`（后者是历史旧结构页，本来就没卡片链）。
- 9 个详情页**同一模板**（~710 行，17 个功能块全齐：4 锚点分节 / configurator / 询盘 form / related 轮播 / scroll spy / mobile nav / 3 个 JSON-LD / `alternates={false}`），差异只在名称、title/描述、hero 图、参数值、FAQ。`<title>` 格式 `X | Active Harmonic Filter | CHITEK`。
- ⚠️ **克隆陷阱**：整文件全局替换 slug 会把 related 首卡 href 也换成自己（应改 kept 的本页）→ **必须先切出 `data-rel-track … data-rel-next` 片段再替换**，勿全局 replace。
- 遗留旧页 `active-harmonic-filter.astro`（另一套结构，12 个 h2 + chips，无 configurator/询盘/related）**不被任何卡链接**，别当模板。

## 详情页 configurator（`data-group` 四组）
- **五组（2026-09-23 18:0x 起，原为四组）**：`v` = Voltage（如 `208V`）／**`p` = Protection Rate（`IP20`/`IP65`/`other`）**／`a` = 电流模块档（如 `50A`/`APF 8A`）／`c` = 接线（`3P3W`/`3P4W`）／`i` = 安装方式（`Wall`/`Rack`）。
  ⚠️ **`i` 不是 IP 档**；IP 现在是独立的 `p` 组（原来「详情页没有 IP 选择器」的说法已作废）。
- **一对一页面必须与列表卡对齐**：`v` 集合 = 卡 `data-v` 集合；`a` 的数值必须落在卡 `data-a` 的范围内（卡写范围 `50~200A`，页写具体模块 `50A/75A/100A/150A/200A`）。
  - 2026-09-22 已对齐：`sic-ultra-ahf`（删 690V）、`ultra-slim-ahf`（`400VAC` → `400V`）、`ip65-ahf`（v 改 208/400/480V；a 由 `8A/20A` 改为 `50~200A` 那套，`DEF.a` 20A → 100A）、`distributed-ahf`（本来就对）。
- ⚠️ 改 `a` 组必须同步 JS 里的 `SPECS` 与 `DEF`：`DEF.a` 必须**存在于 `SPECS` 的键**里，否则 SKU 反查 `undefined`（`ip65-ahf` 曾 `DEF.a='20A'` 而 SPECS 只有 50~200A 键 = 隐性 bug，已修）。
- **共用页（一页对多卡）的选项 = 相关卡参数的「并集」**（用户 2026-09-22 定的规则）：
  - Voltage：页面 v 选项集合 = 所有指向该页的卡片 `data-v` 的并集。例：`anti-pollution-ahf` = 卡2(208/400/480V) ∪ 卡3(690/800V) → **5 档 208/400/480/690/800V**；`sic-fanless-ahf` = 卡6 ∪ 卡8(同) → 208/400/480V。
  - Current：页面 a 档的数值必须全部落在相关卡电流并集范围内（`sic-fanless-ahf` 卡6/8 都是 30~50A → 页 a 改 `30A`/`50A`）。
- ⚠️ **改 a 组必须同步 `SPECS`**：每个 a 选项值 + `DEF.a` 都必须是 `SPECS` 的键，否则 SKU 反查 `undefined`。2026-09-22 实测 `distributed-ahf` 有 `30A` 选项但 SPECS 缺 30A 键（既有 bug，已补）。**新增电流档 = 必须同时补 SPECS 条目**（`{ d: 尺寸mm, kg: 重量 }`）。
  - 📌 `distributed-ahf` / `sic-fanless-ahf` 的 `30A` 条目暂用 50A 的数值**占位**（代码里标了 `// TODO`），等真实尺寸/重量数据替换。
- 孤儿页（无卡片指向）不参与校验：`active-harmonic-filter`（历史旧页）、`ip65-sic-fanless-ahf`（2026-09-22 被合并后失去入口，参数仍是旧的 400/480/690V + 8A/20A）。
  - ✅ **2026-09-23 用户裁决：保持两卡共用、不改链、不删页**（原话口径「共用详情页的先别处理」）。**别再提议把卡 6「IP65 SiC-Fanless」改链到 `ip65-sic-fanless-ahf`** —— 我曾按「卡片要和自己详情页一致」改过又撤回，属于推翻用户既有裁定的错误动作。
- 🐞 **改选项的血案（2026-09-22）**：`sic-ultra-ahf` 的 4 个电压 label 写在**同一行**（`</label>` 与下一个 `<label` 之间只有空格）→ 按「行」替换 + `re.sub` 无 count 会让整行 4 个 label 全变成同一个值（变成 4 个 208V）。**正解：按单个 label 串（`<label … data-val="X" …/> X</label>`）定位删除/替换，不要按行。**

## 汇总页 `en/products.astro`
- **顶部 hero 区域已删（2026-09-24，用户要求）**：整段 `<section id="hero">`（18 行，含 hero-canvas / `Excellent Products` 标题 / 副标题 / 装饰线 / `products-hero-bg.webp` 背景）
  + **配套删掉 hero 波形 canvas 的 JS（70 行）** —— ⚠️ 那段 `document.getElementById('hero-canvas')` 后面**紧接着 `.getContext('2d')`，没有空值守卫**，
  只删 HTML 不删 JS 会直接 `TypeError`（对比：紧邻的 `vp-canvas` 段是有 `if (vpCanvas)` 守卫的，可以留）。
  - 删后 `#product-series` 成为页面首元素 → **必须补 `mt-[72px]`**（`mt-` 不是 `pt-`）。
    ✅ **2026-09-24 09:45 用户要求「面包屑离上边沿近些」→ `pt-12` 改 `pt-6`（48 → 24px）**：
    现 `#product-series` top = 72、**面包屑 top = 96**（原 120）→ 仍不被 fixed 导航遮挡，下面筛选区整体上移 24px。
    ✅ **2026-09-24 14:2x：`products-svg` / `products-asvg` 也照此办理（三页头部现已完全同构）** —— 见本节末尾「三张列表页头部同构」。
    ⚠️ **仍不一致的是详情页与四语页**：详情页面包屑是**独立全宽 nav**（`mt-72` + `py-3`，top = 84）；zh/es/ar/pt 的列表页仍有 hero、亦未动。
  - ⚠️ **h1 会随之消失**：原页面唯一的 h1 就是 hero 里的「Excellent Products」→ 已把页面唯一的 h2
    「Active Harmonic Filter (AHF) Series」**升级为 h1**（class 一字未动，视觉零变化）。
    现状：**h1 ×1 / h2 ×3 / h3 ×11**。✅ 2026-09-24 依次新增 `Benefits…` / `Application…` / `Working Principle…` 三条 `<h2>` 后，
    h1→h3 跳级已补上（三条都在卡片之后，语义上就是 section 标题）。原备选（① 保留现状 / ② 另做关键词 H1 横条 / ③ 卡片标题降到 h4）**已无必要**。
    ⚠️ 三条 h2 的 class 必须**保持完全一致**（同为 `text-[clamp(20px,2.2vw,32px)] font-bold text-gray-900 mb-5 font-barlow-condensed`）——实测 fs 31.68px / fw 700 / mb 20px / x=401 三者全同。
- **`<title>` = `Active harmonic filter professional manufacturer,China factory-CHITEK`（2026-09-24，用户逐字给定）**：
  改的是 frontmatter `meta.title`，`BaseLayout` 是 `<title>{title}</title>` **原样输出、不加任何后缀**。
  ⚠️ 两个待确认点（已提醒用户）：① 逗号后**没有空格**（`manufacturer,China`）；② 全串 **69 字符**，Google 结果页约 60 字符起截断。
- 顶部吸附 Tab 栏 `#sticky-tab-bar` **已删（仅 en）**：连同末尾 `===== Sticky Tab Bar =====` 的 scroll 监听一起删（那段无空值守卫，只删 HTML 会 `TypeError`）。en 页没有 `.tab-panel` 实体，该栏纯装饰；**zh/es/ar/pt 有 10 个 `.tab-panel`，那根栏是唯一切换入口** → 别帮它们删。
- 侧栏（`aside.n_left`）**4 块**（2026-09-24 起）：Filter（内含询盘 textarea + `Inquire Now`）/ Contact Us（只剩 WhatsApp + 邮箱）/ **Company 卡** / **交叉推荐 3 卡**。
  - **交叉推荐 3 卡（2026-09-24 新增，三张列表页同加，但各页内容不同）** —— 就是「本页推对面系列」：
    | 页面 | 卡内容 | 整卡 href |
    |---|---|---|
    | `/en/products`（AHF 页） | 3 张 **SVG** 卡 | `lp('/products-svg')` |
    | `/en/products-svg` | 3 张 **AHF** 卡 | `lp('/products')` |
    | `/en/products-asvg` | 3 张 **AHF** 卡 | `lp('/products')` |
    ⚠️ **「另两页放 AHF 卡」是用户 2026-09-24 的原话口径**（不是对称设计：ASVG 页也放 AHF 卡，不是 SVG 卡）。
    - 三个产品（**图沿用同一批 `products-ahf-*.webp`，两套命名只换系列后缀**）：
      `products-ahf-sic.webp` ↔ SiC SVG / SiC AHF；`products-ahf-ultra-slim.webp` ↔ Ultra-slim SVG / Ultra-slim AHF；
      `products-ahf-ip65-fanless.webp` ↔ IP65 SiC-Fanless & Low Noise SVG / …AHF。
    - 结构：`<a href={lp('…')} class="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:border-orange-300 hover:bg-orange-50 transition-colors">`
      \+ `img.w-20.h-20.object-contain`（**80×80** 缩略图）+ `span.text-[14px].font-semibold`。**三张独立卡片**，无区块标题。
      ⚠️ **产品名里的 `&` 源码写 `&amp;`**（渲染后解码成 `&` → Playwright 断言 `textContent` 必须用解码后的 `&`，别拿源码形式比）。
      ⚠️ **2026-09-24 13:13 用户要求「三张卡片高度增大些」** → 由 `p-3` + `w-14 h-14` + `text-[13px]`（实测高 **82px**）
      改为 **`p-4` + `w-20 h-20` + `text-[14px]`**（实测高 **114px** = 80 图 + 2×16 内边距 + 2×1 边框，+32px / +39%）。
      ⚠️ **替换必须「先切交叉推荐块、再在块内替换」**：页面别处有 `p-3`（filter 的 textarea）与 `text-[13px]`（filter 标签 ×28~29）
      等同名串，全文件 replace 会误伤 → 脚本里用「块外同名串计数不变」做防误伤断言。
    - 实测（1440，AHF 页；**高 114px 为 13:13 加高后的值**）：三张竖排不重叠、左边缘全 29、在 company 卡下方、缩略图 80×80、图 `naturalWidth=1200` 真实加载。
    - **真实点击跳转已验**（`pg.click('aside a:has(img.w-14)')` → URL 变 `/en/products-svg`）。注意这三张卡在 `<aside>` 内、**不在 `.cbp-vm-options` 下**，所以不会踩那条「直接子级 `<a>` 被 preventDefault」的坑。
    - 脚本 `00_中转站\add_cross_series_cards.py`（DRY 开关；每页 18 条断言：锚点唯一 / 行数 +13 / **字节 +1674** / div 数不变 / `<a>`+3 / 位置 company 之后 / 头部 8000 字节未变 / 反向还原）；
      验证 `00_中转站\verify_cross_cards.py` → **198/198 PASS**（3 页 × 5 断点 + 1440 真实点击）。
    - 📌 **巧合记录**：SVG 版与 AHF 版的 NEW 块**恰好同为 1674 字节** —— SVG 页 `href` 长 4×3=+12、卡名短 12×2=−12（`alt`+文本各一次），正好抵消。**不是 bug，别去"修"这个相等。**
  - **Company 卡（2026-09-24 新增，三张列表页同加）**：`<div class="company_card bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">`
    = **通栏图片 + 下方公司简介**，插在 `contact_card` 的 `</div>` 之后、`</aside>` 之前。
    - 图 = **About 页 hero 背景图 `/assets/images/about-bg.webp`**（1155×770，比例恰 1.5）→ `class="w-full aspect-[3/2] object-cover"`，**不裁不拉**（3:2 == 源图比例）。
    - 文 = **About 页官方简介原文**（`about.astro`「ABOUT CHITEK」那段，281 字符）—— **照抄站内文案，不新编事实**。
    - 实测（1440）：卡片 340×394、`radius 12px`；图 338×225（= 340−2×1px 边框，通栏贴边框内侧，`ratio 1.502`）；
      文字 298px 宽、左缩进 = 1px 边框 + `p-5` 20px = **21px**；图 `bottom` 1330 < 文字 `top` 1350（间隔 = 20px 内边距）；
      卡 `top` 1104 = `contact_card.bottom` 1080 + 24px（`mb-6`）。
    - ⚠️ **本卡至今无链接**（用户未要求）。要整卡链到 `/about`，把外层 `div` 换 `a href={lp('/about')}` 即可。
    - 脚本 `00_中转站\add_company_card.py`（DRY 开关；每页 16 条断言：锚点唯一 / 行数 +7 / 字节 +763 / div 各 +2 / 位置在 contact 之后 aside 之内 / 头部 8000 字节未变 / 反向还原）；
      验证 `00_中转站\verify_company_card.py` → **270/270 PASS**（3 页 × 1440/1280/1024/768/390）。
    - ⚠️ **写这类"通栏图 + 内缩文字"的几何断言，必须把 1px 边框算进去**：图是 `card.left + borderLeft`，文字是 `+ borderLeft + paddingLeft`。
      我第一版按「图左 == 文左」断言 → 45 条假 FAIL（2026-09-24 实测）。**凡比矩形，先问「有没有边框/内边距在中间」。**
  - **侧栏宽 `lg:w-[340px]`（2026-09-24 由 280px 加宽）**，原因 = 每个多选后面要挂 `(N)` 型号数。
    实测口径：标签列 2 栏时每栏 146px，最长文案 `other/negotiable (6)` 内容宽约 139px → **340px 刚好，320px 会折行**。
    右栏（`flex-1 min-w-0`）实测：1440 → 924 ｜1280 → 780 ｜1024 → 550。⚠️ **1024 时卡片只剩 107px**（加宽前 127px），
    如需在 1024–1100 区间回一点宽度，可改 `lg:w-[320px] xl:w-[340px]` —— 但 320 会让上面那条最长标签折行，须先缩文案或改 1 栏。
  - **底部询盘 textarea = `rows="2"`（2026-09-24 由 rows=4 变矮）**，实测 298×65px。⚠️ 摘要有 5 组、最多 5 行，
    rows=2 时超出部分要滚动（`readonly` + `resize-none`）；如嫌挤改回 `rows="3"` 即可。
  - **`Product Categories` 目录块已于 2026-09-23 删除**（用户要求）→ 侧栏从 3 块变 2 块。删除的是整个 `<div class="left_nav ...">`，JS 侧无任何选择器引用它（已 grep 确认），删完标签平衡。
    - ⚠️ **2026-09-24 又新增 Company 卡 + 交叉推荐 3 卡 → 侧栏现为 4 块**（Filter / Contact Us / Company / 交叉推荐）。别把这里的「3 块」误读成 Product Categories 还在。
- **筛选项后的 `(N)` 型号计数（2026-09-24 新增）**：
  - HTML 侧：每个 `<label>` 末尾追加 `<span class="text-gray-400" data-count>(N)</span>`；**N 的初值由脚本按卡片 `data-*` 现算写死**
    （`00_中转站\patch_filter_panel.py`），保证无 JS 时也正确。
  - JS 侧：`apply()` 里新增 `matchOthers(card, skipGroup)` —— **本组按 OR 不参与过滤，其它组的已勾选项参与**，
    逐项算 `n` 并写回 `[data-count]`。实测默认值：`IGBT(5)/SiC(4)`、`208V(7)/690V(1)`（2026-09-24）。勾选后**本组按 OR、其它组按已勾选项**共同收缩 `(N)`。
    - ⚠️ 抓渲染 HTML 的正则**别写 `data-count>`** —— Astro 会在自定义属性后插 `data-astro-cid-*` / `data-astro-source-*`，要用 `\((\d+)\)</span>`。
- **Dimensions 第一项 = `340*410*45mm`（2026-09-24 09:50 用户要求）**，7 项现行顺序：
  `340*410*45 / 380*400*88 / 500*550*130 / 500*550*175 / 480*600*175 / 515*500*185 / 600*500*220`（mm）。
  只重排行序，`value` / `data-count` / class 一律未动；**选项顺序与过滤逻辑无关**（OR 逻辑 + JS 按元素引用重算），可随时再调。
  脚本 `00_中转站\reorder_dimensions.py`（DRY 开关；断言「label 连续 7 行、KEY 唯一、value 与 data-count 多重集不变、行数不变、孤立 LF 0」）。
- **正文下方的 4 栏应用场景区块（2026-09-24 11:2x；用户给设计稿，要求「图片要转化成内容，不是插入图片」）**：
  位置 = `<!-- Category intro -->` 的 `div.max-w-3xl`（h1 + 2 段正文）**闭合之后**、仍在 `.n_right` 内，左边缘与其对齐。
  - **标题 `<h2>Application of Active Harmonic Filter (AHF)</h2>`（2026-09-24 11:3x 用户要求补上）**，
    class 与 Working Principle 的 h2 逐字相同；实测在 4 栏之上（y=1150 < 首卡 top 1288）、在正文之下（> intro bottom 1102）。
  - `mt-12` + `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10`，栏内 `text-center`。
  - 4 栏 = `Industry` / `Commercial buildings` / `Infrastructure and utilities` / `Anyone with VFDs`，**描述文案逐字照设计稿**。
  - 图标是**手写 inline SVG**（`viewBox="0 0 72 72"`、`h-16 w-16`、`stroke-width=2`、`aria-hidden`），**零图片引用**（改前后 `products-ahf-` 图片引用都是 8 处 = 卡片各 1）：
    ① 人 + 橙箭头 + 5 孔传送带 ② 高低双楼 + 窗格 + 天线 ③ 阀门轮 + 仪表 + 横管 + 水滴 + 波浪 ④ 电机散热片 + 变频柜（屏幕 + 双按钮）。
  - 配色：图标与标题 **`#1a5f96` 蓝**（**照设计稿，不是站点品牌橙**）、Industry 那支箭头 `#f97316`、描述 `gray-600`。无卡片背景/边框/阴影/圆角。
  - ⚠️ 断点用 **`xl:` 而非 `lg:`** —— 1024 时右栏只剩 550px，4 栏会挤成 ~110px。实测：1440/1280 → 4 栏、1024/768 → 2 栏、390 → 1 栏。
  - 验证 `00_中转站\verify_ahf_segments.py`（21/21 PASS）：4 栏同行（y 全 1150、各宽 213）、新块 top 1150 > intro bottom 1102、每栏 svg 实测 64×64、文案逐字一致、无横向溢出、JS 报错 0。
- ⚠️ **本区块目前只在 AHF 页**（`products-svg` / `products-asvg` 与 zh/es/ar/pt 四语页都没有）—— 是否铺开待用户定。

### Benefits 区块（2026-09-24 11:37，排在 Application **上方**）
- 位置：`div.mt-12` + `<h2>Benefits of Active Harmonic Filter (AHF)</h2>` + `<ul class="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-gray-600 max-w-3xl">`（6 条）。
  实测：ul 的 `list-style-type = disc`、`padding-left = 20px`、宽 **768px**、x = 401（与三条 h2 / intro 对齐）。
  ⚠️ Tailwind preflight 会清掉 `ul` 默认样式，**必须显式写 `list-disc pl-5`** 才有圆点。
- **文案是洗稿的**（用户要求"描述洗稿"）：6 条全部换句式/换视角（名词短语 → 动宾句 / 主谓倒装），
  **5-gram 重合 = 0**；仅剩的重合是**不可替换的行业术语**：`electrical and process equipment`（4-gram）、`existing power grid`（3-gram）——**故意保留，SEO 需要**。
  | 原（参考图） | 洗稿后 |
  |---|---|
  | Energy savings | Save on energy costs |
  | Higher productivity | Boost overall productivity |
  | Quick return on investment | Fast payback on your investment |
  | Longer lifetime of electrical and process equipment | Electrical and process equipment keeps running longer |
  | Reliable operation at reduced maintenance costs | Reliable operation with lower maintenance spend |
  | Additional electric capacity in existing power grid | Extra usable capacity from your existing power grid |
- 验证 `00_中转站\verify_benefits_section.py`：29/29 PASS。
- ⚠️ **Probe 选择器别写 `ul:has(li)`** —— 页面上第一个 ul 是**卡片网格** `<ul class="cbp-vm-grid-ul">`（924px），会假 FAIL；
  要用 `div.mt-12:has(h2) ul` 才选中 Benefits 的列表。
- 未动：`products-svg` / `products-asvg` 与 zh/es/ar/pt 四语页。

### Working Principle 区块（2026-09-24 11:2x，接在 4 栏应用场景**之后**）
- 触发口径：用户先说「AHF Series **整段文字描述**下」放 4 栏图标（11:2x），再说「AHF Series **区域**下面」放本区块。
  ⚠️ **用词差异是刻意的**：「整段文字描述下」= 紧跟 `div.max-w-3xl`；「区域下面」= 整个区域的最末 → 本区块排在 4 栏之后。
- 结构：`div.mt-14` → `<h2>` + `div.max-w-3xl`（内含 2 段正文 + 图片占位符）。
  ✅ **2026-09-24 11:35 用户要求「图片占位符应在整段文字下方，而不是右侧」** → 原 `grid grid-cols-1 lg:grid-cols-2 items-center`（左文右图）已改为**垂直堆叠**，
  并把正文与占位符**一起收进 `max-w-3xl`**（不收的话正文会撑满右栏 924px，单行过长）。
  实测：h2 x = 401 = `Category intro` 左边缘；正文与占位符**同为 768px 宽（401 → 1169）**；最后一段 bottom = 1703 < 占位符 top = 1727（间隔 `mt-6` = 24px）。
  **所有断点均为上下堆叠**：1440 / 1280 → 768×576、1024 → 550×412、768 → 691×518、390 → 347×260。
- **文案是洗稿的，不是照抄**（用户明确要求"记得先洗稿"）。判定标准用**量化**：
  与原文的 **6-gram 重合数 = 0 / 96**（`verify_working_principle.py` 里现算）。改写手法 = 重组句子边界（原文 3 句 → 本页 2 段）、换主语与动词、
  用 em dash 承接（与站点 intro 文风一致）。**技术事实一条不删、也不新增**（原文没有的"一个周波内"这类推断一律不写）。
- **图片占位符**：`<div data-image-slot="working-principle" class="aspect-[4/3] w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center px-6 text-center">`
  + 居中灰字「Image placeholder — Working Principle diagram (1200 × 900 WEBP recommended)」。实测 442×332（ratio 0.75）、虚线 2px、圆角 12px。
  上方 HTML 注释写明替换方式。⚠️ **注释里别写真正的 `<img ...>` 字面量** —— 会污染 `grep '<img'` 的计数，写成纯文本即可。
- 验证 `00_中转站\verify_working_principle.py`：16/16 PASS。
- ⚠️ **环境噪音**：首次跑时 `document.querySelectorAll('h2')` 多返回一个 `Featured integrations`（y=0/x=0，父链不在正文），重跑即消失
  —— 是 **Astro dev toolbar** 的瞬时元素。**h2 断言一律限定 `section#product-series h2`**，别用全页选择器。
- 未动：`products-svg` / `products-asvg` 与 zh/es/ar/pt 四语页。
  - ⚠️ **`(0)` 的选项目前仍可点**（点了会得到空网格，页面无「无结果」提示）—— 要不要自动置灰/禁用待用户定。
  - ⚠️ 当前 N = **卡片数**（一个型号一张卡）。改卡片清单后必须**重跑脚本**刷新初值，否则无 JS 时数字是旧的。
  - ⚠️ **`patch_filter_panel.py` 对「已处理过的文件」不可重跑**（label 里已有 `<span data-count>` → 它的 label 正则不再匹配，会静默跳过）。
    所以**改完卡片 `data-*` 后刷新静态 `(N)` 只能定点手改那几个 span**，别指望重跑脚本；改完用 `00_中转站\verify_ip65_sic_fix.py`（现算所有选项 N 与静态值比对）复核。
  - 💡 **运行时 `(N)` 由 `apply()` 在 load 时重算 → 静态 span 只影响无 JS 场景**，但两者必须一致（否则用户看到闪烁/SEO 快照不一致）。
- Filter **五组：Technology / Voltage / Current / IP Rating / Dimensions**（面板顺序即此顺序，**Technology 是 2026-09-23 新增、排在最前**）。**0 命中项以脚本现跑为准**（当前 20 项全命中）。
  - **Technology 组**：`data-filter="t"`，仅 2 档 `IGBT` / `SiC`。卡片侧对应 `data-t`（当前 卡1/6/8 = `SiC`；卡2/3/4/5 = `IGBT`；**卡7「IP65 Active Harmonic Filter」= `IGBT,SiC` 双技术，2026-09-24 用户定**）。
  - ⚠️ **加/删筛选组必须同步 3 处**：① 面板 HTML 加该组的 `<p>组名</p>` + `<input data-filter="X">`；② 每张卡加 `data-X`；③ 筛选 JS 的 `labels`（组名映射）、`active`（初始数组）、`['t','v','a','i','s'].forEach`（过滤 + 摘要两处遍历）。**少改 JS 会出现「能勾但不过滤/摘要不显示」。**
- 右栏（`div.n_right`）自上而下顺序（**2026-09-23 调整，2026-09-24 补按钮 / intro 拉宽**）：**视图切换（`cbp-vm-options`：宫格/列表图标 + 3 个系列跳转按钮）→ 8 张卡网格 → 标题+两段正文（`<!-- Category intro -->`，**`mt-10`，已满宽**）→〔仅 AHF 页〕Benefits → Application → Working Principle**。
  - Intro 文字块**原在卡片上方，2026-09-23 用户要求移到卡片下方**；移动时把 `mb-6` 改成 `mt-10`（沿用网格 2.5rem 节奏）。**视图切换留在卡片上方未动。**
  - ✅ **2026-09-24 12:04 用户要求「增大 intro 字号 + 段落右边对齐第 4 张卡右边」→ 已实施，本条待办完成**：
    `max-w-3xl` **已去掉**（只剩 `mt-10` → 满宽 = 右栏宽）；h1 `text-[clamp(24px,2.5vw,44px)]` → **`text-[clamp(28px,3vw,52px)]`**（1440 实测 36 → **43.2px**）；
    两条 `<p>` `text-[15px]` → **`text-[17px]`**（行高 27.625px）。
    - 实测（1440）：intro 块 `l=401 r=1325 w=924` == 卡片网格 == **第 4 张卡右边缘 1325**；标题与段落左边缘同 401。
      各档 p.r == 第 4 卡右边缘：1366 → 1257、1280 → 1178、1024 → 942、390（1 列）→ 359。
    - ⚠️ **768 时是 3 列，第 4 张卡落在第 2 行第 1 列（`li4.l == grid.l`）→ 几何上不可能与满宽段落右对齐**。
      段落仍 == 网格右边缘（707）。**这是栅格固有行为，不是漏改**（判据：列数 ∈ {1,2,4} 才断言与第 4 卡相等）。
    - ⚠️ **可读性代价（已告知用户）**：924px / 17px 实测**每行 120–122 字符**（第 1 段 3 行 = [120,122,52]，第 2 段 2 行 = [118,98]），
      远超通常 60–75 的舒适区间。若嫌太长，两条退路：① 段落单独保留一个 `max-w-4xl`（896px）而**标题仍满宽**；
      ② 回 15px（每行约 136 字符，更糟）。**用户当前选择 = 满宽 + 17px。**
    - ⚠️ **只改了 intro 这一块**：下方 Benefits（`ul` 768px / 15px）、Application（4 栏）、Working Principle（正文 768px / 15px、图片占位符 768×576）
      **仍是 `max-w-3xl` + 15px** → 现在**比 intro 窄 156px、字号小 2px**。是否一并拉宽/放大**待用户定**（未擅改）。
- **IP 档位语义（用户 2026-09-22 定的业务规则）**：面板只有 3 档 —— `IP20`（显示 *IP20(standard)*）/ `IP30|IP40`（显示 *other/negotiable*）/ `IP65`。
  - **除 IP65 开头的卡外，其余卡的 IP = 「IP20 + other/negotiable」两档**（`data-i="IP20,IP30"` 或 `IP20,IP30,IP40`）。
  - **IP65 开头的卡不带 other/negotiable**（2026-09-22 用户纠正，此前带 IP30 是错的）。具体（用户口径）：
    ⚠️ **2026-09-24 用户改判：IP65 卡一律「只有 IP65、不带 IP20」** → `IP65 SiC-Fanless & Low Noise AHF` = **`IP65`**（原 `IP20,IP65` 作废）、`IP65 Active Harmonic Filter` = `IP65`。
    ⚠️ **同一天还改判：卡7「IP65 Active Harmonic Filter」的技术 = `IGBT,SiC`**（原仅 `IGBT`）→ **别再把「IP65 卡」默认等同「IGBT 卡」**。
    一句话记法：**「IP20 起头的卡」= IP20 + other/negotiable；「IP65 起头的卡」= 只有 IP65。**
    ✅ 交叉印证：`products-svg.astro` / `products-asvg.astro` **原本就是** `IP65 SiC-Fanless …` 卡 `data-i="IP65"`、`IP65 …` 卡 `data-t="IGBT,SiC"` → 2026-09-24 这次是把 `products.astro` 补成与两个兄弟页一致。
  - ⚠️ **尺寸（Dimensions）同理要对齐**：一张卡可只保留自己真实的尺寸档（用户 2026-09-22 把多值压成单值，如卡6/卡8 只留 `515*500*185mm`、卡4 = `340*410*45mm`、卡7 = `600*500*220mm`）→ **卡片新增尺寸值时必须同时在面板加同名 checkbox**，否则新值筛不到（那次已补 `340*410*45mm`、`600*500*220mm` 两项）。
  - ⚠️ `other/negotiable` 的 value 只挂了 `IP30|IP40` → **不是真兜底**：将来出现 IP54/IP55 的卡会既不命中又不显示。要兜底需扩 value 为 `IP30|IP40|IP54|IP55`。
  - ⚠️ **增删卡后必重查 0 命中**：删卡会把 checkbox 变成死选项。空跑断言别写死「220V」（早被 208V 取代）。
  - ⚠️ **勾选项 value 支持 `|` 分隔**（一个勾选项命中多种值，如 `value="IP30|IP40"`，JS 侧 `cb.value.split('|')` 展开）→ 写命中校验脚本时必须先 split('|')，否则会把正常项误判成 0 命中。
  - ⚠️ **卡片 `data-*` 也可以是多值**（逗号分隔，如 `data-s="500*550*175mm,500*550*130mm"`），一张卡可同时命中多个尺寸档。
- **新增卡三件套**：① `<li class="cbp-vm-li">` 必须带 `data-v/a/s/i/t`（否则筛选收不到它）；② **插入位置**紧挨同类卡，别追加末尾；③ tags **沿用相邻同类卡**（不自己造关键词），回复里说明「tag 是沿用的」。
- 源串里 `&` 一律写 **`&amp;`**（alt + 文本各一处）。
- ⚠️ **改名的替换必须带定界符**：旧名常是别的卡名的子串 → 用 `alt="…"` / `>…</a>` 锚点，禁用裸串 replace。用户写 `Sic AHF` 实际应为 **`SiC AHF`**。
- ⚠️ **改产品名要全站一起改**：汇总页（img alt + h3）+ 详情页 `en/products/*.astro` 的相关产品列表（同 2 处）。

### 卡片 tag 规则
- 每卡 **8 个 tag**（随卡数变动，当前 8 卡 × 8 = 64 个，全局唯一无重复）；覆盖 **AHF / ADF / APF**（ADF = Active Dynamic Filter，APF = Active Power Filter）。**只有 en 改了**，zh/es/ar/pt 未同步。
- ⚠️ **tag 只在列表视图显示**：`.cbp-vm-view-grid .tags_ul, .cbp-vm-view-grid .my_more1{display:none}` → **改 tag 后必须切到列表视图**（点 `[data-view="cbp-vm-view-list"]`）才能看见。
- ⚠️ **`div.tags_ul` 那行缩进是 36 空格**（历史遗留）→ Edit 必须照抄；标签行 20 空格、`</div>` 18 空格。8 tag 后列表行会换行（`tags_ul` 高 51–80px），各卡行高不等是正常的。
- ⚠️ 已废弃 tag（勿再出现）：`Active Harmonic compensation` / `Electrical harmonic filter` / `Harmonic distortion filter` / `Wall mounted AHF module` / `Rack type AHF module` / `Rack type APF module` / `Horizontal Rack APF module` / `Active filter 30A module` / `3 phase active filter` / `Dynamic harmonic correction`。
- 词表（改卡名时同步改，新增卡从此表取）：
  1. **SiC MOSFET AHF** — SiC MOSFET AHF ｜ Silicon Carbide Active Harmonic Filter ｜ Ultra High-Efficiency SiC AHF ｜ SiC Active Power Filter APF ｜ Wide-Bandgap AHF Module ｜ 3-Phase SiC Harmonic Filter ｜ High-Efficiency Power Quality Filter ｜ Industrial SiC Harmonic Compensation
  2. **Anti-Pollution AHF** — Anti-Pollution AHF ｜ Dust-Proof Active Harmonic Filter ｜ Harsh-Environment AHF Module ｜ Anti-Corrosion Harmonic Filter ｜ Dust-Resistant APF Module ｜ Heavy-Duty Active Harmonic Filter ｜ Pollution-Proof Power Quality Filter ｜ Anti-Pollution Active Dynamic Filter ADF
  3. **Ultra-slim AHF** — Ultra-Slim AHF ｜ Slim Active Power Filter APF ｜ Compact 1U AHF Module ｜ Low-Profile Harmonic Filter ｜ Space-Saving Active Harmonic Filter ｜ Slimline Active Dynamic Filter ADF ｜ Ultra-Thin Power Quality Filter ｜ Thin Rack AHF Module
  4. **Distributed AHF** — Distributed AHF ｜ Active Dynamic Filter ADF ｜ Modular Active Harmonic Filter ｜ Distributed Harmonic Compensation Unit ｜ Cabinet-Mounted AHF Module ｜ Small-Capacity Active Harmonic Filter ｜ Distributed Power Quality Filter ｜ Multi-Module APF System
  5. **IP65 SiC-Fanless AHF** — IP65 SiC-Fanless AHF ｜ Low-Noise Active Harmonic Filter ｜ Outdoor IP65 AHF Module ｜ IP65 Fanless Harmonic Filter ｜ Weatherproof SiC AHF ｜ Waterproof Active Harmonic Filter ｜ Silent AHF Module ｜ IP65 Active Dynamic Filter ADF
  6. **IP65 AHF** — IP65 Active Harmonic Filter ｜ Weatherproof AHF Module ｜ IP65 Active Power Filter APF ｜ IP65 Harmonic Filter Cabinet ｜ Outdoor Active Harmonic Filter ｜ Waterproof APF Module ｜ IP65 Power Quality Filter ｜ IP65 Harmonic Compensation Unit
  7. **SiC-Fanless AHF** — SiC-Fanless AHF ｜ Fanless Active Dynamic Filter ADF ｜ Low-Noise SiC AHF ｜ Fanless Harmonic Filter Module ｜ Silent SiC APF Module ｜ Natural Cooling Active Harmonic Filter ｜ No-Fan AHF Module ｜ Low-Noise Power Quality Filter

### 卡片配图
- 图框：网格视图 `aspect-ratio:1/1`（1440 实测一行 4 个、卡 216px / 图 214×214、`gap:2.5rem`）；列表视图 240×150。**图框比卡宽小 2px**（左右各 1px 边框）→ 断言别写「图框 == 卡宽」。断点：1 列 / ≥640 两列 / ≥768 三列 / ≥1024 四列。
- 图 = Pillow **整幅等比 contain** 进 **1200×1200 正方形白底** → `WEBP q=82`。⚠️ 用户明确**不要裁剪、必须正方形**（做过 1200×900 版被否）。
- 卡 → 站点图：`sic-ultra-ahf`=`products-ahf-sic.webp` ｜ `anti-pollution`=`…anti-pollution.webp` ｜ `ultra-slim`=`…ultra-slim.webp` ｜ `distributed`=`…distributed.webp` ｜ `rack-mounted`=`…rack-mounted.webp` ｜ `ip65-sic-fanless`=`…ip65-fanless.webp` ｜ `ip65-ahf`=`…ip65.webp` ｜ `sic-fanless`=`…sic-fanless.webp` ｜ `advanced`=`…advanced.webp`（前缀均 `/assets/images/`）。7 张卡现在各用不同文件、网格占位图 = 0。
- ⚠️ 占位图 `index-product-ahf.webp`（709×1155 竖图）是**全站通用图**（news og:image、首页 product-visual、`Nav.astro` 飞出卡等 ~90 处引用）→ **绝不覆盖/改名**；某卡换图必须走**新文件名 + 精确改该卡 `src`**。
- **同卡换图的既定做法**：沿用同一站点文件名、只换字节（slug 语义仍对、`src` 不动 → 零 .astro 改动）→ 代价是 URL 不变有缓存风险，**必须做「HTTP 字节 md5/长度 与磁盘比对」验证**；动手前旧文件先备份到 `F:\trash\<日期>_<slug>-img-swap\`。

## 首页 `en/index.astro` Featured products 轮播（2026-09-24 改名 + 重排）
- ⚠️ **首页卡名与 `/en/products` 列表页卡名已不再逐字一致**（用户 2026-09-24 明确「只改首页，原有的 Active harmonic Filter 要去掉」）；**图 / 链接仍一一对应**。
- 位置：frontmatter `const featuredProducts = [...]`（第 12–22 行区，含上方那句会"说谎"的注释 → 已同步改掉）。
- **改名规则**：去掉名字里的 `Active Harmonic Filter` 冗余段，统一以系列后缀 `AHF` 收尾。
  ⚠️ 机械口径 = `name.replace(' Active Harmonic Filter','')`，若结果不以 ` AHF` 结尾则补 ` AHF` → **没有编造新词**（脚本用「新名多重集 == 旧名机械变换多重集」自证）。
- **重排规则**：第一面（桌面每面 4 张）固定 = SiC / 690V-800V / Ultra-slim / IP65 SiC-Fanless；后 4 张维持原相对顺序。
- 8 张卡现行值（名称 → href → img）：

| # | name | href | img |
|---|---|---|---|
| 1 | Silicon Carbide MOSFET SiC AHF | `/products/sic-ultra-ahf` | `products-ahf-sic` |
| 2 | 690V/800V Anti-Pollution AHF | `/products/anti-pollution-ahf` | `products-ahf-anti-pollution-690v-800v` |
| 3 | Ultra-slim AHF | `/products/ultra-slim-ahf` | `products-ahf-ultra-slim` |
| 4 | IP65 SiC-Fanless & Low Noise AHF | `/products/sic-fanless-ahf` | `products-ahf-ip65-fanless` |
| 5 | 208V/400V/480V Anti-Pollution AHF | `/products/anti-pollution-ahf` | `products-ahf-anti-pollution` |
| 6 | Distributed AHF | `/products/distributed-ahf` | `products-ahf-distributed` |
| 7 | IP65 AHF | `/products/ip65-ahf` | `products-ahf-ip65` |
| 8 | SiC-Fanless & Low Noise AHF | `/products/sic-fanless-ahf` | `products-ahf-sic-fanless` |

- **轮播结构（本轮未改，2026-09-24 复核）**：`#featured-products` → `div[data-fp-viewport].overflow-hidden` → `ul.fp-track`（CSS **`transition: transform 480ms cubic-bezier(0.22,0.61,0.36,1)`**）→ 8 × `li.fp-item`。
  **每面张数由 `.fp-item` 的 `flex-basis` 决定：<768px → 1 ｜≥768px → 2 ｜≥1024px → 4**（⚠️ **不是 640px**；640px 实测仍是 1 列，`--fp-gap: clamp(10px,1.2vw,22px)`）。
  翻页 JS：每次滑 **1 张**（不是 1 面），`fpMax() = items.length - fpVisible()` → 桌面 **4 步到底**，到边界给按钮加 `disabled`。
- ⚠️ **`index.astro` 是 LF 行尾，不是 CRLF** —— 全仓 187 个 `.astro` 实测 **LF=69 / CRLF=118 / MIXED=0**（`products*.astro` 才是 CRLF）。**改这文件前先探测行尾、按原风格注入，别用「假定 CRLF」的断言。**
- 脚本 `00_中转站\rename_index_cards.py`（`DRY=1` 干跑 / `DRY=0` 落盘 + 备份 `F:\trash\<ts>_index-rename-index.astro\`；**25 条断言**：注释一并替换 / 行数不变 639 → 639 / 换行符总数不变 / 行尾风格与原文一致 / 注入块行尾与文件一致 / 新名 == 旧名机械变换 / img·href 多重集不变 / 前缀·后缀逐字节未变 / 反向还原 == 原文）。
- 验证 `00_中转站\verify_index_cards.py` → **69/69 PASS**：1440 名称 / 图 / 链接 / alt 全序 + 8 图 `naturalWidth>0` + 真实点 next·prev（每步先等 transform 停）+ 4 步到底 + 回起点 transform 归零 + 12 个断点每面张数 + 每断点无横向溢出 + 回归（hero / h2 文案 / All Products 入口 / section 列表 / 无 JS 报错）。

### 标题贴近区块左上角 + 宽屏不居中（2026-09-24 13:5x）
用户口径（AskUserQuestion 两问的答复）：**① 只动标题、卡片不动；② 宽屏一并靠左。**

改了 `#featured-products` 里**两处**（都先切块再替换 —— `mx-auto` 那串全文有 3 处，只有本块的整行是唯一匹配）：

| 位置 | 改前 | 改后 |
|---|---|---|
| 内容容器 | `<div class="w-[clamp(320px,90vw,1800px)] mx-auto">` | 去掉 `mx-auto`（居中 → 跟随区块内边距靠左） |
| 标题 h2 | `<h2 class="font-barlow-condensed …">` | 前置 `relative ml-[calc(40px_-_clamp(24px,8vw,160px))] top-[calc(32px_-_clamp(36px,4.5vw,72px))]` |

- **⚠️ 这是全站第一次出现的两种写法，含义要记住**：
  - **水平位移用 `margin-left`**（不是 `left`）：块级元素 `width:auto` 时改 `margin-left` **只改自己宽度、右边缘不动、不影响任何兄弟** → 正负都安全，绝不产生横向溢出。
    用 `left:` 的话小屏上偏移为**正值**（如 360px 时 `40-28.8=+11.2`）会把标题推出视口右侧 → 多出横向滚动条。
  - **垂直位移用 `relative` + `top`**（不是 `margin-top`）：`margin-top` 负值会把**后面的轮播一起上提**，就不是「卡片不动」了。
  - **偏移量写成 `calc(目标值 - 区块内边距)`**：`40px - clamp(24px,8vw,160px)` → **任意宽度下标题都稳定落在距区块左 40px**，
    而不是「小屏被推出去、宽屏又不够靠」。区块 py 用 `clamp(36px,4.5vw,72px)` 所以竖版是 `32px - clamp(36px,4.5vw,72px)`（恒为负，标题不会掉出区块背景）。
- 实测（改动前 → 后）：

| 宽度 | 区块左内边距 | 标题 left | 标题距区块上边 | 第 1 张卡 left |
|---|---|---|---|---|
| 2560 | 160 | **40**（原 380） | 32 | 160（原 380） |
| 1920 | 153.6 | 40 | 32 | 153.6 |
| 1440 | 115.2 | **40**（原 115.2） | **32**（原 64.8） | **115.2（未变）** |
| 1024 | 81.9 | 40 | 32 | 81.9 |
| 768 | 61.4 | 40 | 32 | 61.4 |
| 390 | 31.2 | 40 | 32 | 31.2 |
| 360 | 28.8 | 40 | 32 | 28.8 |

- ✅ **卡片"逐像素没动"已用基线对照证明**（1440：视窗顶 1028.1、卡 left 115.2、卡宽 311、视窗宽 1296、区块高 603.9 —— 改动前后全等；`relative+top` 不参与布局流）。
- ⚠️ **副作用（用户已确认接受）**：标题现在比卡片左边缘**突出 75.2px**（悬挑式标题）；标题与轮播的视觉间距从 28.8px 变成 **60.8px**（标题上提 32.8px、卡片不动）。
  ↳ 若以后嫌下面空，收窄 h2 的 `mb-[clamp(14px,2vw,32px)]` 即可。
- ⚠️ **`h2` 的 class 串是文件内唯一**（x1），但 `w-[clamp(320px,90vw,1800px)] mx-auto` 有 3 处（第 63 / 108 / 180 行，后两处在 L102 那个深色 section）→ **只改了第 63 行**，另两个区块宽屏仍居中（用户未要求改）。
- 脚本 `00_中转站\tuck_fp_title.py`（`DRY=1/0`，**26/26 断言**：块内替换各 1 次 / 块内 `li.fp-item` 模板 x1（**map 渲染 8 次，源码只写一次**）/ 全文 mx-auto 5→4 / 行数 639 不变 / 行尾 LF 保持 / 前后缀逐字节未变 / 反向还原 == 原文）；备份 `F:\trash\20260924-135724_index-tuck-title\`。
- 验证 `00_中转站\verify_tuck_title.py` → **65/65 PASS**：A 组自证 Tailwind 任意值类真生效（computed `-75.2px` / `-32.8px`，**不是静默失效**）+ B 标题落点 + C **卡片 9 项基线全等** + D 10 个宽度标题恒定落点·无溢出 + E 宽屏容器靠左 + F 回归（文案/字号/字重/mb/轮播可翻页/无 JS 报错）。

### 每面 5 张 + 第 3 张卡改名（2026-09-24 14:0x）
用户口径：**「改成一次呈现五张卡片」** + **「ultra-slim ahf 改成 Ultra-Slim AHF(Datacenter Cooling)」**。

| 位置 | 改前 | 改后 |
|---|---|---|
| `@media (min-width: 1024px)` 内 `.fp-item` | `flex: 0 0 calc((100% - 3 * var(--fp-gap)) / 4)` | `flex: 0 0 calc((100% - **4** * var(--fp-gap)) / **5**)` |
| 第 3 条 entry | `'Ultra-slim AHF'` | `'Ultra-Slim AHF(Datacenter Cooling)'`（33 字符；`href` / `img` 未动） |

- **断点维持三档不变**：`<768px → 1 张 ／ ≥768px → 2 张 ／ ≥1024px → 5 张`（只改了 ≥1024 这一档；未新增断点）。
- **滑到底不会露空白**：8 张卡 ÷ 每面 5 张 → `fpMax() = 8 - 5 = 3` 步，index=3 时显示第 4~8 张，仍填满视窗（实测第 8 张右边缘 1411.13 vs 视窗右 1411.19 ✓）。
- 卡宽随宽度变化（实测）：2560 → 342.4 ｜1920 → 328 ｜1440 → **245.4**（原 311）｜1280 → 218.1 ｜1024 → **174.5**。
  ⚠️ **1024 时卡只有 174.5px**（名字仍 1 行，实测 `.fp-name` 高 19.8px = 13.68px × 1.45 行高），若嫌挤可把 5 张的门槛从 `min-width:1024px` 抬到 `1280px`（用户未要求）。
- ⚠️ **站点卡名大小写本来就不一致**：首页原写 `Ultra-slim AHF`（小写 s），而 `Nav.astro` / `products.astro` / `ultra-slim-ahf.astro` 写的是 `Ultra-Slim AHF`（大写 S）→ **本次首页改名顺手统一到大写 S**，但那 3 处仍是各自的旧文案（`Ultra-Slim AHF`，**没有** Datacenter Cooling 后缀）。
- ⚠️ **`Datacenter Cooling` 是全仓首次出现的词**（grep 确认 0 命中）；站内既有写法是 `Data Center`（带空格、分写，全仓 60+ 处）→ 两种写法并存，**未统一**。
- 脚本 `00_中转站\five_cards_rename.py`（`DRY=1/0`，**26/26 断言**：三段锚点各唯一 x1 / 小写 `Ultra-slim AHF` 全仓 1 处 / CSS 仍三档断点 / `var(--fp-gap)` 另 2 处未受影响 / 数组仍 8 条且 href·img 序列完全未变 / 行数 639 不变 / 行尾 LF 保持 / 反向还原 == 原文）；备份 `F:\trash\20260924-140013_index-five-cards\`。
- 验证 `00_中转站\verify_five_cards.py` → **69/69 PASS**：名称全序 + 每面张数（14 档含 1024/1023 与 768/767 边界）+ 卡宽 245.38 + 第 1~5 张在视窗内·第 6 张在窗外 + 3 步到底·index==3·第 8 张贴右边缘 + 每断点无溢出 + **上一轮标题 40/32 回归** + 无 JS 报错。
  ⚠️ 该脚本初版有 **2 条假 FAIL**：我拿**绝对页面坐标**（`lastRight=1411.13`、`h2.top=932`）去比**视窗宽 / 相对值**（1296、32）→ 正解是比 `vp.right` 与 `h2.top - section.top`。

## 三张列表页头部同构（2026-09-24 14:2x，SVG / ASVG 去 hero 后）
用户口径：**「英文SVG和ASVG页面的hero区域去掉」**（AHF 页 09:0x 已先删过，本页是照它办理）。

每页 **6 处**改动（两页完全同款）：

| # | 改什么 | 性质 |
|---|---|---|
| 1 | 删 hero `<section>`（含上方 `<!-- Hero Section -->` 注释，18 行）→ 换成一行 `<!-- Hero Section removed (2026-09-24, user request) -->` | 用户要求 |
| 2 | 删 hero 波形 canvas 的 `<script>`（73 行） | **必须**：`document.getElementById('hero-canvas')` 紧接着 `.getContext('2d')`，**无空值守卫**，只删 HTML 必 TypeError |
| 3 | `#product-series` 补 `mt-[72px]` | **必须**：否则被 `fixed top-0 h-[72px]` 的 nav 遮住 |
| 4 | h2「… Series」→ h1（class 一字不动） | hero 里 `<h1>Excellent Products</h1>` 是页面唯一 h1，删后页面无 h1 |
| 5 | `pt-12` → `pt-6` | 与 AHF 页面包屑 top=96 对齐（原 120） |
| 6 | 删孤儿 `<style>@keyframes decorIn</style>`（6 行） | 只被 hero 里的 `animate-[decorIn_…]` 用 → 删 hero 后成死代码 |

- **行数 567 → 470（−97）**；`<section` 2→1、`<script>` 2→1、`<style>` 2→1；`<h1>` 1→1（旧的随 hero 删、新的由 h2 升）；`<h2>` 1→0；**`mt-[72px]` 数量 1→1（从 hero 搬到了 `#product-series`）** ← 这条是好用的不变量断言。
- **`.fp-item` / `.fp-tab` 无关**；`hero-fade` 类**全仓只被引用、从未定义**（死类），随 hero 一起消失，无需清 CSS。
- 实测（两页一致）：`#hero` 不存在 · 首个 section = `product-series` · `#product-series` top = **72** · 面包屑 top = **96** · h1 ×1（文案 `Static Var Generator (SVG) Series` / `Advanced Static Var Generator (ASVG) Series`）· h2 ×0 · 8 张卡 · filter `(N)` 标签 20 个 · **未再请求 `products-hero-bg.webp`** · 0 条 JS 报错 · 视图切换（grid↔list）与筛选勾选逻辑均正常 · 1440/1024/768/390 无横向溢出。
- 脚本 `00_中转站\drop_hero_svg_asvg.py`（`DRY=1/0`，**70/70 断言**：锚点唯一 / 三段区间不重叠 / 区间内容自证（hero 块含 `id="hero"`、script 块含 `hero-canvas` 且不含 `cbp-vm`）/ 结构计数 / `mt-[72px]` 不变量 / h1 class 一字不差 / 行数差 == 删掉的行 + 1 行注释 / 全文仍纯 CRLF / **7 段逐段还原 == 原文**）；备份 `F:\trash\20260924-142042_svg-asvg-drop-hero\`。
- 验证 `00_中转站\verify_drop_hero.py` → **47/47 PASS**（两页各 22 条 + 3 页回归）。
- ⚠️ **三页头部现已同构**：都无 hero、都 `mt-[72px] + pt-6`、面包屑 top 都 96、页面唯一 h1 都是「… Series」。**zh/es/ar/pt 四语列表页仍有 hero，未动**；详情页面包屑是独立全宽 nav（top 84，另一套）。

## 待决缺陷（勿擅改）
1. `products-hero.webp` 是近全白空白图（AHF 内页仍用）。
2. 详情页仅 en 存在，`BaseLayout` 默认 `alternates=true` → 输出坏 hreflang（详情页已逐个设 `alternates={false}` 绕过，站点级方案未动）。
3. `en/products.astro` 的 `renderMatrix()` 因 `#matrix-tbody` 不存在，**每次加载报 `Cannot read properties of null`**（其他四语页有该表格）。修法：补表格或加空值守卫。
4. ⚠️ **configurator 各组是 checkbox「多选」，不是单选**（既有设计，非本轮引入）：同一组连点两个 → 两个都保持勾选，而 `pick(g)[0]` 取 **DOM 里第一个勾选**，所以「改选」不生效（点 100A 再点 150A，SKU 仍是 100A）。
   - 参考图是单选语义，且卡片选中态已是**实心橙**，两个同组按钮同时变橙看起来像坏了 → **建议改 `type="radio" name="cfg-{组}"`**（配合脚本选择器 `input[type="checkbox"][data-group]` → `input[data-group]`）；`sr-only` 视觉不变。**未改，等用户定。**
   - 2026-09-23 实测记录：勾 `IP65` 后再点 `other`，`checked` = `['IP65','other']`、chip 仍为 `…-IP65`。

## 回归
- `_verify_products_e2e.py`（86 断言，`CHITEK_BASE` 覆盖基址）；`_verify_product_pages.py`（Playwright，82 断言：状态/h1/related 无自链接/破图/configurator/form/链接可达/无 JS 报错），跑法用 `_run_verify_product_pages.ps1`（pwsh 7.6.3 + 重定向到 `C:\Users\lenovo\WorkBuddy\chitek_preview\verify_out.txt` 再读）。
- **列表页专用小验证（`00_中转站\`，2026-09-23 加）**：`check_tech_filter.py`（共享 venv 跑 Playwright，真点筛选并数可见卡 + 截图，**不 `browser.close()`**）；`_check_tags.py`（挖掉 script/style 后数各标签开闭是否平衡）；`_check_crlf.py`（CRLF/LF 计数，抓 Edit 把 CRLF 转 LF 的事故）。
- 断言失败**先查 DOM 而非代码**（用户会手改页面）。
- ⚠️ **改完 .astro 立刻抓 dev 可能拿到旧内容**：Astro dev 按需重编译，首次请求有竞态（2026-09-23 实测：第一次抓到 7 张卡、`data-t`=0；**重抓一次**就是 8 张卡 + `data-t` 正常）。**必须重抓或等编译完再断言。**
- ⚠️ **别用 `querySelectorAll('section[id]')` 数分节**：共享 Sidebar/Footer 也有 `<section id>`，且热重载瞬间会返回新旧混合 DOM。分节断言应**由侧栏 nav 锚点反推**。

## 待办
- **其余 5 页待铺**（distributed / ultra-slim / sic-fanless / ip65-sic-fanless / anti-pollution）—— 样板 `ip65-ahf` 已 139/139 通过，**等用户看过效果后拍板**。
- **左栏留白**：configurator 卡片化 + SKU 块下移后，左栏 449px、右栏 ~1123px → 左栏下方空 ~674px。收掉它要把卡片改成跨两栏通栏卡（就不是「图片右下角」了）→ **等用户定**。
- 卡片头部的副标题文案、`Configure your SKU` 标题文案都是我按参考图拟的英文，**用户尚未逐字确认**。
- zh/es/ar/pt 兄弟产品页**未同步** en 的全部改动（configurator/SKU/侧栏/**删 Product Categories**/**Technology 筛选组**/轮播/分节重组/tag）。
- `distributed-ahf`、`sic-fanless-ahf` 的 `30A` **SPECS 是占位值**（沿用 50A 的 d=150/kg=21，标 `// TODO`）→ 等真实尺寸/重量。
- ✅ **已裁决（2026-09-23）：不改链、不删页 → 保持两卡共用。** 遗留子问题：孤儿页 `ip65-sic-fanless-ahf` 参数仍是旧的（400/480/690V + 8A/20A），与同源 `sic-fanless-ahf`（208/400/480V + 30/50A）不一致；它虽从列表页不可达，但仍有 6 个子详情页的 Related Products 链它 → 客户能点进去看到旧参数。**是否只订正该页参数，待用户定（未动）。**
- `ultra-slim-ahf` 页 6 处仍写 `400VAC`（与站内统一写法 `400V` 不一致）。


---

## 详情页分节导航 / 版式（sic-ultra-ahf 试点，2026-10-09 ~ 10-10）

> 从 MEMORY.md 迁出的完整明细（原文照录，便于 grep）。

**详情页分节导航(10-09 试点 v2)**：⚠️**并发编辑警告**：10-10 上午有**另一会话/手动**在改同一文件（09:54 改 `.is-active` 文字色为橙、10:03 前把规格 `<strong>` 由 400 改回 700、删 SKU chip、参数表组头 `#a8401e`→`#ff6b1a`）；本机补丁一律**读最新版做定点替换**、不按记忆整段重写；动这页前先比对 mtime 与上一备份 diff。`sic-ultra-ahf.astro` 的左侧 PAGE GUIDE 竖栏已换成**首屏后才滑入的顶部吸附横向栏**：`<nav data-secnavbar class="fixed left-0 right-0 top-[72px] z-[999]">`+内层 `flex overflow-x-auto`，桌面/移动共用一条；**JS 按 `scrollY > innerHeight` 切 `.is-shown`**（默认 `translateY(-105%)`+`opacity:0`+`pointer-events:none`）→ 首屏内不显示、越一屏滑入、退回即收。栏目 7 项 href 沿用旧锚点、`#why` 标签改叫 **Advantages**；选中项=**加粗 700 + 底边 2px 橙**(`:global(a.js-secnav.is-active)`)；**10-10 已裁定：选中项文字保留橙字 #ff6b1a**（10-09 的「黑字」规格作废；日志 09:48 那条待确认项已闭环）。该行 10-10 09:54 由用户手改（注释同步改成"加粗橙色文字"，非本机补丁所为；用户 10-10 早上的诉求原文是"字体加粗黑色"）；`verify_v2.py` 的"选中文字黑色"一条会 FAIL。**其余 23 页详情页仍是旧左栏**，未铺开。改这页用 `00_中转站\en_secnav_top\patch_secnav_v2.py`，回归 `C:\Users\lenovo\WorkBuddy\chitek_verify\en_secnav_top\verify_v2.py`(80 断言)。**同页页边距 = 左右统一 110px**（10-10 由 90px 改；<lg 仍 36px）：`max-w-none px-9 lg:px-[110px]`，共 9 个容器（7 section + 顶部栏 + 面包屑已改通栏对齐）；parameters 的压窄 clamp 与 description 正文右缩进**已被用户要求去掉**（全页严格左右对称）。改边距用 `patch_pad110.py`，回归 `verify_pad110.py`(47 断言)；`verify_padeq.py`(90px)/`verify_pad3x.py` 均已作废。⚠️**表格 overflow 已知量**：1024 下 6 列 `whitespace-nowrap` 表格放不进 804px 内容宽 → 由 `overflow-x-auto` 容器横滚承接（页级无溢出）；1920/1440 放得下。**【2026-10-10 13:40 已消除 → 见本末节「参数表型号行合并」：表格最小宽 823→607，1024 不再横滚】****同页大标题规格(10-10 更新)**：H1+H2 共 **7 个**统一 `text-[28px] font-bold leading-[40px] text-[#090b0c]`（**字号 10-10 由 32px 改 28px**；固定值、不随断点缩放；行高 40px 未动=用户只提字号）；**h3/h4 卡片标题未动**（clamp 19.44/20.16/14.4/18px）。改字号用 `patch_h28.py`，回归 `verify_h28.py`(37 断言)；旧 `verify_h32.py` 已作废。**同页顶部规格列表(10-10 更新)**：Function…Warranty 9 行容器 `text-[clamp(14px,1.25vw,20px)]`→**`text-[14px] font-normal`**（固定 14px，10-09 晚定）；⚠️**这 9 个 `<strong>` 标签的粗细被用户要求来回改过两次，以最新为准 = `font-bold`（10-10 10:00，「和上面 tags 一样」）**；10-09 晚那次 `font-bold`→`font-normal` 已作废（`patch_specs14.py`/`verify_specs14.py` 除字号外不再代表现况）。现况：标签 `text-text-dark font-bold`(#1a1a1a)、正文/容器 400、行高 `/1.9`、正文色 `text-text-mid`(#444) 未动。改这用 `00_中转站\en_specs_bold\patch_specs_bold.py`，回归 `verify_specsbold.py`(15 断言，桌面 1440)。⚠️字号未对齐：Tags 标签 15px vs 规格标签 14px。**同页配置器(10-10)**：「Configure your SKU」标题右侧的 `SKU:` 徽标(`[data-sku-chip-val]`)已删，含只服务它的 4 行 JS，共 **−5 行(899→894)**；下方 summary 的 SKU 行(`[data-summary-view]` + 隐藏字段 `[data-inquiry-summary]`) **保留、继续随勾选自动更新**。改这用 `00_中转站\en_specs_bold\del_sku_chip.py`，回归 `verify_delsku.py`(15 断言)。**Parameters 分组表头(10-10 10:09 起为终版)**：7 个 `<th colspan="6">` 已对齐 `APF 50A` 单元格 = `text-left py-2 px-4 font-normal text-text-mid`（#444；去掉 text-[15px]/font-bold/uppercase/tracking-[0.06em]，字号继承表格 clamp(14px,1.1vw,16px)）+ 标题句首大写（Module parameters / System parameters / Performance indicators / Communications &amp; monitoring / Mechanical properties / Environmental requirements / Related qualifications and standards）。10:03 曾短暂设为 `#ff6b1a`，10:08 用户口径升级为「字体格式都同 APF 50A」→ 颜色一并转 #444，故本页 `text-[#ff6b1a]` 已 0 处（橙色只剩 h3/h4 卡片标题、SKU chip、Summary 行、Download 链接、Application 卡等 text-brand-orange，未动）。表头底色仍 `bg-[#fbdcd3]`，对比度 7.6:1（原 #a8401e 4.8:1 / 中间态 #ff6b1a 2.2:1）。⚠️另 7 个同款详情页仍是 `text-[15px] font-bold uppercase tracking-[0.06em] text-[#a8401e]`，未铺开。**同页区域底色 + 分割线(10-10 10:04)**：7 个内容 section 全部 `bg-white`（原 parameters/faq/related 为 `bg-[#fafbfc]`），相邻区域之间插入 **6 条 8px 灰分割线** `<div data-secdivider class="h-2 w-full bg-[#e5e7eb]" aria-hidden="true">`（`h-2`=8px；灰=既有 `--color-border-light`；**通栏**贴视口边缘）；DOM 顺序 `S D S D S D S D S D S D S`。改这用 `patch_whitesec.py`，回归 `verify_whitesec.py`(38 断言)。⚠️ 参数表 `th` 与卡片内共 33 处 `bg-[#fafbfc]` **不得动**。

### ⚠️ 后续更正（2026-10-10 10:22 源码实测）
- 参数表**分组表头行底色**已由 `bg-[#fbdcd3]` 改为 **`bg-[#e5e7eb]`**（源码 `bg-[#e5e7eb]` 共 13 处，含 7 个分组行）；上文「表头底色仍 `bg-[#fbdcd3]`」**作废**，全页已无 `#fbdcd3`。
- 同页区域底色：7 个 section 全 `bg-white` + 6 条 8px 灰分割线（见上）。
- 全页字体族 = 微软雅黑 Microsoft YaHei（2026-10-27 用户裁定，英文站全局 `html[lang="en"]` 覆盖；旧值 OPPO Sans 降为后备，见 global.css 注释）。

### 另项更正（2026-10-10 11:27 源码实测）
- **参数区 H2 现为 `Parameters`**（原 `Technical Parameters`，10-10 11:27 改）；左侧分节吸附栏锚文本本来就是 `Parameters`。
- **参数表左列 30 个字段名统一「句首大写」**：Rated voltage / Rated current / Power capacity / Rated input voltage / Grid frequency / Number of parallel connections / Grid structure / Current transformer / Harmonic compensation range / Harmonic attenuation / Quick response time / Full response time / Target power factor / Compensation mode / Noise indicator / Communication interface / Communication protocol / Module display interface / Mounting options / `Dimensions W×D×H (mm)` / Net weight / Color / CT connection mode / Altitude / Operating temperature / Relative humidity / Protection level / Standards compliance / Certification（其中 Efficiency、Color、Altitude、Certification 及尺寸公式本就是单字/公式，形态未变）。
- **只有本页这么做**：顶部 9 行规格定义（Function…Warranty）、配置器 5 个分组标签（CSS `uppercase` 全大写显示）、JSON-LD `additionalProperty.name` **仍是 Title Case**，未同步。
- 脚本 `00_中转站\sic_params_sentencecase\patch_params.py`（102 断言）/ 备份 `F:\trash\20261010-112733_sic-ultra-ahf-params-sentencecase\`。
- **Parameters 区已改双栏布局（2026-10-10 11:33）**：那层内容容器 `max-w-none px-9 lg:px-[110px]` 追加
  `grid grid-cols-1 xl:grid-cols-[max-content_minmax(0,1fr)] gap-x-[clamp(24px,4vw,64px)] items-start`；表格外层追加 `min-w-0`。
  - **≥1280(xl)**：标题在左（`max-content` 栏，实测 168.95px，贴内容左边缘 110）、表格在右、**顶部逐像素对齐**；列间距 = `clamp(24,4vw,64)`。
  - **<1280**：单栏堆叠（标题在上、间距仍 32px、表格满宽）= 与改前完全一致。**断点刻意用 `xl` 不是 `lg`**：右栏需 ≥~823px 才能不横滚，`lg`(1024) 只能给 ~600px。
  - 实测（无头 chromium，48/48）：右栏 1280→840、1440→993、1920→1467，**三档表格内部均无横滚**；5 档页级均无横向溢出。
  - 脚本 `00_中转站\sic_params_sentencecase\patch_layout.py` / `verify_layout.py`；备份 `F:\trash\20261010-113322_sic-ultra-ahf-params-2col\`。

### 参数表「型号行」→ 5 段等宽列（2026-10-10 14:06，**取代** 13:40 的「合并为斜杠长串」）
- 需求：「Rated current / Power capacity 两行右边参数改成分割上下对齐」——斜杠长串的各段位置随文字长度漂移，两行错位；改为 **`<div class="grid grid-cols-5">` + 5 个 `<span>`（每段 1/5 列宽、左对齐）** → 两行对应段严格垂直对齐。td 的 `colspan="5"` 与 class 未动。（**斜杠已于 14:12 按用户要求全部去掉** → 5 段现为纯留白分隔：`APF 50A` `APF 75A` … / `SVG 35Kvar` …；脚本 `00_中转站\drop_slash\patch.py`，20/20 PASS。）
- ⚠️ **不加 `whitespace-nowrap`**：13:40 合并的核心收益是表格最小宽度 823→607、**1024 横滚消失**，加 nowrap 会撑回去。窄屏（390）允许段内折行。实测表格宽未变：991 / 802 / 607。
- 实测（Playwright 23/23，1440/1024/390）：**两行 5 段的左边缘偏差全为 0.0px**；段宽 123.45 / 91.66 / 52.59；页级无溢出、1024/390 表格无内部横滚。
- 脚本 `00_中转站\params_5col\patch.py` / `verify.py`；备份 `F:\trash\20261010-140555_params_5col\`。
- 注：下方 13:40 那条「合并为单格斜杠列表」的**形态描述已作废**（表格宽度结论仍有效），保留作演变记录。

### 参数表「型号行」合并为单格斜杠列表（2026-10-10 13:40）
- 需求：「Rated current 行的 APF 50A / APF 75A / APF 100A / APF 150A / APF 200A（5 格）变成 `APF 50A/APF 75A/APF 100A/APF 150A/APF 200A`；Power capacity 行同理；太长的可以换行显示」。
- **只改 2 行**（现源码 L334 / L335）：原来各 5 个 `<td class="py-2 px-3 … border-l border-border-light whitespace-nowrap">` → **1 个 `<td colspan="5" class="py-2 px-4 pr-10 text-[#333333]">`**（与表内其它 `colspan=5` 单位行**同款 class**，即**无 `border-l` 竖分隔线**）；合并后**不带 `whitespace-nowrap`** → 长了自然换行（390 实测单元格高 52px = 2 行；≥1024 单行 35/37px）。
- 左侧 `<th>` 标签（`whitespace-nowrap w-[20%]`）**未动**。
- **副作用（好）**：这 5 个等宽列此前由「APF 100A」等 nowrap 文案撑宽，表格最小宽度 **823px → 607px** → **1024 档的表格内部横滚消失**（802/802，此前 823/802）。**上文「⚠️表格 overflow 已知量：1024 横滚」作废**；390 仍横滚（607/316，label 列 `whitespace-nowrap` 所致，可再议）。
- **未动、待用户定**：`Net weight`（19/24/24/29/34kg）与 `Dimensions W×D×H (mm)`（colspan 3+2）**仍是多列**；列宽因失去 APF 行约束而变得不匀（1440 实测 116/122/122/157/156）。
- 脚本 `00_中转站\params_wrap_merge\patch_merge.py`（读最新内容 → 按行定点替换；断言：每行命中唯一、单元格文本解析 == 期望 5 值、改后仅 1 个 td 且 `colspan="5"`、无 nowrap、变化行 == {334,335}、其余逐行不变、字节增量自证 −762、纯 CRLF）；备份 `F:\trash\20261010-134034_params_merge\`。
- 验证 `00_中转站\params_wrap_merge\verify.py`（Playwright，5 档 1920/1440/1280/1024/390 → **81/86 PASS**，5 条 FAIL 全是探针自己 abort `@vite/client` 造成的 `ERR_FAILED` 控制台记录）；`probe1440.py` 不拦 vite → **0 JS 报错、页级无溢出**。实测 1440：标签 318 + 合并格 673，双栏顶部对齐（h2.t == wrap.t == 2033）。

### 品牌橙统一为 #EA511E（2026-10-10 14:05 全站 / 14:06 本页硬编码）
- **全站口径**：`global.css` 的 `--color-brand-orange` = **#EA511E**（原 #ff6b1a 作废）、`-dark` = **#C43B13**、`-light` = #EA724E（14:05:26 由并发会话/用户改）；站内 `#ff6b1a` 字面量已清零，另有 41 文件 / 257 处硬编码 `#ea511e`。
- **本页（sic-ultra-ahf）**：另把 **101 处** `*-brand-orange` 引用硬编码为 `#ea511e`（95 类名含 `hover:`/`group-hover:`/`has-[:checked]:` + 2 `hover:bg-brand-orange-dark` + 4 页内 `<style>` 的 `var()`）→ **本页不再跟随 token**；且按用户 10-10 裁决 **hover 档 = #EA511E（本页按钮 hover 不变色）**，与全站 `-dark #C43B13` 不一致（待用户定）。
- ⚠️ **教训**：页内 `<style>` 的 `var(--color-brand-orange, <fallback>)` 里 **fallback 是死代码**（token 始终有定义）→ 只改 fallback，颜色不会变。
- ⚠️ **验证坑**：测 `has-[:checked]:` 选中态必须**真点击** label；用 JS 改 `.checked` 再读 computed 色会得到未选中态（假 FAIL）。
- 脚本/验证：`00_中转站\orange_ea511e\`（`patch_orange.py` 101 处；`verify_orange.py` 真点击 hover/选中态 **14/14 PASS**）；备份 `F:\trash\20261010-140621_orange_ea511e\`。

### Parameters 表「Target power factor 以下」点击展开（2026-10-10 14:18）
- 需求：Target power factor 往下的内容点击展开。范围 = **20 行（16 数据行 + 4 分组标题）**，Compensation mode → Certification。
- ⚠️ **两条硬约束**：`<details>` **不能包 `<tr>`**（解析器会 foster-parent 出表格）→ 不能照 FAQ 的原生写法；「上下两张表」会各自算列宽 → **必然错位**。→ 正确做法 = **同一个 `<table>` 内切两个 `<tbody>`**（第二个 `hidden`）+ 一行 `<button type="button" data-param-toggle aria-expanded aria-controls>` + **bundled `<script>`**（不用 `is:inline`，HMR 会重跑；不碰 `<style>` → 不重启 dev）。
- 结构：`<tbody>`[Module…Target power factor + toggle 行]`</tbody>` + `<tbody id="parameters-more" data-param-more hidden>`[Compensation mode…Certification]`</tbody>`。toggle 行 = `<td></td>` 占标签列 + `<td colspan="5">` 放按钮（与取值列左对齐）。
- 验证：`00_中转站\params_collapse\verify_collapse.py` → **28/28 PASS**（SSR 有 `hidden`+按钮；真点击：18→38 行可见、文案 `Show all parameters`↔`Show fewer parameters`、图标 `+`↔`−`（**图标写法 14:29 已改，见下节**）、**上下两半列宽逐像素对齐**、再点复位、0 JS 报错）。脚本 `patch_collapse.py`；备份 `F:\trash\20261010-141844_params_collapse\`。
- ⚠️ 副作用：收起内容 `hidden`（仍在 HTML 里可被抓取，但**无 JS 点不开**）。

### Parameters 展开按钮图标：`+`/`−` → 下向 chevron（2026-10-10 14:29）
- 需求：「点击展开右边的符号是向下的，而不是一个加号」。
- 改法（定点替换 2 处，**不动 `<style>`**）：
  - MARKUP `sic-ultra-ahf.astro:358`：`<span data-param-toggle-icon class="text-[15px] leading-none">+</span>` → `<span data-param-toggle-icon class="inline-flex items-center text-[15px] leading-none transition-transform duration-200"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`
  - JS：`if (icon) icon.textContent = open ? '\u2212' : '+';` → `if (icon) icon.classList.toggle('rotate-180', open);`
- **箭头方向语义（已实现）**：收起 = 向下 chevron；展开 = 同一 svg `rotate: 180deg` → **向上**（常见折叠交互惯例）。若用户要「展开也保持向下」，只需删掉 JS 里那句 `classList.toggle`。
- 复用样板：本页/其它详情页已有 18×18 chevron `stroke-width="2.2"`（右 `points="15 18 9 12 15 6"`、左 `points="9 18 15 12 9 6"`）；此处按 15px 按钮字号缩小为 **15×15 / `stroke-width="2.4"`**，下向 = `points="6 9 12 15 18 9"`。
- ⚠️ `rotate-180` 由 **JS 字符串字面量**引入（Tailwind v4 扫 src/ 能抽到），非 markup 里的类；`transition-transform`（v4 走 CSS `rotate` 属性）负责动效。
- 验证：`00_中转站\param_chevron\verify_chevron.py` → **27/27 PASS**：收起态 svg 存在（`iconText=''`，非文本 `+`）、`polyline=6 9 12 15 18 9`、15×15、`stroke=rgb(234,81,30)`(#EA511E)、`fill:none`、在文案右侧（lab.right 839.8 / svg.left 845.8）、同一行、`rotate:none`；真点击后 `rotate:180deg` + 面板 20 行 + 文案切换；再点复位；0 JS 报错。脚本 `patch_chevron.py`；备份 `F:\trash\20261010-142906_param_chevron\`。

### ⚠️ 更正：本页页边距已非对称（2026-10-10 14:21）
- 上文「同页页边距 = 左右统一 110px（全页严格左右对称）」**作废**。现状：
  - **Description / Parameters / FAQs 三区**：`max-w-none px-9 lg:pl-[110px] lg:pr-[180px]` + `grid … xl:grid-cols-[max-content_minmax(0,1fr)]` + `gap-x-[calc(clamp(24px,4vw,64px)_+_15px)]` → **≥1024：左 110 / 右 180**（14:21 由 140 改；140 是并发会话先设的）；**<1024：36/36 不变**。
  - **其余区（overview / why / application）+ 面包屑 + 吸附分节栏**：仍 `lg:px-[110px]`（110/110）。
  - 改法：`lg:pr-[140px]` → `lg:pr-[180px]`，全文件恰 3 处。脚本/验证 `00_中转站\pr180\`（**132/132 PASS**，6 档）；备份 `F:\trash\20261010-142117_pr180\`。
  - 参数表在右栏 753px（1280）下**仍不横滚**（得益于 13:40 型号行合并使表格最小宽度降到 ~607px）。
- ⚠️ **度量坑**：这类容器是 block 元素，`getBoundingClientRect()` 返回 **border box（=整屏宽）**，看"页边距"必须读 computed `paddingLeft/Right` 或量子元素（h2）的 left。

### Description 区域改双栏（2026-10-10 13:45）
- 需求：「Product Description 区域标题改成 Description，Description 显示在左边，下边描述显示在右边，顶部高度对齐」→ 与 11:33 那次 **Parameters 双栏同一句式**，故照抄同款 grid。
- 改动（源码 L273/L274 替换 + 2 行插入，911→914 行、81581→81798 字节）：
  - 内容容器 `max-w-none px-9 lg:px-[110px]` **追加** `grid grid-cols-1 xl:grid-cols-[max-content_minmax(0,1fr)] gap-x-[clamp(24px,4vw,64px)] items-start`（与 Parameters 逐字同款）。
  - H2 文案 `Product Description` → **`Description`**（左侧分节吸附栏那一项本来就叫 `Description`，改后一致）；`mb-6` → **`mb-8`**（与 Parameters 标题下间距统一；<xl 单栏 h2↔内容间距 = 32px）。
  - **新增一层 `<div class="min-w-0">`** 把「描述段落 + 6 个卖点卡片网格」整体裹成 grid 第 2 格 → **6 张卡片也进了右列**（按 Parameters「右列 = 整块内容」的类比理解；若想让卡片保持通栏，给包裹层加 `xl:col-span-2` 即可，一句话的改动）。
- 实测（Playwright，1440/1024/390 → **30/30 PASS**）：1440 双栏 **165.09 + 997.31px**、gap 57.6px、**h2.top == right.top 逐像素相等（1173.58）**、标题贴 110px 页边距、卡片仍 3 列；1024/390 单栏（804/318px，标题在上、间距 32px，390 卡片 1 列）；三档页级无横向溢出、0 JS 报错。
- **两区列间距 +15px（2026-10-10 14:09）**：Description 与 Parameters 的 `gap-x` 同为 `gap-x-[calc(clamp(24px,4vw,64px)_+_15px)]` → 1440 = 72.6px、1024 = 55.96、390 = 39（实测 18/18 PASS，顶部对齐仍 0 偏差；1440 下 Parameters 右列 993→978 后表格仍无横滚 976/976）。🔑 calc 内 `+` 两侧必须留空格，Tailwind 里用 `_+_`。脚本 `00_中转站\gap_plus15\patch.py` / `verify.py`。
- ⚠️ **这两区左右页边距已不对称（2026-10-10 14:11）**：容器由 `px-9 lg:px-[110px]` 改为 **`px-9 lg:pl-[110px] lg:pr-[140px]`**（右内边距 140，1440 实测内容右边缘 = 1300；1024 = 884；390 仍 36/36）。**其余 7 个容器仍 `px-9 lg:px-[110px]`（全页计数 9→7）** —— 因此上文「全页严格左右对称（统一 110px）」只对其余区域成立。改边距用 `00_中转站\pr140\patch.py`，回归 `verify.py`（29/30，唯一 FAIL = 390 参数表既有横滚）。
- **双栏口径已扩到 3 个区域（2026-10-10 14:15）**：**Description / Parameters / FAQs** 三区容器逐字同款 = `max-w-none px-9 lg:pl-[110px] lg:pr-[140px] grid grid-cols-1 xl:grid-cols-[max-content_minmax(0,1fr)] gap-x-[calc(clamp(24px,4vw,64px)_+_15px)] items-start`，右列均加 `min-w-0`。FAQ 区 h2 `FAQs About the SiC Ultra AHF` → **`FAQs`**（`mb-10`→`mb-8`），手风琴容器加 `min-w-0`；1440 实测其 colGap/gap 与 Parameters **完全相等（72.59px）**、顶部对齐 0 偏差；6 个 `<details>` 与问句未动。脚本 `00_中转站\faq_2col\patch.py`，回归 `verify.py`（31/31）。⚠️ 其余 4 区（Overview/Why/Application/Related）**仍是单栏**，未铺开。⚠️ 判表格横滚要比**其 `overflow-x-auto` 父容器**，不能比 table 自身 scrollWidth/clientWidth（恒相等）。
- 脚本 `00_中转站\desc_2col\patch.py` / `verify.py`；备份 `F:\trash\20261010-134554_desc_2col\`。
- **同区「小字描述」已统一 14px（2026-10-10 13:50）**：范围经用户裁定 = **2 段描述正文 + 6 张卡片的列表文字（7 处）** → `text-[14px]`（原 `clamp(13.5px,1.2vw,17.5px)`×1 + `clamp(13px,1.15vw,17px)`×6，固定值不再随断点缩放；`leading-relaxed` 保留 → 行高 22.75px）。**6 个卡片标题**（`clamp(15px,1.35vw,22px)`，1440=19.44px）**与 28px 大标题未动**。⚠️ 这两个串全页各有 2 / 27 处 → 只能切片内替换。脚本 `00_中转站\desc_14px\patch.py` / `verify.py`（21/21 PASS，1440/1024/390）；备份 `F:\trash\20261010-134951_desc_14px\`。
- 全页回归 `verify_v2.py` **79/80**，唯一 FAIL = 已知的「选中文字黑色」（用户 10-10 裁定保留橙字 #ff6b1a，测试期望过期）。

### ⚠️ 吸附栏「当前项」配色更正（2026-10-10 14:23）—— 取代本节上方「保留橙字」结论
- **用户 14:23 明确裁定**：吸附栏**常态** 7 项字体色 `text-text-muted`(#6b7280) → **`text-[#333333]`**；**当前项 `.is-active` 不再橙字**（删 `color: #ea511e;`），只保留 `font-weight: 700;`；**橙色下划线保留**（用户在被问「下划线怎么处理」时明确选「保留橙色下划线」）。
- 故本节上方「**10-10 已裁定：选中项文字保留橙字 #ff6b1a**」**作废**；`verify_v2.py` 中「选中文字黑色」一条**恢复有效**（应 PASS，此前记为过期 FAIL 的说法一并作废）。用户 10-10 早上原话「字体加粗黑色」= 本口径。
- `hover` 态**未动**：仍 `hover:text-[#ea511e] hover:border-[#ea511e]`（交互反馈，与全站 Nav 一致）。
- 实测（Playwright，1440 视口，**fails=0**）：首屏内 `is-shown=False`；滚动越过一屏后 `is-shown=True`、`opacity=1`；7 项常态 `rgb(51,51,51)` / `font-weight 500` / 无底边色；当前项 `rgb(51,51,51)` / `700` / `border-bottom-color rgb(234,81,30)`(=#EA511E) 2px。
- 源码改动：L83–L89 共 7 处片段 `text-[15px] font-medium text-text-muted border-b-2` → `text-[15px] font-medium text-[#333333] border-b-2`；`<style>` 的 `:global(a.js-secnav.is-active)` 删 `color` 行（951→950 行）；注释「加粗橙色文字」→「加粗深色文字」。
- 脚本 `C:\Users\lenovo\WorkBuddy\sic_secnav_333\patch.py`（17 断言，含 guard：`font-weight:700`/橙底边/`hover:*` 计数不变）；验证 `verify.py`（自带端口轮询）；备份 `F:\trash\20261010-142342_sic_secnav_333\`。
- ⚠️ **探针教训**：`out.count("color: #ea511e;")` 会**误命中** `border-bottom-color:` 与 `border-color:`（子串包含）→ 断言「橙字已清」必须用**6 空格缩进的独立行**或直接解析该 CSS 块，否则假 FAIL（首跑即因此 abort，未写盘）。

## sic-ultra-ahf: Easy to install 卡片左侧加端子照片 + WHY 区右边距 110 → 180（10-10 14:45）

**需求（用户原话要点）**：`F:\下载\图片1.png` 放到 `/en/products/sic-ultra-ahf` 的
「Easy to install and commission」卡片**外面、左侧**，**高度和 Hardware 描述一致**；
**整个 WHY 区域**页面右边距 110 → **180px**。
（卡片内外 / 左右、右边距作用范围这两点用户从选项卡里明确裁定 = **卡片外部左侧** + **整个 WHY 区域**。）

**资产**：`F:\下载\图片1.png`（835×401，AHF 端子 / CT 接线特写）→ WebP q88 →
`public/assets/images/sic-ultra-ahf-ct-terminals.webp`（314KB → 27KB，尺寸与比例 2.0823 不变）。
`alt` = "CT wiring terminals (S1/S2), RJ45 and CAN module-paralleling ports and communication DIP switches
on the CHITEK SiC Ultra AHF module"（132 字符，描述性、不堆词）；`width=835 height=401`、`loading=lazy decoding=async`。

**结构**（`src/pages/en/products/sic-ultra-ahf.astro`，WHY 区第一行）：

```html
<div class="max-w-none px-9 lg:pl-[110px] lg:pr-[180px]">          <!-- 原 px-9 lg:px-[110px] -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <div data-easy-install-row class="sm:col-span-2 lg:grid lg:grid-cols-[minmax(0,36fr)_minmax(0,64fr)] lg:gap-6 lg:items-start">
      <figure data-easy-install-media class="m-0 mb-5 w-full lg:mb-0">
        <img src="/assets/images/sic-ultra-ahf-ct-terminals.webp" ... class="w-full h-auto rounded-2xl border border-border-light object-cover" />
      </figure>
      <div class="rounded-2xl border border-border-light p-6 lg:min-w-0">   <!-- 原卡（去掉 sm:col-span-2） -->
        <h3>Easy to install and commission</h3>
        <p data-easy-install-hw-start ...>Hardware</p>
        <ul data-easy-install-hw-end ...>…</ul>
        <p>Software</p><p>…</p>
      </div>
    </div>
    …原有 Potting / Smart Sleep / Resonance 卡不动…
```

**⚠️ 两个必须记住的设计约束**

1. **用「定比例 grid」而不是 flex**：若卡片宽度由图片宽度决定（flex + 图片按高度算宽度），
   就会出现 **「图高 → 图宽 → 卡宽 → 文字换行行数 → Hardware 块高 → 图高」的反馈环**（可能震荡）。
   `lg:grid-cols-[minmax(0,36fr)_minmax(0,64fr)]` 让两列宽度**与内容高度无关**，环被打断。
2. **高度一致性只能用 JS 实测写回 CSS 变量**，不能写常量（同 09-28 英文首页 `--belt-h` 的教训：
   常量是「上一版文案」的快照，改文案/断点/字体就过期）：
   ```css
   @media (min-width: 1024px) { [data-easy-install-media] img { height: var(--ei-media-h, 240px); } }
   ```
   ```js
   var h = hwEnd.getBoundingClientRect().bottom - hwStart.getBoundingClientRect().top;
   media.style.setProperty('--ei-media-h', Math.round(h) + 'px');   // + resize / document.fonts.ready
   ```
   `<style>` 里的 `240px` 只是未测到之前的 fallback（避免首帧抽搐），**不是设计值**。

**实测（Playwright，1440×900，fails=0）**

| 项 | 值 |
|---|---|
| `#why > div` computed padding | `110px` / `180px` |
| 行容器 | `display:grid`、两列 `405.359px 720.641px`、行 `110 → 1260` |
| 照片 | `405×167`，左缘 110，`object-fit:cover`（纵向各裁 ~7%，主体居中可接受） |
| 卡片 | 宽 721、右缘 1260（= 视口 1440 − 180） |
| Hardware 描述块高 | **167.375px**；`--ei-media-h` = `167px`；图片高 167px ✓ |
| `<1024`（1023 / 390） | 内边距回到 `36/36`，照片堆在卡片**上方**通栏（318 = 390−72） |

**验证脚本**：`C:\Users\lenovo\WorkBuddy\00_中转站\easy_install_img\verify_page.py` → **45/45 PASS**
（三档 1440 / 1023 / 390；含「photo HTTP 200 ×3」「0 JS 报错」）。
**补丁脚本**：同目录 `patch_page.py`（29 断言；三次 abort 未写盘都是**断言写错**：卡片开标签上游距离估成 60 实为 158、切片边界差 1 字符 → 印证「先 `repr()` 打印再断言」）。
备份 `F:\trash\20261010-1438*_easy_install_img\`、`F:\trash\20261010-143909_easy_install_indent\`。

**踩坑**

- ⚠️ **本项目 dev server 可能只绑 `[::1]`（IPv6-only）** → Playwright 写 `http://127.0.0.1:4321` 会
  `net::ERR_CONNECTION_REFUSED`；**改用 `http://[::1]:4321/...`**。（判据：`netstat -ano | grep 4321 | grep LISTEN` 只出现 `[::1]:4321`）
- ⚠️ 三类**假 FAIL**：① 断点口径没分开（`<1024` 本来就是 `px-9`=36/36，不是 110/180）；
  ② 拿「取整后的 rect 相减」（168）去比 JS 的「未取整差值」（167.375）→ 差 1px 报红，应**保留未取整原值**或用 ±1 容差；
  ③ `loading="lazy"` 的图没滚进视口 → `naturalWidth=0`，**断言前先 `scrollIntoView`**。
- `src/pages/*/products/sic-ultra-ahf.astro` **只有 en 一份**（其余四语无此详情页）→ 无需同步语言。

### 追加更正（10-10 14:52）：Software 段加第二张图 → 左栏改「双图 “各自对齐”」

> 上面那节写的**单图 + 单一 `--ei-media-h`** 机制**已被本节取代**；其余（右边距 180、卡片外左侧、定比例 grid 防反馈环）不变。

**第二张图**：`F:\下载\Tri-Panel Engineering Systems Diagram.png`（1536×1024，1.5:1；Signal Acquisition/Processing｜AI/Algorithms｜Electrical Design）
→ WebP q88 → `public/assets/images/sic-ultra-ahf-software-tri-panel.webp`（1.18MB → 62KB，尺寸不变）。

**结构**：左栏由单个 `<figure data-easy-install-media>` 改为容器 + 两个 figure：

```html
<div data-easy-install-media class="w-full mb-5 lg:mb-0">
  <figure data-ei-shot="hardware" class="m-0">      <!-- 对 Hardware 块 -->
    <img src=".../sic-ultra-ahf-ct-terminals.webp" width="835" height="401" ... class="w-full h-auto rounded-2xl border border-border-light object-cover" />
  </figure>
  <figure data-ei-shot="software" class="m-0 mt-5"> <!-- 对 Software 块 -->
    <img src=".../sic-ultra-ahf-software-tri-panel.webp" width="1536" height="1024" ... class="w-full h-auto rounded-2xl border border-border-light object-contain" />
  </figure>
</div>
```
测高锚点：`data-easy-install-hw-start`（Hardware `<p>`）/ `-hw-end`（硬件 `<ul>`）/ **`-sw-start`（Software `<p>`）** / **`-sw-end`（Software 正文 `<p>`）**。

**机制（3 个变量；`--ei-media-h` 已删除）**

```css
@media (min-width: 1024px) {
  [data-ei-shot="hardware"] { margin-top: var(--ei-hw-top, 66px); }   /* 卡片顶 → Hardware 块顶 */
  [data-ei-shot="hardware"] img { height: var(--ei-hw-h, 167px); }    /* = Hardware 块高（object-cover 裁切）*/
  [data-ei-shot="software"] { margin-top: var(--ei-hw-sw-gap, 12px); }/* Hardware 块底 → Software 块顶 */
}
```
图2 **不设高度**：`h-auto` + `object-contain` → 铺满栏宽、**保持 1.5 自然比例、不裁切**。

**⚠️ 本次最重要的一条结论：1.5:1 的框图，「高度=块高」与「图内文字可读」不可兼得**

1440 实测：Hardware 块高 **167.38** / Software 块高 **136.47** / 左栏宽 **405.36**。
- 严格等高 136 → 图宽只有 **205px**（原图缩到 13%，图内文字 ≈6px，**看不清**）；
- 铺满 405 宽 → 自然高 **270.24**，比 Software 块高 **133px**。
- 两张图长宽比差太大（2.08 vs 1.5），**同一栏宽下没有任何 W 能同时让两张既铺满又等高**（已验算）。
- **用户裁定：选可读** → 左栏总高 66+167+12+270 = **515.9**，比卡片（407.11）高 **108.8px**，**该行行高由左栏决定**（当时为 `lg:items-start`，卡片不被拉伸 —— **已于 10-10 15:00 改为 `lg:items-stretch` 让卡片等高，见本末节「追加更正（10-10 15:00）」**）。

**实测（Playwright 1440，fails=0）**：图1 `405.36×167`（顶=卡顶+66）、图2 `405.36×270.91`（顶=卡顶+245.6、`w/h=1.5` 精确、底=卡底+108.8）、卡片 `720.64×407.11`、行 `110→1260`、`--ei-hw-top/-h/-gap` = `66px/167px/12px`；<1024（1023/390）两图**堆在卡片上方**通栏、保持自然比例。
**验证脚本**：`C:\Users\lenovo\WorkBuddy\00_中转站\easy_install_img\verify_page2.py` → **41/41 PASS**。

**再做同类事的检查清单**（避免重踩）
1. 先量「图片长宽比」与「目标文字块高/宽」——**比例差 >1.3 倍基本就不可能既铺满又等高**，直接问用户取舍，别硬做。
2. 左栏宽度由 grid 比例定，**任何"让图决定宽度"的写法都会引入反馈环**。
3. 高度一致性走「JS 实测 → CSS 变量」，**永不写常量**。
4. 断言时 alert：`--xxx` 类变量在**注释里也会被 count 到**；跨替换步骤比较下标**必须用同一份字符串**算（本次两条 abort 都是这类假 FAIL）。

### 追加（10-10 14:58）：`#why` 区配色口径 —— 标题 `#626469` + 加粗，描述全 `#626469`

用户边界原话：**「描述部分，非标题」**（即 H2 大标题不参与）。

| 元素 | 改前 | 改后 |
|---|---|---|
| 卡片标题 h3×4（Easy to install / Potting / Smart Sleep / Resonance） | `text-[#ea511e] font-semibold` | `text-[#626469] font-bold` |
| 卡片标题 h4×4（ISO 9001 / in-house line / burn-in / Proven in the field） | 同上 | 同上 |
| 小节标题 h3×2（Manufacturing & QA Capabilities / Certifications） | `font-semibold text-text-dark`(#1a1a1a) | `font-bold text-[#626469]` |
| 正文段落 / 列表 / 底部 CTA 段（`text-text-mid`×11） | #444444 | `text-[#626469]` |
| Hardware / Software 粗体小标签（`text-text-dark`×2） | #1a1a1a（700） | `text-[#626469]`（仍 700） |
| 4 个证书图注（`text-text-muted`×4） | #6b7280 | `text-[#626469]` |
| H2「WHY CHITEK…」 | `text-[#333333]` | **不动**（全页 6 个 H2 统一 #333333） |
| 橙色 CTA 按钮 | 白字 / #EA511E 底 | **不动** |

- 与 `#description` 区对照：那边是 `h3 text-[#626469] font-semibold` + `ul text-[#626469]` → 本区**同色，但标题粗一档**（用户「字重大些」= semibold → bold）。
- 共改 **27 处 class**，行数不变；纯 class 改动 → **dev HMR 即时生效，无需重启**。
- 验证：`verify.py` 逐个读 36 个文字元素的 computed style，**13/13 PASS**（含「无旧色残留」与「按钮未动」）。
- ⚠️ 复核提示：本区现在**主题橙已完全退出标题**，只剩底部 CTA 按钮是橙 —— 这是用户有意为之，别当 bug 改回去。

### 追加更正（10-10 15:00）：卡片改为「与图片列等高」→ `lg:items-start` 改 `lg:items-stretch`

> 承上节：左栏 515.9 比卡片 407.11 高 108.8px，卡片短一截。用户 15:00 原话：「**Easy to install and commission卡片和左边的图片高度对齐**」。

**改法（本区第 2 处机制改动，仍只有一行 class）**：`[data-easy-install-row]` 的
`lg:gap-6 lg:items-start` → **`lg:gap-6 lg:items-stretch`**（`src/pages/en/products/sic-ultra-ahf.astro` **L395**）。
grid 的 `items-stretch` 让卡片作为 grid item 被拉伸到**行高 = 图片列高**；卡内内容仍**顶部对齐**（`h3` 距卡顶仍 25px），多出的高度全部落成卡片**底部空白**。

**为什么只改这一行**：需求实质是「谁决定行高」。`items-start` 下行高虽已是 `max(两列自然高)`，但卡片不拉伸 → 视觉上仍比图片列短一截。`items-stretch` **完全不动图片宽高与比例**，只让卡片长到行高。

**实测（Playwright computed；卡片高/底 == 图片列高/底 == 图2 底，三档 ±1px 全中）**

| 视口 | 卡片 | 图片列 | 拉伸多出空白 |
|---|---|---|---|
| 1920 | 1027.84 × **612.09** | 578.16 × 612.09 | **250.1** |
| 1440 | 720.64 × **515.91**（原 407.11） | 405.36 × 515.91 | **109.8**（≈ 上节算出的 108.8） |
| 1024 | 454.41 × 419.06 | 255.59 × 419.06 | **18.1** |
| 1023 / 390 | — | — | `display:block`，两图仍堆在卡片上方，**不参与拉伸** |

**⚠️ 几何随视口变化，别写死常量**：卡片越宽 → 文字换行越少 → Hardware 段越矮 → 图1 越矮（**1920 图1 仅 144 高**，vs 1440 的 167；因 1920 卡片宽 1027）；1920 卡片总高 612 是因为图片列宽 578 → 图2 自然高 386；h3 有 `clamp(…,1.35vw,…)` → 1920 字号 22px，又把「Hardware 标签顶」推低（图1 顶 = 卡顶 **+70**，非 66）。

**验证**：`C:\Users\lenovo\WorkBuddy\00_中转站\easy_install_stretch\verify2.py` → **88/88 PASS**（1920/1440/1024/1023/390 五档，fails=0）。
核心断言全部是**视口无关的活不变量**：`align-items=stretch`｜卡片顶/高/底 == 图片列顶/高/底(±1)｜卡片底 == 图2 底(±1)｜**图1 顶 == Hardware 标签顶**｜**图1 高 == Hardware 段高（`ul` 底 − 标签顶）**｜**图2 顶 == Software 标签顶**｜卡片左缘 − 图片列右缘 == 24（`gap-6`）｜`h3` 距卡顶 25（内容未随拉伸下沉）｜图2 `object-fit=contain` 且**内容盒**比例 == 1.5（未裁切）｜10 个标题仍 #626469/700、H2 仍 #333333、padding 110/180（<1024 = 36/36）｜0 JS 报错。

**⚠️ 写渲染断言的三个坑（首版 `verify.py` 因此误报 15 条 FAIL，页面本身无问题）**
1. **不要写「等于我上次在某个视口量到的常数」**，要写「**同一次测量里两个量相等**」（图1 高 == Hardware 段高）。写死 1440 的 `405.36×167`、卡片宽 `720.64`、图2 顶 `+246` 在 1920/1024 必然全红。
2. **`getBoundingClientRect()` 量的是含边框盒**：`<img>` 带 `border`(1px×2) → `405.36/270.91 = 1.496` 会被误判「比例错/被裁切」。**须减掉 computed border 再算比例**（得精确 1.5）；也**别用 `clientWidth/clientHeight`**（取整到整数，255px 宽下 0.2% 误差照样误报）。
3. **`check(label, actual, expect)` 参数别传反** —— 把算出的值传给 `expect`，`bool == 108.8` 永远 False。

**备份**：`F:\trash\20261010-150036_easy_install_stretch\`（补丁 `patch.py` 15 断言；首跑 1 条 abort 又是断言写错：`data-ei-shot="software"` 全文件计数为 **2**，因 CSS 选择器里也含该串）。
**源码复核**：`items-stretch` 全文件 **1** 处（L395）；995 行、**全 CRLF**（bare LF=0、`\r\r\n`=0）、87705 字节。

### 追加（10-10 15:11）：`#manufacturing` 区「2,300 m²」段落左缩进 25px → 对齐下方 ISO 卡片内文

用户原话：「The SiC Ultra AHF is built in our own 2,300 m² plant … 和下方的ISO左侧对齐」。

**先量基线再动手（两个候选基准差 25px，别猜）**：Playwright 四档实测 ——
- 段落文字左缘 = **110px**（= 容器左），而**卡片边框**左缘也是 110px → **已经和外框齐平**，所以「ISO」不可能指边框；
- 卡内文（`ISO 9001:2015 quality system` 这个 h4 及其 `<p>`）左缘 = **135px** = 卡片 `1px border` + `p-6`(24px)。

→ 基准 = 卡片**内文**，段落需右移 **25px**。

**改法**：`sic-ultra-ahf.astro:438` 该 `<p>` 的 class 末尾加 **` pl-[25px]`**（`… mb-5 text-left` → `… mb-5 text-left pl-[25px]`）。
- 为什么用 `pl-` 而不是 `ml-`：`pl-` 让段落**盒子左缘不动**（仍 110，与卡片外框齐平），只把文字推右 25px；`ml-` 会把整个盒子（含背景区）右移，且改变与上下的对齐关系。
- 为什么是 **25** 不是 24：卡内文左 = 容器左 + 1px 边框 + 24px 内边距 = **+25**。用 `pl-6`(24) 会差 1px —— 要「像素级对齐」就写 25。

**验证**：`00_中转站\mfg_iso_align\verify.py` → **77/77 PASS**（1920/1440/1024/390 四档，fails=0）。
量法用 **`Range` 取首字形墨水左缘**（不是元素盒 —— 段加了 `pl-` 之后盒左仍是 110，量盒会得到假值）。
- 四档全部：**段墨迹左 == ISO h4 墨迹左 == 135（桌面）/ 61（390）**，差 0；且全页只此一处 `pl-[25px]`。
- 回归：`h3` 墨迹左仍 = 容器左（**未跟着缩进**）、卡片0 边框左仍 110、卡内 `paddingLeft` 仍 24px、10 个标题仍 #626469/700、H2 仍 #333333、padding 110/180（<1024 = 36/36）、0 JS 报错。

**⚠️ 顺带记一个高频坑**：`box-sizing: border-box` 下给元素加 `padding` **不会**减小 `getBoundingClientRect().width`（盒宽不变，变的是**内容宽**）。首版断言写「段宽 == 容器内容宽 − 25」→ 得 25 而非 0，4 档假 FAIL。**要验的应是「盒宽 == 容器内容宽」+「内容宽 == 容器的 − 25」两条。**

**备份**：`F:\trash\20261010-151102_mfg_para_align_iso\`（补丁 `patch.py` 20 断言全过；字节 87705 → **87715**，+10 = `" pl-[25px]"`；全 CRLF 守恒、`²` 与 `—` 完好）。

**未做（用户只提了这一句，留待其决定）**：上方 h3「Manufacturing & Quality Assurance Capabilities」仍停在容器左 110，**没跟着缩进** —— 若希望标题+段落成组缩进，需另说。

### 追加（10-10 15:53）：顶部 Configure your sku —— 价格从 SKU 行拆出、与 Inquire now **等高**并排

用户原话：「底部 `SKU: …· Estimated 1300$(EXW)` 改成 `SKU: …· 27 kg`，这个区域背景是白色，`Estimated 1300$(EXW)` 变成加粗黑体，大小 24px，333333 颜色，和 inquirenow 等大等高」。

**三点歧义先问后做**（`AskUserQuestion`，用户答复）：① 价格放 **Inquire now 左边同一行**；② 背景 **改纯白，只 summary 这一条**（`#fafbfc` → `bg-white`）；③ 隐藏字段（发给销售的 `message`）**一起去掉价格**。

**4 处定点替换** (`sic-ultra-ahf.astro`)：

| # | 位置 | 改前 | 改后 |
|---|---|---|---|
| 1 | L178 summary 条 | `bg-[#fafbfc]` | `bg-white` |
| 2 | L197 价格+按钮容器 | `flex items-center gap-2 shrink-0 sm:ml-auto` | `flex flex-wrap items-stretch gap-2 sm:ml-auto` |
| 3 | L834 `var sku` | 尾部有 ` · Estimated 1300$(EXW)` | 去掉 |
| 4 | L842-845 可见行 | t2 尾 ` · ` + t3 价格 span | t2 去尾分隔符、删 t3、`appendChild` 只剩 t1/t2 |

新增元素（插在按钮前）：
```html
<p data-summary-price class="m-0 flex items-center font-bold text-[24px] leading-none text-[#333333] whitespace-nowrap">Estimated 1300$(EXW)</p>
```

**⚠️ 关键手法：等高不写死常量**
- 容器 `items-stretch`（flex 默认）→ 价格盒自动拉伸到**行高 = 按钮高**；
- 价格 `leading-none`（自然高 24px < 按钮 41px）→ 保证是**按钮**决定行高，价格跟着长；
- 价格自身 `flex items-center` → 文字在拉长后的盒里**垂直居中**；
- ⇒ **按钮以后改字号/内边距，价格自动跟随**，无需同步常量。
- 同时**必须去掉 `shrink-0`**：留着它容器保持 max-content 宽度、内部 `flex-wrap` 永远不触发 → 窄屏会横向溢出。
- 用 `pl-`/`flex` 组合而不是给价格写 `h-[41px]` —— 见本目录反复出现的「不写死高度常量」原则。

**实测（`verify.py`，73/73 PASS，fails=0）**

| 视口 | summary 条内宽 | 并排所需 441.66 | 结果 |
|---|---|---|---|
| 1920 | 820 | 441.66 | ✅ 并排：**价格 288.25×41 == 按钮 145.41×41** |
| 1440 | 580 | 441.66 | ✅ 并排：**价格 288.25×41 == 按钮 145.41×41** |
| 1024 | 379.52 | 441.66 | ⚠️ 换行：价格独占一行（高 24），按钮下一行 |
| 390 | 316 | 441.66 | ⚠️ 换行：同上 |

其余断言全过：背景 `rgb(255,255,255)`｜价格 `24px` / `700` / `rgb(51,51,51)`｜价格在按钮左侧不重叠、同一 flex 容器｜文字在盒内垂直居中（±1.5）｜可见行 `SKU: CHITEK-SiC-AHF-100A-400V-Rack-IP20 · 500 × 550 × 135 mm · 27 kg` 且**与隐藏字段逐字一致、都不含价格**｜Configure 卡片内 `Estimated 1300$(EXW)` 只出现 1 次｜无横向溢出｜0 JS 报错。
**交互回归**：点 `75A` pill → SKU 行变 `…75A-400V-Rack-IP20 · 500 × 550 × 142 mm · 24 kg`、隐藏字段同步、价格元素不受影响；**再点同一下就取消**（见下条坑）→ 回到默认 `100A`。

**⚠️ 坑：这些筛选 pill 是 `<input type="checkbox">`（多选），不是 radio**
所以「改成 B 再改回 A」不能靠点 A —— 点 A 只会**再加一个勾**，而 `pick(g)[0]` 取的是 **DOM 顺序第一个**已勾选项，结果仍显示 A。**复原必须「再点一次同一个」**。

**⚠️ 脚本坑（首跑 2 次 abort，都是我的断言写错，守卫拦住了没写盘）**
1. 锚点 `' kg';` 太泛（文件别处也有）→ **锚点必须整行/带变量名**（改成 `var sku = 'SKU: ' …`）。
2. 校验「模板已去价」时按 `spec.kg + ' kg';` 出现 **1 次**判断，实际 **2 次**（`var sku` 与 `t2.textContent` 各一）。

**⚠️ 顺带发现并行编辑（本页当时有另一会话/用户在改）**
补丁读到的字节数是 **87717**，而我 15:14 量的是 **87715**（+2）→ 与 15:11 备份 `difflib` 逐行 diff，发现**整个 `#why` 区被外部改过**：本机上午设的 `#626469` 标题/标签**已全改成 `#333333`**，字号由 `clamp(15px,1.35vw,22px)` / `clamp(14px,1.25vw,20px)` **缩到 `clamp(13px,1.15vw,17px)`**（FAQ `<summary>`、案例 h3 同改）。
定点补丁锚点外一律不动 → **外部改动全部保住**。**做法沉淀：补丁脚本「读字节数」这一步顺带就能察觉外部改动；再用 `difflib` 与上一份备份 diff，能立刻分清「别人改的」和「我改的」，既不误判也不覆盖别人的活。**

**备份**：`F:\trash\20261010-155314_sku_price_row\`（补丁 36 断言）。字节 87717 → **87736**（+19）、995 行全 CRLF 守恒。

### 追加（10-10 16:01）：`Inquire now` 由 Netlify 邮件表单 → **WhatsApp 跳转**（含 SKU 预填）

用户原话：「这个按钮直接发送邮件，没有意义啊，需要客户填基本信息，不如改成跳转到 whatsapp」。
裁定（`AskUserQuestion`）：**号码 `8618818994346`**｜**预填客户刚选的 SKU**｜**彻底删掉表单**。

**号码口径（重要）**：英文站统一用 **`+86 188 1899 4346` → `wa.me/8618818994346`**（`products.astro` / `-svg` / `-asvg` / `services.astro` / `Sidebar.astro` / `tel:` 共 7+ 处）；**只有 Sidebar 的中文版（zh）用 `+8619020586646`**。今后任何 en 页加 WhatsApp 入口都用前者。

**动手前必须查的三件事（本次全绿，故 analytics 与 Netlify 都很干净）**
1. **`contact_click` 无需改 analytics.js**：`analytics.js` 用**全站 `<a href>` 事件委托**（`document.addEventListener('click')`），判据 `CONFIG.whatsappRe = /wa\.me|api\.whatsapp\.com|web\.whatsapp/i` → **换成 wa.me 的 `<a>` 即自动记为 `contact_click { contact_method: 'whatsapp' }`**。
2. **删钩子不会抛错**：`[data-utm-fields]` / `[data-lead-form]` / `[data-form-success]` 在 analytics.js 里都是 `querySelectorAll` 遍历 + `if (!el) return` → 取不到就 no-op。
3. **Netlify 表单注册不受影响**：无 `public/__forms.html`；`name="quote"` 的表单在**其余 22 个页面**仍在。

**五块定点替换**（`sic-ultra-ahf.astro`；行 **995 → 941**、字节 **87736 → 85108**）

| # | 块 | 改动 |
|---|---|---|
| B1 | summary 条 | 删 `<form …>` 全套（`id/name netlify data-lead-form` + `form-name` 隐藏域 + `[data-utm-fields]` + honeypot + `[data-inquiry-summary]`）、SKU 行由 form 内 `<p>` 提为直接 flex 子项（承接 `flex-1 min-w-[280px]`）、`<button type=submit>` → **`<a data-wa-link>`**、删 `[data-form-success]` 成功提示块 |
| B2 | 脚本头 | `var boxes = …[data-inquiry-summary]; if (!boxes.length) return;` → `var view = …[data-summary-view]; var waLink = …[data-wa-link]; var WA_BASE = 'https://wa.me/8618818994346?text='; if (!view) return;`（**不再依赖隐藏字段**） |
| B3 | `build()` | 去掉 `boxes.forEach(b => b.value = sku)`；`t2.textContent = detail`；新增 `waLink.setAttribute('href', WA_BASE + encodeURIComponent("Hi CHITEK, I'd like a quotation for: " + detail))` |
| B4 | 脚本尾 | 删「把 SKU 写回表单 message」整段（含 `msg` / `origBuild` / `boxesNow`） |
| B5 | 第二个 `<script>` | **整块删除**（它靠 `form[name="quote"]` 的 `submit` 事件重填 textarea，表单没了即成死代码） |

新 CTA：
```html
<a data-wa-link href="https://wa.me/8618818994346" target="_blank" rel="noopener noreferrer"
   class="inline-flex items-center justify-center bg-[#ea511e] hover:bg-[#ea511e] text-white font-semibold rounded-lg px-5 py-2.5 text-[14px] transition-colors whitespace-nowrap cursor-pointer no-underline">Inquire now &rarr;</a>
```
- **静态 href（无 text）作兜底**，JS 加载后才补上预填文本 → JS 失败也仍能跳转。
- 预填文本 = `Hi CHITEK, I'd like a quotation for: <partNo> · 500 × 550 × <d> mm · <kg> kg`。
- **`no-underline`**：Tailwind v4 preflight 的 `a` 是 `text-decoration: inherit`，显式关掉更稳。

**验证**：`00_中转站\wa_cta\verify.py` → **83/83 PASS**（1920/1440/1024/390，fails=0）。三块硬验证：
1. **结构**：CTA `tagName === 'A'`；summary 条内 `<form>` 0、**整页 `<form>` 0**；5 类死钩子清零；`target=_blank` + `rel` 含 noopener/noreferrer + 无下划线。
2. **预填与联动**：`decodeURIComponent(href.split('text=')[1])` == 预期整句；href 内无裸空格；**点 75A → SKU 行与 wa href 同步换成 `142 mm · 24 kg`**，再点一次取消回默认。
3. **转化实测**：桩 `window.gtag` 后 `dispatchEvent(new MouseEvent('click',{bubbles:true}))`（**合成事件不触发跳转**，可安全测）→ 收到 `['event','contact_click',{contact_method:'whatsapp', link_url:'https://wa.me/…?text=…', page_path, lang}]`，且 URL 未变。
- **回归**：CTA 盒 **145.41×41 == 原 `<button>`**（说明「与价格等高」未被破坏）、背景仍纯白、价格仍 24px/700/#333、`pl-[25px]` 与 `lg:items-stretch` 未丢、gallery 钩子完整、4 个 PDF 下载未动、0 JS 报错。

**⚠️ 脚本坑（首跑 5 条 abort，全是我自己的断言错，守卫拦住未写盘）**
1. `data-summary-view` / `data-wa-link` 在 **HTML 属性 + JS 选择器各 1 次 = 共 2 次**，我按 1 算。
2. gallery 的 `data-gallery-main` / `data-gallery-thumb` 同时出现在 `<img>` 属性与 JS 里 → **不能断言 `== 1`**，要跟改前计数比。
3. 行差**符号写反**：应为 `new - src == Σ(new - old)`（负值）。
4. **`skel()` 骨架函数遇「整块删除（新串为空）」会把空串 replace 到字符串开头** → 骨架永久不等。修法：整块删除时**两侧一起抹掉**，不插占位符。
→ 沉淀：**「骨架一致性」断言（`src` 把 5 块换成占位符 == `new` 把 5 块换成占位符）比逐条计数更强**，能一句话证明「除了这几块啥都没动」；但**必须处理「新串为空（纯删除）」的情形**。

**备份**：`F:\trash\20261010-160155_wa_cta\`（补丁 45 断言）。源码复核：`<form` 0、`wa.me/8618818994346` 2 处（HTML href + JS `WA_BASE`）、941 行全 CRLF、无 `\r\r\n`。

**未铺开**：其余 21 个产品详情/列表页与其 4 语对应页**仍是邮件表单**。若要铺开这套 WhatsApp CTA，**zh 页必须改用 `+8619020586646`**。

---

## 英文三个产品汇总页 · 手机端排版规则（2026-10-12 起）

适用：`src/pages/en/products.astro`、`products-svg.astro`、`products-asvg.astro`（三页这段 CSS 必须逐字同源）。

### 1. 左侧栏（Filter / Contact / 公司卡 / 3 张跨系列卡）
- `<aside class="n_left hidden lg:block lg:w-[340px] lg:shrink-0">` —— **<1024px 整块不显示**（用户裁定）。
- 断点取 `lg` 而非 `sm/md` 的理由：父容器就是 `flex flex-col lg:flex-row`，两栏布局只在 ≥1024 存在。
- 已知后果：手机端**没有**筛选项、没有 Inquire Now、没有侧栏 Contact 与公司卡，且**无替代的移动端筛选入口**。
  将来若要「折进抽屉/折叠面板」，只改这一处开关即可。

### 2. 列表视图（点 Download 或列表图标触发）卡片
- **<640px**（`@media (max-width: 639px)`）：
  - 缩略图 `240×150` → **104×104**（`align-self:flex-start`、`margin: .75rem 0 .75rem .75rem`、`border-radius:.5rem`）
  - 文字内距 `1.25rem` → **.75rem**；标题锁 15px；`cbp-tag` 10px / 1px 6px；`my_more1` 13px；`cbp-dl-btn` 12px
  - `.cbp-vm-view-list .cbp-vm-dl { display: contents }` —— 让 3 颗下载按钮**直接参与** `.cbp-vm-actions` 的
    flex 换行，与 View More 合成一行自然折 2 行（不必给 dl 组单独算宽）
- **≥640px**：与桌面完全一致（缩略图 240×150、横排、垂直居中）。

### 3. ⚠️ 两条不许删的通用规则（去掉就会在 640~679px 裁按钮）
```css
.cbp-vm-view-list .cbp-vm-li .text { flex: 1; min-width: 0; }   /* 原只有 flex:1 */
.cbp-vm-view-list .cbp-vm-dl { flex-wrap: wrap; }
```
根因：flex 项默认 `min-width: auto` → 被 `.cbp-vm-dl` 那个 inline-flex 的 **min-content（374px）** 钉死，
文字列不肯收缩 → 640px 处卡片溢出 40px、Device Manual 右缘被 `overflow:hidden` 裁掉 19px。
**只加 `min-width:0` 不够**（按钮组本身不可断行），两条必须成对。此缺陷在 2026-10-12 之前就存在。

### 4. ⚠️ 既有缺陷（未修，待用户定）
390px 下三页**都有页面级横向滚动**：`documentElement.scrollWidth = 456 > clientWidth 390`，
且 grid 视图与 list 视图**数字完全相同** → 与卡片 CSS 无关。越界元素两类：
① `.cbp-vm-options > nav.ml-2.flex…`（AHF / SVG / ASVG 系列切换 tab）右缘 456；
② 头部 `.contact-info` 条里的 span，右缘 503 / 531（**5 语言共享组件**，改动需另评）。

