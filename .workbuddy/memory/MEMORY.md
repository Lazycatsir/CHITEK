# CHITEK 长期记忆（MEMORY.md）

> **只放索引 + 硬规则 + 已裁定；明细一律下沉 `MEMORY_DETAIL.md`。** 2026-10-29 压缩，压缩前全文逐字留档在 DETAIL **§21**（任何这里查不到的细节去 §21 grep）。
> 规范：`PRODUCT_PAGE_SPEC`｜`SITE_SKELETON_SPEC`｜`ENGINEERING_SPEC`｜`SEO_SPEC`｜`SEO_GEO_FRAMEWORK`｜`NEWS_SPEC`｜`GEO_OFFSITE`｜`SOCIAL_MEDIA`｜`MEMORY_DETAIL.md`（§1–21）。逐日 `YYYY-MM-DD.md`（30 天后蒸馏进 DETAIL）。
> 搜索手册 `docs/SEO_GEO_FRAMEWORK.html` 是构建产物 = `00_中转站/build_doc_site.py` 从 `SEO_GEO_FRAMEWORK.md` + `GEO_OFFSITE.md` + `SOCIAL_MEDIA.md` + `00_中转站/AHF_SVG_Keyword_Matrix.html` 合成 → **改 .md 源再跑脚本**。英文站文档 `docs/en-site/`。

## 沟通与流程
- 用户非 SEO 出身：术语 = 定义 + 类比 + 今天能做的一步。
- 省略式指令先问对象；「A 应和 B 一致」先定基准；「多/少」先问加删；口径先问「统一成哪个值」（用户裁决）；动「像 bug」处前先查裁定表。
- 计划只写「优先级 → 依赖 → 验收清单」。默认不提交 Git（说「提交」才 commit/push）。
- 🔒 **绝不**对含未提交工作的文件跑 `git checkout -- <file>`（09-29 抹掉整 session）→ 用 `backups/*.bak_*` / `git stash`。回退单文件用 `git show HEAD:<f> > <f>`（`core.autocrlf=true`，checkout 会写成 CRLF，而工作副本是纯 LF）。
- SSR + 渐进增强验两层：① 服务端标记 ② 真实浏览器点击（`chromium.launch({channel:'msedge'})`，无 CDP 也能跑）。`is:inline` 脚本 HMR 不重跑 → 老按钮失绑。**绝不碰用户已有 tab**。
- 单问单答：问「某一项是多少」只测当前视口一个点，不顺手跑全部断点。
- 🩸 Bash 里写中文长文本别用双引号 + 反引号（反引号被当命令替换）→ 用 Write 写 `.py` 再执行。

## 环境
- Astro 6.x + Tailwind v4 + Netlify；zh/en/es/ar/pt 五语（新闻四语）。禁内联 style。Nav = fixed `h-[72px]` → 首元素自加 `mt-[72px]`；Nav 文字色五语统一 `#333333`。
- 字体：**en = 微软雅黑**（🔒 已裁定：靠「字体可用性」天然分流，Windows 桌面雅黑 / iOS+macOS 苹方 / 安卓+Linux OPPO Sans，**不加 media query**；不自托管，卡点是方正授权不是体积）｜es/pt = OPPO Sans(Latin)｜zh = OPPO Sans SC｜ar = Barlow。雅黑无 500/600/800 档。Astro 表达式属性必须 `href={lp('...')}`。
- **行尾**：写入一律 `newline=''`；`\r\r\n` → Tailwind v4 报错 → 整页 500。**改前先量 CRLF 数、别假设**。
- dev：`node node_modules/astro/bin/astro.mjs dev --root D:/download/CHITEK --port 4399`（首次 ready 可能 5 分钟+）。多会话并行先查 `_dev_*.log` mtime 与端口，**别杀别人的 4321**，自己起 4399/4412；外部改动触发 Vite 全量重载 → 循环 reload → 进程退出。**HTTP 会撒谎**（dev 已死 uri 仍返 502）→ 以「无 LISTEN」判死；绕代理 `ProxyHandler({})`；无 `--host` 只绑 `[::1]`。
- **build 能跑（10-28 破案）**：`CODEBUDDY_SAFE_DELETE_ENABLED=0 npm run build` —— 不加开关会撞两处 safe-delete shim（Vite `deps_temp_*`、`[astro:ssr-assets]` 删 `dist/.prerender/.vite/`）。加了 268 页约 80~110s，EXIT=0。
- 功能按钮一律 `<button type="button">`，禁功能性 `href="#"`。Python 脚本别把 Windows 路径写进普通 docstring（`\U` SyntaxError）；批量删文件用脚本 + `os._exit(0)`（多线程会抛 SystemExit）。
- 「div 净差 0」≠ 结构正确：要看每段 `<section>` 边界的 div 深度序列。横向溢出两种形态（含 shrink-to-fit `innerWidth > clientWidth`）见 DETAIL §19-C。

