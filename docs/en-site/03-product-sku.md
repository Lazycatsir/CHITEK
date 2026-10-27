# CHITEK 英文站 · 产品 SKU 管理

> 生成 2026-10-08 21:20 ｜ 源 三张列表页卡片参数 + 23 个产品详情页配置器（SPECS/DEF/partNo）｜ 只读扫描

导航：[总览](index.html) ｜ [① 新闻卡片与推荐链接](01-news-cards-and-links.html) ｜ [② 下载链接管理](02-download-links.html) ｜ [③ 产品 SKU 管理](03-product-sku.html)


## 〇、SKU 命名规则（从源码抽取）

详情页内联脚本里的一句话定义：

<code>partNo = '&lt;前缀&gt;' + 电流 + '-' + 电压 + '-' + 安装 + '-' + 防护</code>

完整展示串：<code>SKU: &lt;partNo&gt; · 500 × 550 × &lt;深&gt; mm · &lt;重&gt; kg · &lt;价格&gt;$(EXW)</code>

- 前缀：每页写死（见下表）。<b>两种风格并存</b>：<code>CHITEK-SiC-AHF-</code>（连字符）与 <code>ULTRA_SLIM_AHF_</code>（下划线）。
- 电流 / 电压 / 安装 / 防护：四档直接拼进料号。
- <span class="miss">接线（3P3W / 3P4W）虽然在配置器里可选，但<b>没有拼进料号</b> —— 换接线方式时 SKU 不变。</span>
- 尺寸：宽 × 高 全站写死 <code>500 × 550</code>，只有深度按电流档查 <code>SPECS</code> 表。
- 价格：全站硬编码 <code>1300$(EXW)</code>（未按型号/容量区分）。


## 一、全部产品页 SKU 规则总表

24 个产品页：23 个带配置器，1 个为 legacy 页（无配置器）。

| 族 | 详情页文件 | 料号前缀 | 电压档 | 容量档 | 接线 | 安装 | 防护 | 价格(EXW) |
|---|---|---|---|---|---|---|---|---|
| AHF | products/anti-pollution-ahf.astro | ANTI_POLLUTION_AHF_ | 208V / 400V / 480V / 690V / 800V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| AHF | products/distributed-ahf.astro | DISTRIBUTED_AHF_ | 208V / 400V / 480V | 30A / 50A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| AHF | products/ip65-ahf.astro | IP65_AHF_ | 208V / 400V / 480V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| AHF | products/ip65-sic-fanless-ahf.astro | IP65_SIC_FANLESS_AHF_ | 400V / 480V / 690V | 8A / 20A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| AHF | products/sic-fanless-ahf.astro | SIC_FANLESS_AHF_ | 208V / 400V / 480V | 30A / 50A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| AHF | products/sic-ultra-ahf.astro | CHITEK-SiC-AHF- | 208V / 400V / 480V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| AHF | products/ultra-slim-ahf.astro | ULTRA_SLIM_AHF_ | 208V / 400V / 480V | 8A / 15A / 20A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/anti-pollution-hv-svg.astro | ANTI_POLLUTION_SVG_ | 208V / 400V / 480V / 690V / 800V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/anti-pollution-svg.astro | ANTI_POLLUTION_SVG_ | 208V / 400V / 480V / 690V / 800V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/distributed-svg.astro | DISTRIBUTED_SVG_ | 208V / 400V / 480V | 30A / 50A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/ip65-sic-fanless-svg.astro | IP65_SIC_FANLESS_SVG_ | 400V / 480V / 690V | 8A / 20A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/ip65-svg.astro | IP65_SVG_ | 208V / 400V / 480V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/sic-fanless-svg.astro | SIC_FANLESS_SVG_ | 208V / 400V / 480V | 30A / 50A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/sic-ultra-svg.astro | CHITEK-SiC-SVG- | 208V / 400V / 480V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| SVG | products-svg/ultra-slim-svg.astro | ULTRA_SLIM_SVG_ | 208V / 400V / 480V | 8A / 15A / 20A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/anti-pollution-asvg.astro | ANTI_POLLUTION_ASVG_ | 208V / 400V / 480V / 690V / 800V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/anti-pollution-hv-asvg.astro | ANTI_POLLUTION_ASVG_ | 208V / 400V / 480V / 690V / 800V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/distributed-asvg.astro | DISTRIBUTED_ASVG_ | 208V / 400V / 480V | 30A / 50A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/ip65-asvg.astro | IP65_ASVG_ | 208V / 400V / 480V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/ip65-sic-fanless-asvg.astro | IP65_SIC_FANLESS_ASVG_ | 400V / 480V / 690V | 8A / 20A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/sic-fanless-asvg.astro | SIC_FANLESS_ASVG_ | 208V / 400V / 480V | 30A / 50A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/sic-ultra-asvg.astro | CHITEK-SiC-ASVG- | 208V / 400V / 480V | 50A / 75A / 100A / 150A / 200A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |
| ASVG | products-asvg/ultra-slim-asvg.astro | ULTRA_SLIM_ASVG_ | 208V / 400V / 480V | 8A / 15A / 20A / Unlimited | 3P3W / 3P4W | Wall / Rack | IP20 / IP65 / other | 1300 |

