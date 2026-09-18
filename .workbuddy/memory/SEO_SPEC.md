# SEO / 追踪 / 计划规范（CHITEK）

> `MEMORY.md` 的拆分文件：**改 SEO、hreflang、内链、追踪之前必读**。

## SEO 基础设施
- GA4 `G-HVJS1DXF00`（中文页不加载）；GSC 网域属性；Bing 验证码两处 + netlify 8 条转发（必须排在通配符之前）。
- 五语首页单 H1 已完成（面板 0 口号降级为 `<p>`）；`_sync_homepage_seo.py` 幂等可反复跑。
- 首页 title/desc 长度：zh 29/76、en 59/161、es 48/151、pt 48/156、ar 60/140。
- src 内 U+FFFD 乱码 = 0。冒烟脚本 `_smoke_home_news.py`（12 断言）。

## hreflang（BaseLayout 两开关）
- `alternates={false}` → 分页页 / 仅英文产品页 / 404。
- `alternateLangs=[...]` → 新闻文章页。
- 当前计数：subset 124 / false 7 / default 30。
- ⚠️ false 的页面**仍有**语言切换器 `<a href="/pt/...">`，排查须区分 `<link rel=alternate>` 与 `<a>`。

## 新闻列表 / 分页（四语已统一）
- 一页 10 条真分页，扁平 URL `/{lang}news/page_2/`；分页页 `alternates={false}`；hero `min-h-[33vh] mt-[72px]`。
- ⚠️ data 里 href 一律存**不带语言前缀**的 `/news/<slug>`。
- ⚠️ 生成含 JSX 花括号的 .astro 模板用 replace 占位符，**别用 `str.format()`**。

## pt 切换器泄漏（已修）
- `Nav.astro` 用 `showPtSwitch = !/^\/news(\/|$)/.test(pathNoLang)` 包裹；日后给 pt 做新闻，去掉包裹即回滚。

## 转化追踪（⚠️ 线上未生效，修复前不得称已上线）
- `public/assets/js/analytics.js`（BaseLayout head 加载）+ 5 语 contact 的 `data-lead-form` / `[data-utm-fields]` / `[data-form-success]` 三钩子。
- 钩子只在工作区、从未 commit → Netlify 从 git 部署 → **线上表单无钩子、POST 404**（Netlify Forms 未注册，Send Message 收不到）。
- 事件：`generate_lead`(主转化) / `contact_click` / `download_resource` / `view_product` / `form_start` / `scroll_90` / `outbound_click`。CONFIG 区在脚本顶部（域名、下载扩展名、`/products/` 正则、首触 30 天等）。

## 运营计划（`docs/独立站运营计划.{md,html}`，v2.2）
- ⚠️ **用户明确不要排期/日期规划**：已删「12 周排期表」，验收标准去掉时间限定。**只给「优先级 + 依赖条件 + 验收清单」**——依赖技术部给资料，日期全靠猜。「周期 3 个月」只是范围参考，不是排期。
- 四支柱：① 网站结构 ② 关键词矩阵 ③ 产品页塑造 ④ 数据周报。+ §5 内链/外链/社媒。
- 内链审计 `_internal_link_audit.py`（抽 `lp('...')`，Nav/Footer 不计）：155 页 / 孤儿 10（全 Nav 假阳性）/ 弱内链 127（82%）。真问题只 2 个：产品详情页零内链（已修）、4 条 404 死链（已修）。解法是 4 个 Hub 页，不是手工互链。
- 外链：收录期只铺枕链（月 5–10 条，工业目录/企业档案/问答/Medium）；**PBN 站群 = 红线**（SpamBrain 连坐主站）；4–6 个月后才做上下游互链。
- 社媒：LinkedIn 公司页 + **销售个人号**为 P0；内容配比 5 科普 : 3 案例 : 2 动态；衡量只看 GA4 引荐会话与询盘。
- **客户画像（§0）**：6 类 ToB 角色 —— 终端电气工程师(P0)、海外代理商(P0)、EPC/集成商(P1)、设计院/咨询(P1)、OEM 贴牌(P2)、采购比价(P2)。每类搜的词不同 → 决定关键词矩阵与产品页模块。

## 竞品分析（市场交付物）
- `docs/竞品分析拓展手册.html` + `docs/竞品分析-单竞品一页纸模板.md`；4 支柱套 AHF 需换漏斗/转化/复购三处。第三方数据未经实测不得对外引用。