## 硬规则 / 已裁定
- 每页唯一 H1；UI 标签不用 H1–H6（用 `<p>`）；FAQ 问句与 FAQPage 逐字同源；全站禁功能性 `href="#"`。三条操作配方（区域文字色统一 / 小标题字号统一 / clamp 三段式，交叉点 ≈1217px）= DETAIL §1–§3。
- ⚠️ **P0-2 未决**：Footer 第 90/100/111 行三个栏目名是 `<h4>` → 约 60 页 H2→H4 跳级（A 换 `<p>` / B 换标签+补 leading，待选）。
- **阻塞**：邮箱 + 公司地址（隐私政策 / Footer / 死链修复全靠它）。站内主邮箱 `leo.li@chitek-inno.com`。
- SEO 铁律（10-14）：Google 收录基准 = **移动版** → 移动版缺的内容/内链/schema = 没有；tab 文字照收，「点击后 JS 拉取」的不收；CWV 只看移动端。**Bing 设备无关单一索引**；**AI 爬虫不执行 JS**。「seo 骨架 html」= `docs/SEO_GEO_FRAMEWORK.html`，**不是** `docs/seo-skeleton/`。
- 品牌橙 `#EA511E`（dark `#C43B13` / light `#EA724E`）；各页自带色板 10-10 **有意未统一**；Logo = `public/assets/images/logo.webp`；公司中文名 = **深圳市启点新能源科技有限公司**。
- 🔒 **已裁定全表**（站点结构 / 视觉·首页 / 产品页与 SKU）= DETAIL **§20-A~C**。改「看着像 bug」的地方前先查表，表里有的就是用户裁决过的口径，**别重新提议**。

## 索引：每块去哪查、怎么回归
| 块 | 入口 / 关键文件 | 明细 | 回归 |
|---|---|---|---|
| SKU 三线价格 | `src/data/{ahf,svg,asvg}Sku.js` + 共用 `sku.js`；**`price: null` = 未定价** | §19-B | `_audit_site_prices.py` |
| 产品页 / 列表页外壳、命名口径 | 三套详情页各 8 个共用外壳；en 汇总页 8 卡 h3 = **唯一权威源** | §16.1 §18 §19-A | `_cmp_nav_cards.py` |
| `#parameters` 布局 | 右边距**保持 `lg:pr-[180px]`**，宽度靠内部省；1280 视口余量仅 14px | §19-A §20-C | `_check_params_scroll.js` |
| 汇总页筛选区 / 工具条 / 图标 | `.cbp-vm-tab`、`.cbp-vm-options`（≤1365 收一档；tab 按 href 定位） | §19-C | `_chk_tabs_full.js`、`_check_toolbar_icon.js`、`_check_filter_drawer.js` |
| 360° 查看器 | 两套构图 + gallery 两形态；8 stem ×（AHF/SVG/ASVG）= 24 页一致 | §15–§17 | `_check_spin_two_sets.js`、`_check_svg_360photo.js`、`_check_svg_360parity.js` |
| 营销选型器 | `public/pq-selector/`（10-26 起**手工维护**，生成器有 `--force` 守卫） | §13-D §19-C | `_check_pq_machines.js` |
| Contact / Solutions | Contact `Send Message` = WhatsApp（必须 `<a data-wa-link>`）；Solutions 5 语 hub + 6 子页 | §5 | — |
| 性能 / 资产 / 字体子集 | 10-26 八项 + **10-30 二轮**（响应式变体接线：新闻卡 srcset、solution 卡/`about-bg` 去 xl 原图档、`index-products-bg-1440w`、360 预热整圈→±4 帧+交互触达）；`public` 约 120MB（spin 88MB） | §16.3 §19-C §21、逐日 10-30 | `_perf_audit_now.js`、`_check_spin_drag.js`、`_audit_assets.py` |
| sitemap 5 份 | `node _gen_sitemap.mjs`：zh 56 / en 80 / es 56 / pt 14 / ar 56，**每份只含自己 host** | §21 | `_check_sitemap_split.mjs` |
| 印刷画册 | 源 `E:\video\html2doc\templates\datasheet-{en,zh}-catalog.html`（别手改 public 拷贝） | §21、逐日 10-29 | `_check_prule.js`、`_check_specalign_final.js` |

