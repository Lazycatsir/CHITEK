# CHITEK 长期记忆（MEMORY.md）

> **只放索引 + 硬规则 + 已裁定；明细一律下沉 MEMORY_DETAIL.md。**
> 规范：`PRODUCT_PAGE_SPEC`｜`SITE_SKELETON_SPEC`｜`ENGINEERING_SPEC`｜`SEO_SPEC`｜`SEO_GEO_FRAMEWORK`｜`NEWS_SPEC`｜`GEO_OFFSITE`｜`SOCIAL_MEDIA`｜`MEMORY_DETAIL.md`（§1–12 配方、§13-A~E 查表、§14 10-21、§15–18 360°/顶部对齐、**§19-A~C 10-26 下沉**）｜逐日 `YYYY-MM-DD.md`（30 天后蒸馏）。
> 搜索手册：源 = `SEO_GEO_FRAMEWORK.md`/`GEO_OFFSITE.md`/`SOCIAL_MEDIA.md` + `00_中转站/AHF_SVG_Keyword_Matrix.html`，由 `00_中转站/build_doc_site.py` 合成 `docs/SEO_GEO_FRAMEWORK.html`。**改 .md 源再跑脚本**。英文站文档 `docs/en-site/`。

## 沟通与流程
- 用户非 SEO 出身：术语 = 定义 + 类比 + 今天能做的一步。
- 省略式指令先问对象；「A 应和 B 一致」先定基准；「多/少」先问加删；口径先问「统一成哪个值」（用户裁决）；动「像 bug」处前先查「已裁定」。
- 计划只写「优先级→依赖→验收清单」。默认不提交 Git（说「提交」才 commit/push）。
- **绝不**对含未提交工作的文件跑 `git checkout -- <file>`（09-29 抹掉整 session）→ 用 `backups/*.bak_*` 或 `git stash`。
- SSR + 渐进增强验两层：① 服务端标记 ② 真实浏览器点击（`chromium.launch({channel:'msedge'})`，无 CDP 也能跑）。`is:inline` 脚本 HMR 不重跑 → 老按钮失绑。**绝不碰用户已有 tab**。
- 单问单答：问「某一项是多少」只测当前视口一个点。
- 🩸 Bash 里写中文长文本别用双引号 + 反引号（反引号被当命令替换）→ Write 写 `.py` 再执行。

## 环境铁律
- Astro 6.x + Tailwind v4 + Netlify；zh/en/es/ar/pt 五语（新闻四语）。禁内联 style。Nav = fixed `h-[72px]` → 首元素自加 `mt-[72px]`；Nav 文字色五语统一 `#333333`。
- 字体：en/es/pt = OPPO Sans(Latin)；zh = OPPO Sans SC(CJK)；ar = Barlow。Astro 表达式属性必须 `href={lp('...')}`。
- **行尾**：写入一律 `newline=''`；`\r\r\n` → Tailwind v4 报错 → 整页 500。**改前先量 CRLF 数、别假设**。
- dev：`node node_modules/astro/bin/astro.mjs dev --root D:/download/CHITEK --port 4399`（首次 ready 可能 5 分钟+）。`src/data/*.js` 会热加载，`is:inline` 脚本/样式不重跑 → 拿不准就重启。**HTTP 会撒谎**（dev 已死时 urllib 返 502）→ 以「无 LISTEN」判死；绕代理 `ProxyHandler({})`；无 `--host` 只绑 `[::1]`。
- 多会话并行：动前查 `_dev_*.log` mtime 与端口，**别杀别人的 4321**，自己起 4399/4412；外部改动触发 Vite 全量重载 → 循环 reload → 进程退出。
- `astro build` 被 safe-delete shim 拦 → 用 dev 冒烟。功能按钮一律 `<button type="button">`，禁 `<a href="#">`。Python 脚本别把 Windows 路径写进普通 docstring（`\U` SyntaxError）；批量删文件用脚本 + `os._exit(0)`。
- 「div 净差 0」≠ 结构正确：要看每段 `<section>` 边界的 div 深度序列。横向溢出含 shrink-to-fit 形态、部署白名单、hero 配方见 **§19-C**。