<span class="note">legacy 页（无配置器，不参与 SKU）：<code>products/active-harmonic-filter.astro</code></span>


## 二、尺寸重量换算表（SPECS，按容量档）

24 个详情页共用<b>同一份</b> SPECS 表（模板复制）。配置器用它把「容量档」映射到深度/重量；容量档不在表里时会静默回落到 <code>d:135 / kg:27</code>。

| 容量档（SPECS 键） | 深度 d (mm) | 重量 kg |
|---|---|---|
| Unlimited | 135 | 27 |
| 50A | 150 | 21 |
| 75A | 142 | 24 |
| 100A | 135 | 27 |
| 150A | 100 | 31 |
| 200A | 118 | 38 |


### ⚠️ 容量档缺 SPECS 键（会静默回落）

| 详情页 | 配置器里有、但 SPECS 无键的容量档 | 回落取值 |
|---|---|---|
| products/distributed-ahf.astro | 30A | Unlimited |
| products/ip65-sic-fanless-ahf.astro | 8A / 20A | Unlimited |
| products/sic-fanless-ahf.astro | 30A | Unlimited |
| products/ultra-slim-ahf.astro | 8A / 15A / 20A | Unlimited |
| products-svg/distributed-svg.astro | 30A | Unlimited |
| products-svg/ip65-sic-fanless-svg.astro | 8A / 20A | Unlimited |
| products-svg/sic-fanless-svg.astro | 30A | Unlimited |
| products-svg/ultra-slim-svg.astro | 8A / 15A / 20A | Unlimited |
| products-asvg/distributed-asvg.astro | 30A | Unlimited |
| products-asvg/ip65-sic-fanless-asvg.astro | 8A / 20A | Unlimited |
| products-asvg/sic-fanless-asvg.astro | 30A | Unlimited |
| products-asvg/ultra-slim-asvg.astro | 8A / 15A / 20A | Unlimited |


## 三、列表页卡片参数（三页 × 8 卡）

卡片的 <code>data-v / data-a / data-s / data-i / data-t</code> 决定「筛选」命中，与详情页配置器是两套独立硬编码，需人工保持口径一致。


### products（8 卡）

| # | 详情页 slug | 电压 data-v | 容量 data-a | 尺寸 data-s | 防护 data-i | 技术 data-t |
|---|---|---|---|---|---|---|
| 1 | /products/sic-ultra-ahf | 208V,400V,480V | 50~200A | 500*550*175mm,500*550*130mm | IP20,IP30 | SiC |
| 2 | /products/anti-pollution-ahf | 208V,400V,480V | 50~200A | 500*550*130mm | IP20,IP30 | IGBT |
| 3 | /products/anti-pollution-ahf | 690V,800V | 50~200A | 480*600*175mm | IP20,IP30 | IGBT |
| 4 | /products/ultra-slim-ahf | 208V,400V,480V | 8~20A | 340*410*45mm | IP20,IP30,IP40 | IGBT |
| 5 | /products/distributed-ahf | 208V,400V,480V | 30~50A | 380*400*88mm | IP20,IP30,IP40 | IGBT |
| 6 | /products/sic-fanless-ahf | 208V,400V,480V | 30~50A | 515*500*185mm | IP65 | SiC |
| 7 | /products/ip65-ahf | 208V,400V,480V | 50~200A | 600*500*220mm | IP65 | IGBT,SiC |
| 8 | /products/sic-fanless-ahf | 208V,400V,480V | 30~50A | 515*500*185mm | IP20,IP30 | SiC |


### products-svg（8 卡）