## 高频硬钉子（踩过就疼，别问为什么）
- ASVG 价格 = AHF 同档 **−20**；SVG = kvar 价表（400V/480V 两套）；`sic-ultra-svg` = `anti-pollution-svg` ×2。改完必跑 `_gen_sku_ledger.py` 重建三本台账。
- 改中文文案后**必须重跑 `_font_subset.py`**；`OPPOSansSC-<w>-sub.woff2` 的 `-sub` 名不可去掉（`/assets/*` immutable 一年）。**中文实际只用两支字体文件**：400 档声明 `400 500`、700 档声明 `600 700`（500/600 文件已移入 backups，别再引入）。
- 占位图 `index-product-ahf.webp` ~90 处引用，**绝不覆盖/改名**；产品图 1200×1200 白底 WEBP q82。
- 判「能不能删」只认 `_audit_assets.py` / `_audit_images_strict.py`（词边界匹配），**别用 `grep 主名`**；spin 必须按**目录级**判断。
- 301 必须写在 `netlify.toml` 的 `/assets/*` → 200 透传规则**之前**，否则被遮蔽成 404。
- 360 改首帧 = 4 处（两处 `img src`、`var u,v`、`shown`）**+ 裁框按新 hero 重算**；预裁剪构图必须同时 `max-width:591.36px; margin-inline:auto`。
- 换素材四查（`img width/height`、`max-width`、残留 `transform:scale()`、缩略图指向）+ 各套 export 的 v 轴方向不一致 → DETAIL §17。
- ⚠️ **测性能别直接测 `dist`**：同一项目可能同时有别的会话在跑 `astro build`，建站会清空 dist → 会测出「图片全 1KB」的假数据（判据：`dist/assets` 里只剩 spin/spin-thumbs）。正确姿势 = 建完 `robocopy /MIR dist _perf_dist` 出快照，再对快照起 4478 端口测（`PERF_BASE=` 指过去）。
- 页面返回「4 个文本节点 + 字体栈 Times New Roman」= 那页其实是 404（python 静态服务器的错误页），别当成样式丢了。

## 待裁决 / 待办（别自己拍板）
Footer h4 跳级（P0-2）｜邮箱 + 公司地址｜两个站点图标 mark（`logo-head.svg` vs favicon 几何 C）｜站内两套尺寸矛盾（矩阵 specData vs 详情页）｜`en/solutions.astro` 仍 `alternates={false}`｜`ip65-svg` / `ip65-sic-fanless-svg` 价格仍照抄 AHF｜`ip65-sic-fanless-ahf-datasheet.pdf` 与 `sic-fanless-ahf-datasheet.pdf` 字节相同疑放错文件｜证书 01 EUTEST 02.07 过期待换｜3 个 PDF 手册 MD5 相同（已 301，删会 404）。
