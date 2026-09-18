# 产品页施工规范（CHITEK）

> `MEMORY.md` 的拆分文件：**动任何产品页之前必读**。模板 = `src/pages/en/products/sic-ultra-ahf.astro`，复制新页照抄。

## 结构
- 面包屑通栏（在 `lg:flex` **外**，居中 `mx-auto max-w-7xl px-6` + `mt-[72px]`）→ flex 内左列 `<aside class="hidden lg:block lg:w-[140px] shrink-0 border-r">` + `nav.sticky top-[72px]`（标题固定 `PAGE GUIDE`）→ 右列 `<div class="flex-1 min-w-0">`。手机另有 `lg:hidden sticky top-[72px]` 横向 nav（共 2 个 section-nav）。
- **正文容器必须左贴边**：`<div class="max-w-none px-3 lg:pl-6 lg:pr-10">`（用 `mx-auto max-w-7xl` 会在 flex 列里再居中）。改一处要所有 section 一起改。侧栏右缘 = 正文左缘 x=140。
- **4 个分节**：`#overview`（顶部 configurator + 图轮播，`scroll-mt-[72px]`）/ `#description` / `#parameters` / `#faq`（后三者 `scroll-mt-[120px]`）。侧栏+手机 nav 各 4 项。3 个 h2 全部 `text-left`。

## 字体（2026-09-18 审计，报告 `docs/_ref/products-font-audit-2026-09-18.md`）
- 全站**只有 2 个字族**：`Barlow`（正文，`--font-barlow`）/ `Barlow Condensed`（标题，`--font-barlow-condensed`）。惯例：**h1/h2 用 Condensed；卡片标题 h3/h4 用 Barlow**。
- 表单控件（input/textarea/button）**不需要**写字体类：Tailwind v4 preflight 已设 `font: inherit`（contact/news 里的 `font-[inherit]` 属冗余、无害）。
- ✅ 7 个 products 页字体族**全部合规**（无外来/系统字体、无 Google Fonts、无页面级 `@font-face`）。
- ⚠️ **唯一不一致（2026-09-18 用户裁定：不予处理，勿再提）**：`en/products/active-harmonic-filter.astro` L303/315/327/339/351 的 5 张产品系列卡标题用 **Condensed**，5 个列表页同概念卡用 **Barlow**。
  - **用户裁定**：「讨论只基于英文版；没有用其它字体就不用管」。即：判定标准只有一条 —— **是否用了 Barlow / Barlow Condensed 之外的字族**。两者之间选哪个不算问题，不再对齐、不再报告。
- ⚠️ `en/products.astro` 与 4 个兄弟语言列表页**结构不同**（英 = 带筛选侧栏旧版、仅 1 个 h2；其余 = 带 Tab + 产品系列区新版、13 个 h2）→ 其 Condensed 计数低（8 vs 36）属结构差异，不是字体问题。
- 核查方法：**必须**用 Playwright 读 computed style。静态扫 `class="font-*"` 会漏掉继承链与表单控件；且探针若只取「有 textContent」的元素会**漏掉 input/textarea**（textContent 为空），需单独再扫一遍控件。

## 参数表
- `text-[clamp(12px,0.9vw,13.5px)] leading-tight`；32 个单元格 `py-1.5 px-4 pr-10`；左侧标签列 `w-1/6`。
- ⚠️ 改列宽必须同时去掉另 15 个 `<th>` 的 `whitespace-nowrap`（`<td>` 的保留）。
- `#parameters` 容器右内边距单独 `lg:pr-[clamp(40px,8vw,160px)]`。