| # | 详情页 slug | 电压 data-v | 容量 data-a | 尺寸 data-s | 防护 data-i | 技术 data-t |
|---|---|---|---|---|---|---|
| 1 | /products-svg/sic-ultra-svg | 208V,400V,480V | 50~200A | 500*550*175mm,500*550*130mm | IP20,IP30 | SiC |
| 2 | /products-svg/anti-pollution-svg | 208V,400V,480V | 50~200A | 500*550*130mm | IP20,IP30 | IGBT |
| 3 | /products-svg/anti-pollution-hv-svg | 690V,800V | 50~200A | 480*600*175mm | IP20,IP30 | IGBT |
| 4 | /products-svg/ultra-slim-svg | 208V,400V,480V | 8~20A | 340*410*45mm | IP20,IP30,IP40 | IGBT |
| 5 | /products-svg/distributed-svg | 208V,400V,480V | 30~50A | 380*400*88mm | IP20,IP30,IP40 | IGBT |
| 6 | /products-svg/ip65-sic-fanless-svg | 208V,400V,480V | 30~50A | 515*500*185mm | IP65 | SiC |
| 7 | /products-svg/ip65-svg | 208V,400V,480V | 50~200A | 600*500*220mm | IP65 | IGBT,SiC |
| 8 | /products-svg/sic-fanless-svg | 208V,400V,480V | 30~50A | 515*500*185mm | IP20,IP30 | SiC |


### products-asvg（8 卡）

| # | 详情页 slug | 电压 data-v | 容量 data-a | 尺寸 data-s | 防护 data-i | 技术 data-t |
|---|---|---|---|---|---|---|
| 1 | /products-asvg/sic-ultra-asvg | 208V,400V,480V | 50~200A | 500*550*175mm,500*550*130mm | IP20,IP30 | SiC |
| 2 | /products-asvg/anti-pollution-asvg | 208V,400V,480V | 50~200A | 500*550*130mm | IP20,IP30 | IGBT |
| 3 | /products-asvg/anti-pollution-hv-asvg | 690V,800V | 50~200A | 480*600*175mm | IP20,IP30 | IGBT |
| 4 | /products-asvg/ultra-slim-asvg | 208V,400V,480V | 8~20A | 340*410*45mm | IP20,IP30,IP40 | IGBT |
| 5 | /products-asvg/distributed-asvg | 208V,400V,480V | 30~50A | 380*400*88mm | IP20,IP30,IP40 | IGBT |
| 6 | /products-asvg/ip65-sic-fanless-asvg | 208V,400V,480V | 30~50A | 515*500*185mm | IP65 | SiC |
| 7 | /products-asvg/ip65-asvg | 208V,400V,480V | 50~200A | 600*500*220mm | IP65 | IGBT,SiC |
| 8 | /products-asvg/sic-fanless-asvg | 208V,400V,480V | 30~50A | 515*500*185mm | IP20,IP30 | SiC |


## 四、校验清单

比对「列表页卡片参数（data-v/a/s/i/t）」与「详情页配置器档位」是否同口径。两者是两套独立硬编码，改了一边不会自动同步另一边。

共 42 条（严重 0 条）。