## 硬规则 / 已裁定（详见 SITE_SKELETON_SPEC）
- 每页唯一 H1；UI 标签不用 H1–H6（用 `<p>`）；FAQ 问句与 FAQPage 逐字同源；全站禁功能性 `href="#"`。三条操作配方（DETAIL §1–§3）：区域文字色统一 / 小标题字号统一 / clamp 三段式判读（交叉点 ≈1217px）。
- ⚠️ **P0-2 未决**：Footer 第 90/100/111 行三个栏目名是 `<h4>` → 约 60 页 H2→H4 跳级（A 换 `<p>` / B 换标签+补 leading，待选）。
- **阻塞**：邮箱 + 公司地址（隐私政策 / Footer / 死链修复全靠它）。站内主邮箱 `leo.li@chitek-inno.com`。
- SEO 铁律（10-14）：Google 收录基准 = **移动版** → 移动版缺的内容/内链/schema = 没有；tab 文字照收，「点击后 JS 拉取」的不收；CWV 只看移动端。**Bing 设备无关单一索引**；**AI 爬虫不执行 JS**。「seo 骨架 html」= `docs/SEO_GEO_FRAMEWORK.html`，**不是** `docs/seo-skeleton/`。
- 品牌橙 = `#EA511E`（`-dark` #C43B13、`-light` #EA724E）。各页自带色板 10-10 **有意未统一**。Logo = `public/assets/images/logo.webp`。
- 🔒 **已裁定全表（站点结构 / 视觉·首页 / 产品页与 SKU）全部下沉 `MEMORY_DETAIL.md` §20-A~C**。改动「看着像 bug」的地方前先查表；表里有的就是用户裁决过的口径，**别重新提议**。

## SKU 三线价格（10-26 定稿，明细 §19-B）
- 三源文件：`src/data/ahfSku.js` / `svgSku.js` / `asvgSku.js`，共用 `src/data/sku.js`。**`price: null` 才是未定价**（渲染 `？？`）；数字 `0` 被真值判断当成「Price on request」。
- **AHF = 绝对值**｜**SVG = kvar 价表**（`byVoltage` 分 400V/480V 两套；`sic-ultra-svg` = `anti-pollution-svg` ×2）｜**ASVG = AHF 同档 −20**（`_asvg_price_from_ahf.py [delta]` → `sku-prices-asvg.json` → `_apply_sku_prices.py`）。具体数字见 §19-B。
- 配置器三处默认值必须同值：`rows` 的 `defaultCurrent`、页内 `var DEF.a`、`_build_sku_table_ahf.py` 的 `DEFAULT_CFG`（只改前两处，首帧会被 `build()` 覆写）。`rows` key 必须与 `data-group="a"` 的 `data-val` 一一对应。
- 改数据后必跑 `_gen_sku_ledger.py` 重建三本台账 `docs/sku-table-{ahf,svg,asvg}.html`；回归 `_check_sku_table.js`（24 页 × 3 断点 = 72）+ `_check_sku_page.js <slug> <chip,...>`。台账服务 `python _sku_ledger_server.py`（8899，用户没让起就别起）。⚠️ chip 是 checkbox 语义，**连点两次 = 取消选中**。
- ⚠️ 未定：`ip65-svg`/`ip65-sic-fanless-svg` 价格仍照抄 AHF，其 kvar（67/17）无价目可依。
- **全站价格审计 = `python _audit_site_prices.py`**（以 3 个 js 为唯一源，抓 24 页真 SSR：`[data-summary-price]` 首屏 / `[data-sku-table]` JSON / `var FALLBACK` / 页面所有 `Estimated N$(EXW)`，再查 3 本台账输入框 + `ASVG=AHF−20`、`SiC SVG = 2×` 两条口径）→ 期望 24/24 + 3 台账 + 2 口径全 OK。**价格只存在于 24 个 en 详情页**，其他语言页与 JSON-LD 均无 price 字段。
- 🩸 `var FALLBACK` 是默认档的硬编码副本，曾漂移成 480V 价（6 页）→ 已统一为「400V 默认档」，`_apply_sku_prices.py` 每次写完自动调 `_sync_fallback.py`。