## Related Products
- 4 张同显自动轮播：`[prev]` + `[data-rel-viewport] flex-1` + `[next]`；track `gap-10`（40px）、卡 `w-[calc((100%-7.5rem)/4)]`（1440 视口实测 **253px**）、img `aspect-square`；**只有标题、灰色无描述**；6s 自动循环、hover/滚出视野暂停、箭头无终点禁用态。
- JS 步长 = 运行时 `cards[1].left - cards[0].left`（含 gap，自动适配）。
- ⚠️ 断言 `data-rel-*` 前先切出 section 片段（底部 JS/`<style>` 里有同串）。
- 图片源只有 3 张真图循环复用，8 个产品名是占位。

## 滚动高亮
- 确定性 `pick()`（`top-(72+120)<=0` 的最后一节；滚到底强制末节）+ rAF。**不要 IntersectionObserver**。高亮样式 `:global(.js-secnav.is-active)`。

## 顶部 configurator
- Voltage 208/400/480/690V · Current 50/75/100/150/200A · Connection 与 Installation 同一行 `items-start`。
- **SKU 文本框 / Quote / Download = 同一行（2026-09-18 16:5x 改）**：外层 `div.flex.flex-col.sm:flex-row.sm:items-stretch.gap-3`，
  表单 `class="m-0 flex-1 min-w-0"` 占满剩余宽，Download 为兄弟节点 `shrink-0`，三者 **等高对齐**。
  - 高度来源：textarea `rows=2 py-1.5 leading-tight border` → **47px**；`sm:items-stretch` 让 Download 由 40px 被拉到 **47px**。
  - 实测（1440）：textarea/Quote/Download 的 top=667、bottom=714、h=47，`delta=0`；左栏高 610→**558**（右侧图卡 548，原先左栏比它高 62px → 现在只差 10px）。
  - 改前：Download 单独一行（`<div class="flex ... mt-3">` 包着、`mt-3`=12px）→ 白占 52px 竖高，左栏明显比右栏长出一截。
  - ⚠️ 移动 Download 时**别把它塞进 `<form>`**（见下条 reset 保护）；本次只改外层包裹，`data-download-config` 仍在 form 外。
  - textarea `rows=2 py-1.5 leading-tight block h-full`，内右侧绝对定位橙色 **Quote（`<button type=submit>`）** 满高（`top-0 bottom-0`）。
- **Quote = 站内直发询盘**（与 contact 页 Send Message 同功能，不是跳转）：外包 `<form name="quote" method=POST data-netlify netlify-honeypot="bot-field" data-lead-form>` + `form-name` 隐藏域 + `[data-utm-fields]` + `bot-field` 蜜罐；textarea 带 `name="message"` 并预填 SKU；成功块用 contact 同款 **`[data-form-success]`** 契约（analytics.js 原生识别，勿自造属性名）。
  - ⚠️ **Download 必须在 `<form>` 之外**：`showSuccess()` 会禁用 form 内全部 button。
  - ⚠️ **`showSuccess()` 末尾会 `form.reset()`**，只读 textarea 的 SKU 被清空，且 reset 在 fetch resolve 之后 → 需 submit 存快照 + **100ms 轮询约 10s 回填**，`setTimeout(…,0)` 无效。

## SKU
- `SKU: CHITEK-SiC-AHF-{a}-{v}-{i} · 500 × 550 × {d} mm · {kg} kg · 1300$(EXW)`；
- `SPECS={50A:{d:150,kg:21},75A:{142,24},100A:{135,27},150A:{100,31},200A:{118,38}}`、`DEF={v:'400V',a:'100A',i:'Rack'}`。
- ⚠️ `build()` 必须在脚本末尾额外裸调一次；1300$ 是固定后缀。

## 顶部右侧 3 图轮播
- 保持 `items-start` + 主图 `max-h-[400px]`，**不要用 `items-stretch`/`lg:h-full`**（两栏互相撑高）。