| 级别 | 问题 |
|---|---|
| 提示 | 详情页 /products/ip65-sic-fanless-ahf 没有任何列表页卡片指向它（孤儿页，只能靠直链进入） |
| 提示 | 详情页 /products/anti-pollution-ahf 被 2 张卡片共用：products（208V,400V,480V / IP20,IP30）、products（690V,800V / IP20,IP30） |
| 提示 | 详情页 /products/sic-fanless-ahf 被 2 张卡片共用：products（208V,400V,480V / IP65）、products（208V,400V,480V / IP20,IP30） |
| 提示 | 详情页 /products-svg/anti-pollution-svg 配置器可选电压 ['690V', '800V']，但指向它的卡片 data-v 只有 ['208V', '400V', '480V'] → 按这些电压筛选时该卡不出现在列表页 |
| 提示 | 详情页 /products-svg/anti-pollution-hv-svg 配置器可选电压 ['208V', '400V', '480V']，但指向它的卡片 data-v 只有 ['690V', '800V'] → 按这些电压筛选时该卡不出现在列表页 |
| 提示 | 详情页 /products-svg/ip65-sic-fanless-svg 配置器可选电压 ['690V']，但指向它的卡片 data-v 只有 ['208V', '400V', '480V'] → 按这些电压筛选时该卡不出现在列表页 |
| 提示 | 卡片 /products-svg/ip65-sic-fanless-svg 的 data-v 含 ['208V']，但详情页配置器没有该电压档 |
| 提示 | 详情页 /products-svg/ip65-sic-fanless-svg 配置器容量档 ['8A', '20A'] 落在卡片 data-a 范围 30~50A 之外 |
| 提示 | 详情页 /products-asvg/anti-pollution-asvg 配置器可选电压 ['690V', '800V']，但指向它的卡片 data-v 只有 ['208V', '400V', '480V'] → 按这些电压筛选时该卡不出现在列表页 |
| 提示 | 详情页 /products-asvg/anti-pollution-hv-asvg 配置器可选电压 ['208V', '400V', '480V']，但指向它的卡片 data-v 只有 ['690V', '800V'] → 按这些电压筛选时该卡不出现在列表页 |
| 提示 | 详情页 /products-asvg/ip65-sic-fanless-asvg 配置器可选电压 ['690V']，但指向它的卡片 data-v 只有 ['208V', '400V', '480V'] → 按这些电压筛选时该卡不出现在列表页 |
| 提示 | 卡片 /products-asvg/ip65-sic-fanless-asvg 的 data-v 含 ['208V']，但详情页配置器没有该电压档 |
| 提示 | 详情页 /products-asvg/ip65-sic-fanless-asvg 配置器容量档 ['8A', '20A'] 落在卡片 data-a 范围 30~50A 之外 |
| 提示 | 卡片 data-i 里出现配置器没有的防护档 ['IP30', 'IP40']，共 17 页（/products/sic-ultra-ahf、/products/anti-pollution-ahf、/products/ultra-slim-ahf、/products/distributed-ahf、/products/sic-fanless-ahf、/products-svg/sic-ultra-svg、/products-svg/anti-pollution-svg、/products-svg/anti-pollution-hv-svg、/products-svg/ultra-slim-svg、/products-svg/distributed-svg、/products-svg/sic-fanless-svg、/products-asvg/sic-ultra-asvg、/products-asvg/anti-pollution-asvg、/products-asvg/anti-pollution-hv-asvg、/products-asvg/ultra-slim-asvg、/products-asvg/distributed-asvg、/products-asvg/sic-fanless-asvg）。配置器只提供 IP20 / IP65 / other，卡片筛选却按 IP30 / IP40 细分 —— 属两套口径，确认是否有意为之。 |
| 提示 | 详情页 products/distributed-ahf.astro 默认值 DEF.a=100A 不在配置器档位 ['30A', '50A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products/ip65-sic-fanless-ahf.astro 默认值 DEF.a=100A 不在配置器档位 ['8A', '20A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products/sic-fanless-ahf.astro 默认值 DEF.a=100A 不在配置器档位 ['30A', '50A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products/ultra-slim-ahf.astro 默认值 DEF.a=100A 不在配置器档位 ['8A', '15A', '20A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-svg/distributed-svg.astro 默认值 DEF.a=100A 不在配置器档位 ['30A', '50A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-svg/ip65-sic-fanless-svg.astro 默认值 DEF.a=100A 不在配置器档位 ['8A', '20A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-svg/sic-fanless-svg.astro 默认值 DEF.a=100A 不在配置器档位 ['30A', '50A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-svg/ultra-slim-svg.astro 默认值 DEF.a=100A 不在配置器档位 ['8A', '15A', '20A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-asvg/distributed-asvg.astro 默认值 DEF.a=100A 不在配置器档位 ['30A', '50A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-asvg/ip65-sic-fanless-asvg.astro 默认值 DEF.a=100A 不在配置器档位 ['8A', '20A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-asvg/sic-fanless-asvg.astro 默认值 DEF.a=100A 不在配置器档位 ['30A', '50A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products-asvg/ultra-slim-asvg.astro 默认值 DEF.a=100A 不在配置器档位 ['8A', '15A', '20A', 'Unlimited'] 内（访客未勾选时页面会显示这个值） |
| 提示 | 详情页 products/distributed-ahf.astro 容量档 ['30A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products/ip65-sic-fanless-ahf.astro 容量档 ['8A', '20A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products/sic-fanless-ahf.astro 容量档 ['30A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products/ultra-slim-ahf.astro 容量档 ['8A', '15A', '20A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-svg/distributed-svg.astro 容量档 ['30A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-svg/ip65-sic-fanless-svg.astro 容量档 ['8A', '20A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-svg/sic-fanless-svg.astro 容量档 ['30A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-svg/ultra-slim-svg.astro 容量档 ['8A', '15A', '20A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-asvg/distributed-asvg.astro 容量档 ['30A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-asvg/ip65-sic-fanless-asvg.astro 容量档 ['8A', '20A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-asvg/sic-fanless-asvg.astro 容量档 ['30A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 详情页 products-asvg/ultra-slim-asvg.astro 容量档 ['8A', '15A', '20A'] 在 SPECS 表中无键 → 尺寸重量静默回落 d:135 / kg:27 |
| 提示 | 料号前缀两种风格并存：连字符 3 个（products/sic-ultra-ahf.astro、products-svg/sic-ultra-svg.astro、products-asvg/sic-ultra-asvg.astro）；下划线 20 个。建议统一。 |
| 提示 | 接线档（3P3W / 3P4W）在配置器里可选，但没有拼进 partNo —— 同一容量+电压+安装+防护下，两种接线方式生成相同 SKU。 |
| 提示 | 价格全站硬编码为 1300$(EXW)，未按型号/容量区分。 |
| 提示 | legacy 页无配置器、不参与 SKU：products/active-harmonic-filter.astro |