## 产品页 / 列表页（明细 §16.1 + §18 + §19-A/C）
- 三套详情页各 8 个共用外壳（顶部 13 处定点 + `nav[data-secnavbar]` 7 锚 + 参数表分组 + 6 条 8px 分隔带 + `#parameters`/`#faq` 两栏）；中文站 = 英文结构复制，只翻 H1 及以下。
- **命名口径**：英文汇总页 8 卡 h3 = 唯一权威源，其余 14 汇总页 / 177 详情页 rel-card / 45 侧栏卡 + Nav 三级按表对齐；中文页卡片名也是英文型号名；导航下拉 3 张短名小卡属有意简写。改卡名必跑 `_cmp_nav_cards.py`。
- **10-26 三块区域对齐 AHF（16 页已完成）**：`#parameters` 行序/标签/`pcol` 一格一值（电流容量永不 colspan）、顶部规格行取 AHF 原值、configurator chip 与默认值。⚠️ 折叠 JS 在 AHF 页 section 之外，只换 `#parameters` 会「有按钮没反应」。刻意保留：`Function`（AHF 谐波 / SVG·ASVG 无功）、`Filter Performance` vs `Compensation Performance`（值同 `up to 97%`）。残留项见 §18。
- **`#parameters` 布局（10-26 19:26 定稿）**：右边距**必须保持 `lg:pr-[180px]`**（用户明确「不能加宽卡片区域，保持右边页边距」；19:17 那版改 80 已被否决）。宽度靠内部省：列间距 `gap-x-[clamp(16px,2vw,32px)]`（空隙 73→29），表头 `pr-10→pr-2`（40→8）、值格 `pr-2→pr-[6px]`、字号 `clamp(12.5px,1.1vw,16px)`。余量：1600/1440/1366/1280/1152/1024 = 239/90/56/**14**/147/27 px（1280 最紧，改文案要复测）。同一 class 串每页出现 **3 次**，改必须按 `id="parameters"` 定位。回归 **`_check_params_scroll.js`**（24 页 × 6 断点，要求 ≥1024 零横滚）；<1024 仍横滚属预期。
- 汇总页筛选区 / 工具条尺寸 / `.cbp-vm-options` 图标统一规则 → **§19-C**（含 ≤1365 收一档、tab 必须按 href 定位）。SiC-Fanless 拆两页：`sic-fanless-*` + `ip65-sic-fanless-*`。公司中文名 = **深圳市启点新能源科技有限公司**。
- 产品图台账 `img-admin/product-images.html`（§13-B）：22 格；**安装形态只有壁挂式/导轨式**（`rack` 一律迁 `wall`）。
- 待裁决：站点图标两套 mark（`logo-head.svg` 文字 C + #FF5200 + 透明底 vs `favicon-32/64.png`+`apple-touch-icon.png` 几何 C + #EA511E + 黑底）。

## 营销工具页（10-21，10-26 换真实机型，明细 §13-D + §19-C）
- `public/pq-selector/` = 复刻 YT Electric 选型器（6 步 → AHF/SVG/混合建议 + RFQ）。**10-26 起手工维护**（`_build_pq_selector.py` 有 `--force` 守卫）；机型口径/回归 `_check_pq_machines.js`/待办见 §19-C。
- ⚠️ **站内两套尺寸互相矛盾**（矩阵 specData vs 详情页）**待裁决**；SVG 侧 `datasheetLibrary.svg` 现指向用户手册（非 datasheet）。

## 360° 查看器（全量 §15–§18 + DETAIL §17）
- 自研拖拽 + 方向键 + 全屏（`.spin360.is-zoomed`）；盒子 `aspect-ratio:1232/1000; max-height:480px`。构图两套：① 原 export + `cover`+`scale(k)`；② 预裁剪（同比例）= 零裁切，**必须同时 `max-width:591.36px; margin-inline:auto`**（卡片宽 >591 会被压扁；`.is-zoomed` 重置 `max-width:none`）。
- **gallery 两形态（10-26 全站闭合）**：① 双 360（`data-spin-base` + `spin:frameset`）= sic-ultra / anti-pollution / anti-pollution-hv / distributed / ultra-slim；② 360+静态图（`data-spin-thumb` + `data-gallery-thumb` + 隐藏 `data-gallery-main`）= sic-fanless / ip65-sic-fanless / ip65。**8 stem × (AHF+SVG+ASVG) = 24 页已一致**；工具 `_port_360_to_svg.py [--dry] [--only ...]`（按 `data-spin-base` 自动判形态）。
- 首帧：anti-pollution/hv `5_10`｜ultra-slim `5_6`｜distributed `5_9`｜ip65 `2_9`｜sic-fanless / ip65-sic-fanless `6_9`。改首帧 = 4 处（两处 `img src`、`var u,v`、`shown`）**+ 裁框按新 hero 重算**（偏 40~50px）。
- 🩸 换素材四查（`img width/height`、`max-width:591.36px`、残留 `transform:scale()`、缩略图指向）+ **各套 export 的 v 轴方向不一致**（换素材先量每行包络高度，判正面 = 数橙色屏幕像素）→ 详见 §17；`sic-fanless` 卡图视角序列里不存在（已选 `2_5`）。
- 回归：双 360 = `_check_spin_two_sets.js` / `_check_svg_360switch.js`；360+静态图 = `_check_svg_360photo.js` / `_check_spin_photo_layout.js`；对 AHF 尺寸 = `_check_svg_360parity.js`（唯一残留 = `anti-pollution-asvg` 资源卡 344 vs 323，产品名折两行）。