## 汇总页 `en/products.astro`
- **顶部吸附 Tab 栏已删除（2026-09-18）**：原 `#sticky-tab-bar`（`sticky top-[72px]`，滚过 hero 后浮出，含 Active Harmonic Filter / Static Var Generator 两个按钮）已整块移除，连同末尾 `===== Sticky Tab Bar =====` 的 scroll 监听（那段是**未加空值守卫**的 `stickyBar.style.*` → 只删 HTML 不删 JS 会立刻 `TypeError`）。
  - ⚠️ **只有 en 删**：en 页没有 `.tab-panel` 标签页实体（`class="tab-panel` 命中 0），该栏纯装饰；**zh/es/ar/pt 有 10 个 `.tab-panel` 实体**，那根栏是 **AHF↔SVG 唯一的切换入口**，删了就没法切产品系列 → 动之前先确认用户要删哪个语言。
  - 残留死代码（无害、故意保留）：`document.querySelectorAll('.sticky-hero-tab')` 3 处 forEach、`navigateToProduct()` 里的 `btn.click()`（有 `if (btn)` 守卫）、`activeSeriesPanel()` 里的 `.sticky-hero-tab.bg-brand-orange`（`t ? ... : '0'` 有守卫）。
  - 验证：served HTML `sticky-tab-bar`=0 / `sticky-hero-tab`=0；Playwright 1440×900 滚到 1600 无浮出白条（唯一 fixed 元素是全局 Nav，正常）。
- Filter 四组 Voltage5/Current3/IP6/Dimensions4（卡带 `data-v/a/i/s`）；**加勾选项必须同时给每张卡补 data-\***。
- `filter_card` 内含询盘 textarea + 橙色 `Inquire Now`（2026-09-18 用户从 Contact Us 卡挪进来的；Contact Us 卡现在只剩 WhatsApp + 邮箱）。
- **产品卡 = 9 张（2026-09-18 定：原有 7 张，当日 16:35 加 `SiC-Fanless…`、16:40 加 `IP65 Active Harmonic Filter`；16:52 九张全部配齐真图）**，全部对齐页内 **Product Matrix 系列**（`seriesList`：`U=Ultra-Slim / D=Distributed / A=Anti-Pollution / C=SiC / L=Standard`）：
  1. `Silicon Carbide MOSFET Active Harmonic Filter SiC AHF`（**C**）
  2. `Anti-Pollution Active Harmonic Filter AHF`（**A**）
  3. `Ultra-slim Active Harmonic Filter AHF`（**U**）
  4. `Distributed Active Harmonic Filter AHF`（**D**）
  5. `Rack mounted Advanced Harmonic Filter`（**2026-09-18 由 `Wall mounted Advanced Harmonic Filter` 改名**；同批改了左栏 New Products 同名项 + 内页 `sic-ultra-ahf.astro` 相关产品列表 2 处）
  6. `IP65 SiC-Fanless & Low Noise Active Harmonic Filter`
  7. `IP65 Active Harmonic Filter`（16:40 新增）
  8. `SiC-Fanless & Low Noise Active Harmonic Filter`（16:35 新增）
  9. `Advanced Active Harmonic Filter`
  左栏 New Products 前两项同步。
  - ⚠️ **新增卡三件套**（缺一不可）：① `<li class="cbp-vm-li">` 要有 `data-v/a/s/i`（否则筛选逻辑收不到它）；② **插入位置**：紧挨同类卡插，别追加到末尾（本次两张新卡都插在 IP65 系后面）；③ tags 沿用相邻同类卡的（**不自己造关键词**），并在回复里说明「tag 是沿用的，要改给词」。
  - 已删卡名（**勿再出现**）：Active Harmonic filters and Power Optimizer / Active Harmonic Filtration System / Even and Odd Harmonic Filters / Power Quality Filter PQF / Active Harmonic Compensation Filter。
  - 源串里 `&` 一律写 **`&amp;`**（alt 属性 + 文本各一处），渲染才是 `&`。
  - ⚠️ **改名的替换必须带定界符**：旧名常是别的卡名的子串（如 `Active Power Filter APF` ⊂ `Horizontal Rack Active Power Filter APF`）→ 用 `alt="…"` / `>…</a>` 锚点，禁用裸串 replace。另：新名 `… Active Harmonic Filter AHF` 是多个新名的公共子串 → 查残留只能用「定界符 + 总数」。
  - ⚠️ 用户原文写 `Sic AHF`，实作为 **`SiC AHF`**（正确化学符号，与站内一致）；要改回一句话。
  - ⚠️ **增删卡后必查筛选项命中**：删卡会让 checkbox 变 0 命中的死选项。`800V` 是当前唯一 0 命中项（**保留未动**，等用户定删选项还是标卡）。回归脚本里有 `[info] 0 命中的筛选项` 诊断行。
  - ⚠️ **筛选 checkbox 的现值是 `208V/400V/480V/690V/800V`**（不是 220V！空跑断言写 220V 会假失败）；IP 组 `IP20/30/40/54/55/65`。
  - ✅ **tag 已按产品名重做，并扩到「每卡 8 个」（2026-09-18 17:1x 先做 3/卡；18:2x 用户要求扩到 8/卡）**：
    9 张卡 × **8 tag = 72 个，全局唯一无重复**（每卡内部也无重复）。
    - ⚠️ **tag 的显示规则（关键）**：`grid 视图隐藏、只有 list 视图显示` —— 见 CSS
      `.cbp-vm-view-grid .tags_ul, .cbp-vm-view-grid .my_more1 { display:none }`。
      **改 tag 后验证必须切到列表视图**（点 `[data-view="cbp-vm-view-list"]`），在网格视图下看不到任何变化。
    - ⚠️ **`div.tags_ul` 那行缩进是 36 空格（历史遗留，与其他行不一致）** → 用 Edit 时必须照抄，否则匹配失败。
      标签行缩进 20 空格、`</div>` 18 空格。
    - ⚠️ 3-tag 时代卡6/卡7/卡8 曾共用同一组 tag（会撞重复）→ 现在 8/卡 已全不重复，可直接以 `tags_ul` 块为锚点改。
    - ⚠️ **8 个 tag 后列表行会换行**：实测 `tags_ul` 高 **51px（2 行）或 80px（3 行）**，整行 `li` 高 184–199px。
      列表是 `flex-direction:column`，**各卡行高不必相等**（正常，非 bug）。
    - **覆盖要求（用户点名）**：整表覆盖 **AHF / ADF / APF**。8-tag 版实测：**AHF 21 个、ADF 6 个、APF 9 个**。
      ADF = **Active Dynamic Filter**（不是别的），APF = Active Power Filter。
    - 词表（8/卡）：
      | 卡 | tags |
      |---|---|
      | SiC MOSFET AHF | SiC MOSFET AHF ｜ Silicon Carbide Active Harmonic Filter ｜ Ultra High-Efficiency SiC AHF ｜ SiC Active Power Filter APF ｜ Wide-Bandgap AHF Module ｜ 3-Phase SiC Harmonic Filter ｜ High-Efficiency Power Quality Filter ｜ Industrial SiC Harmonic Compensation |
      | Anti-Pollution AHF | Anti-Pollution AHF ｜ Dust-Proof Active Harmonic Filter ｜ Harsh-Environment AHF Module ｜ Anti-Corrosion Harmonic Filter ｜ Dust-Resistant APF Module ｜ Heavy-Duty Active Harmonic Filter ｜ Pollution-Proof Power Quality Filter ｜ Anti-Pollution Active Dynamic Filter ADF |
      | Ultra-slim AHF | Ultra-Slim AHF ｜ Slim Active Power Filter APF ｜ Compact 1U AHF Module ｜ Low-Profile Harmonic Filter ｜ Space-Saving Active Harmonic Filter ｜ Slimline Active Dynamic Filter ADF ｜ Ultra-Thin Power Quality Filter ｜ Thin Rack AHF Module |
      | Distributed AHF | Distributed AHF ｜ Active Dynamic Filter ADF ｜ Modular Active Harmonic Filter ｜ Distributed Harmonic Compensation Unit ｜ Cabinet-Mounted AHF Module ｜ Small-Capacity Active Harmonic Filter ｜ Distributed Power Quality Filter ｜ Multi-Module APF System |
      | Rack mounted AHF | Rack mounted AHF ｜ 19-Inch Rack Active Harmonic Filter ｜ Rack Type AHF Module ｜ Rack-Mounted Harmonic Filter ｜ Rack APF Module ｜ Rack-Mounted Active Dynamic Filter ADF ｜ Rack Harmonic Filter Module ｜ Rack-Mounted Power Quality Filter |
      | IP65 SiC-Fanless AHF | IP65 SiC-Fanless AHF ｜ Low-Noise Active Harmonic Filter ｜ Outdoor IP65 AHF Module ｜ IP65 Fanless Harmonic Filter ｜ Weatherproof SiC AHF ｜ Waterproof Active Harmonic Filter ｜ Silent AHF Module ｜ IP65 Active Dynamic Filter ADF |
      | IP65 Active AHF | IP65 Active Harmonic Filter ｜ Weatherproof AHF Module ｜ IP65 Active Power Filter APF ｜ IP65 Harmonic Filter Cabinet ｜ Outdoor Active Harmonic Filter ｜ Waterproof APF Module ｜ IP65 Power Quality Filter ｜ IP65 Harmonic Compensation Unit |
      | SiC-Fanless AHF | SiC-Fanless AHF ｜ Fanless Active Dynamic Filter ADF ｜ Low-Noise SiC AHF ｜ Fanless Harmonic Filter Module ｜ Silent SiC APF Module ｜ Natural Cooling Active Harmonic Filter ｜ No-Fan AHF Module ｜ Low-Noise Power Quality Filter |
      | Advanced AHF | Advanced AHF ｜ Active Harmonic Filter Bank ｜ Advanced Active Power Filter APF ｜ Harmonic Filter Panel ｜ Advanced Harmonic Compensation Unit ｜ Multi-Function Active Harmonic Filter ｜ Active Harmonic Filter System ｜ Advanced Power Quality Filter |
    - 已废弃的旧 tag（勿再出现）：`Active Harmonic compensation` / `Electrical harmonic filter` /
      `Harmonic distortion filter` / `Wall mounted AHF module` / `Rack type AHF module` / `Rack type APF module` /
      `Horizontal Rack APF module` / `Active filter 30A module` / `3 phase active filter` / `Dynamic harmonic correction`。
      **这同时解决了旧遗留项「卡2/卡5 的 tag 仍写 `Wall mounted AHF module`」**。
    - 📌 范围：**只有 en 改了**；zh/es/pt/ar 四语的 products 页 tag 未同步。
  - ⚠️ **改产品名要全站一起改**：`Rack mounted Advanced Harmonic Filter` 除汇总页（卡 img alt + 卡 h3）外，
    **内页 `en/products/sic-ultra-ahf.astro` 还有 2 处**（相关产品列表的 img alt + h3）。别只改汇总页。
  - 📌 **2026-09-18 18:2x 用户自行改动（非我改的，已核对一致）**：
    ① 卡5 名字由 `Rack mounted Advanced Harmonic Filter` → **`Rack mounted Active Harmonic Filter`**，
    已在 `products.astro`（img alt + h3）与 `sic-ultra-ahf.astro`（相关卡 img alt + h3）**共 4 处同步**，无残留。
    ② 左栏由旧的「New Products」列表改成 **「Product Categories」6 项分类导航**
    （`Active Harmonic Filter (AHF)` / `Static Var Generator (SVG)` / `Silicon Carbide AHF/SVG` / `Distributed AHF` /
    `Anti-Pollution AHF` / `Advanced Static Var Generator (ASVG)`），**不含图片** →
    旧遗留项「左栏 New Products 仍是旧名单/占位图」**已由用户解决**。