## Contact / Solutions
- Contact（en/es/pt/ar，zh 未动）：`Send Message` = WhatsApp（**必须 `<a data-wa-link>`**）；`<form>` 字段一字未动。其余 21 产品页 Quote 表单仍是邮件表单。
- Solutions（5 语 hub + 6 子页，纯 SSR 数据驱动）：⚠️ `en/solutions.astro` 仍 `alternates={false}`（待裁决）；zh/ar 仍缺 8 条真死链（`/solutions/{datacenter,healthcare,semiconductor,port}` 404）。

## 性能 / 资产 / 新闻 / 关键词（动手前查 §16.3 + §19-C）
- **10-26 速度优化（八项，详见当日日志）**：CSS 背景图改响应式三档（`bg-[url(X-480w)] md:…960w xl:…原图`，8 张图 45 处）｜360 缩略图走 `assets/spin-thumbs/`（592→84KB）｜导航大菜单图 `sizes=170px` + lazy（移动端不再下载 display:none 的子菜单图）｜GA4 推到 load+idle（dataLayer 队列仍同步）｜hero 补 1440w 档｜产品列表前 3 卡 eager（首张 high）｜**中文去掉 500 字重（400 声明为 `font-weight: 400 500`）**｜**首屏只轮文字、图片固定**。移动端中文首页 2387→1194KB。⚠️ 换背景图/hero 图先看这条；`dist/` 是 09-29 旧产物，部署前必须 build。
- 中文字体已子集化 `OPPOSansSC-<w>-sub.woff2`；⚠️ `-sub` 名不可去掉（`/assets/*` immutable 一年）；**大改中文文案后必须重跑 `_font_subset.py`**。`500-sub` 已不被引用（保留备回滚）。
- srcset 480w/960w 覆盖 711/941 img；换图先 `_ss_gen.py` 出变体再 `_ss_inject2.py` 注入（源图宽 >700，按整 `<img>` 标签注入）。⚠️ `-960w` 实际只有 620px 宽（全站既有，别当新 bug）。
- 产品图 1200×1200 白底 WEBP q82；占位图 `index-product-ahf.webp` ~90 处引用，**绝不覆盖/改名**。证书 01 EUTEST 02.07 过期待换。
- **体积构成（10-27 两轮清理后 public 120MB）**：`assets/spin` 88MB（68%，13 套 ×162 帧）｜`assets/pdf` 21MB｜`assets/images` 10MB｜`assets/fonts` 2MB。判「能不能删」只认 `_audit_assets.py` / `_audit_images_strict.py`（词边界匹配），**别用 `grep 主名`**（`about-industry` 是 `about-industry-manufacturing` 的前缀）。spin 必须按**目录级**判断，逐文件看全是「未引用」的假象。
- **PDF 去重（10-27）**：三份 user-manual-en.pdf md5 相同，只留 `high-protection-series-user-manual-en.pdf`，另两个名字 301 过去。⚠️ 301 必须写在 `netlify.toml` 的 `/assets/*` → 200 透传规则**之前**，否则被遮蔽成 404。⚠️ `ip65-sic-fanless-ahf-datasheet.pdf` 与 `sic-fanless-ahf-datasheet.pdf` 字节相同但属不同机型，**疑似放错文件，待用户核对**。
- 首页 hero 两套 `<picture>` + 高度公式 + `.hero-title ~ p` 坑 → **§19-C**。画册源 = `E:\video\html2doc\templates\datasheet-{en,zh}-catalog.html`（别手改 public 拷贝）；同步必须带 `public/assets/pdf/images/`（8 张 dims 图）。
- 待修：sitemap 4 条语言 404；3 个 PDF 手册 MD5 相同（删会 404）。