- **卡片配图现状（2026-09-18）**
  - **图框尺寸（现状，1440 视口实测）**：网格视图 `.cbp-vm-view-grid .cbp-vm-image{aspect-ratio:1/1}` = **正方形**（2026-09-18 用户要求）→ **一行 4 个、卡片外框 216px / 图框 214×214**、`gap: 2.5rem`(40px)。
  - ⚠️ 图框宽比卡片外框小 2px（卡片左右各 1px 边框）→ 断言别写成 `图框 == 卡宽`。
  - 网格列数断点：默认 1 列 / ≥640 两列 / ≥768 三列 / **≥1024 四列**。
  - 调参史（用户手感，均为 1440 视口）：4 列+20px(229) → 5 列+28px(174，嫌小) → 4 列+32px(222) → **4 列+40px(216，定稿)**。倾向「卡片别太窄、留白要足」。
  - 列表视图 `.cbp-vm-view-list .cbp-vm-image{width:240px;height:150px}` 不变；基础规则仍留 `aspect-ratio:4/3` 兜底。`img{object-fit:cover}` 两种视图都生效。
  - **新配图建议直接做 1:1 正方形白底画布**（网格视图零裁切；进列表视图 8:5 会裁上下，但留白多所以无感）。
  - ✅ **9 张卡已全部配齐真图（2026-09-18 16:52 完成，网格占位图 = 0）**。占位图 `/assets/images/index-product-ahf.webp`（**709×1155 竖图**）**只剩左栏 New Products 的 4 个缩略图**还在用。
    ⚠️ 该占位图是**全站通用图**（news 的 og:image、首页 product-visual、`Nav.astro` 飞出卡、多张详情页都在引用，全仓 ~90 处）→ **绝对不能覆盖/改名**；给某张卡换图必须走**新文件名 + 精确改该卡 `src`**。
    ⚠️ 网格里 9 张图是 **9 个互不相同的文件**（配完可断言 `distinct == 9`、`placeholder == 0`）。
  - 卡1 SiC 已换真图 `/assets/images/products-ahf-sic.webp`（**1200×1200 正方形**，q82，31.2KB；源 = ChatGPT 生成的 1699×926 横图，已归档 `F:\projects\pic\pic\SiC-AHF-2U.jpg`）。左栏同款缩略图（56×56）同步换。
  - 卡2 Anti-Pollution 已换真图 `/assets/images/products-ahf-anti-pollution.webp`（**1200×1200 正方形**，整幅不裁剪，q82，**37.4KB**，源 = `F:\projects\pic\pic\3U.png`）。左栏同款缩略图（56×56）同步换。
  - **卡 → 图 映射进度（2026-09-18 16:22）** —— 站点文件名一律 ASCII，源图在 `F:\projects\pic\pic\`（webp 产物在同目录 `webp\`）：

| # | 卡名 | 站点文件 | 源图 | 状态 |
|---|---|---|---|---|
| 1 | Silicon Carbide MOSFET AHF | `products-ahf-sic.webp` | ChatGPT 生成图（归档 `SiC-AHF-2U.jpg`） | ✅ |
| 2 | Anti-Pollution AHF | `products-ahf-anti-pollution.webp` | `3U.png` | ✅ |
| 3 | Ultra-slim AHF | `products-ahf-ultra-slim.webp` | `1U导轨式-黑色.png` | ✅ |
| 4 | Distributed AHF | `products-ahf-distributed.webp` | `2U壁挂.png` | ✅ |
| 5 | Rack mounted Advanced Harmonic Filter（原 Wall mounted） | `products-ahf-rack-mounted.webp` | **`导轨带屏.png`**（2026-09-18 16:45 由 `4U导轨式-黑.png` 换掉；3U 黑机架 + 前面板彩色屏 + 两侧提手 + 前后导轨耳） | ✅ |
| 6 | IP65 SiC-Fanless & Low Noise AHF | `products-ahf-ip65-fanless.webp` | `自然风冷-IP65.png`（白壳 IP65 + 散热齿，**无风扇格栅**，符合 fanless） | ✅ |
| 7 | IP65 Active Harmonic Filter | `products-ahf-ip65.webp` | `高防护IP65.png` | ✅ |
| 8 | SiC-Fanless & Low Noise AHF | `products-ahf-sic-fanless.webp` | `自然风冷-.png`（白壳 + 3 个蜂窝风扇格栅） | ✅ |
| 9 | Advanced Active Harmonic Filter | `products-ahf-advanced.webp` | **`4U导轨式-灰.png`**（4U 灰白机架 + 顶部橙色 V 形条 + 前面板黑色方屏 + 两侧蜂窝散热网 + 双提手） | ✅ |

  - ⚠️ 用户口述「图名」时说的**可能是 `webp\` 里转好的成品名**（例：说「2U壁挂」指的是 `webp\2U壁挂.webp`），顺手贴过来的却常是源 PNG。两者**内容相同**，直接用 `webp\` 成品即可（本次两例逐像素比对均值差 <0.7 = 同一张）。

  - 左栏 New Products：SiC ✅ / Anti-Pollution ✅ / Wall mounted ⬜ / Active Harmonic Filtration System ⬜ / Power Quality Filter PQF ⬜ / Active Harmonic Compensation Filter ⬜。
  - 候选源图（`webp\` 里已备好 1200×1200）：1U壁挂、2U-30K-新、2U壁挂、2U按键屏白/黑、4U壁挂式-新、4U导轨式-灰/黑、4U立式灰色无LOGO、壁挂带屏、~~导轨带屏~~（16:45 已用于卡5）、~~4U导轨式-灰~~（16:52 已用于卡9）、成套柜、成套柜-正面、自然风冷-、自然风冷-IP65、高防护IP65。
  - ⚠️ **「同一张卡换图」的既定做法（2026-09-18 卡5 实践）：沿用同一个站点文件名、只换字节**。
    理由：卡名没变 → slug 语义仍正确；`src` 不动 → 零 .astro 改动、不会漏掉其它引用点（先 `grep products-ahf-<slug>` 确认引用数）。
    代价：URL 不变，有缓存风险 → **必须做「HTTP 字节 md5/长度 与磁盘比对」验证**（dev 端 `Cache-Control: no-cache`，实测字节一致）。
    安全网：动手前把旧站点文件 `Copy-Item` 到 `F:\trash\<日期>_<slug>-img-swap\`（旧图在 `pic\webp\` 里也另有原件，可重跑复现）。
  - 生成方式：Pillow **整幅等比 contain** 进 **1200×1200 正方形**白底画布（一个像素都不裁）→ `WEBP q=82`。⚠️ 用户 2026-09-18 明确**不要裁剪**白边，且**必须正方形**（曾做过 1200×900 版，被否）。

## 两待决缺陷（勿擅改）
1. `products-hero.webp` 是近全白空白图（AHF 内页仍用）。
2. 英文详情页仅 en 存在，`BaseLayout` 默认 `alternates=true` → 输出 4 条坏 hreflang（一行 `alternates={false}` 可修，站点级决定未动）。

## 回归
- `_verify_products_e2e.py`（86 断言，`CHITEK_BASE` 可覆盖基址）；断言失败先查 DOM 而非代码（用户会手改页面）。
- ⚠️ **断言不要用 `document.querySelectorAll('section[id]')` 数分节**：共享 Sidebar/Footer 也可能带 `<section id>`，且 dev 热重载瞬间会返回新旧混合的 DOM（实测同一 URL 一次 4 个、一次 8 个）。分节断言应**由侧栏 nav 的锚点反推**。

## 待办
- zh/es/ar/pt 兄弟产品页**未同步** en 的全部改动（configurator/SKU/侧栏/轮播/分节重组）。
