# 英文 AHF 列表页卡片参数调整提案（待核对）

日期：2026-09-21
对象：`src/pages/en/products.astro` 的 9 张产品卡（第 147–300 行）
依据：用户提供的型号 / 额定电压 / 容量对照表

---

## 0. 先说清楚一件事：卡片上现在看不到参数

当前卡片结构只有 **图片 + h3 标题 + tags + View More**，没有可见的规格行。
`data-v` / `data-a` / `data-s` / `data-i` 这四个属性**只驱动左侧筛选器**，改了以后：

- ✅ 筛选行为会变（勾某个电压/电流档出现的卡片变了）
- ❌ 卡片表面**一个字都不会变**，客户看不到 "APF 50/75/100/150/200A"

如果希望客户在卡片上直接读到具体参数，需要**新增一行可见规格文本**。这一点请在第 4 问里拍板。

---

## 1. 型号 → 卡片 的对应关系（我的推断，请核对）

| 表里的 Model | 我判断对应的卡片 | 依据 |
|---|---|---|
| Silicon Carbide | ① Silicon Carbide MOSFET AHF | 名字直接对应 |
| Anti-Pollution | ② Anti-Pollution AHF | 名字直接对应 |
| Slim | ③ Ultra-slim AHF | 名字直接对应 |
| Distributed | ④ Distributed AHF | 名字直接对应 |
| Fanless | ⑧ SiC-Fanless & Low Noise AHF（+ ⑥ IP65 SiC-Fanless） | 名字含 Fanless；⑥⑧ 同为 380*425*88mm |
| —— 表里没有 —— | ⑤ Rack mounted AHF、⑦ IP65 AHF、⑨ Advanced AHF | 需要补数据或保持现状 |

---

## 2. 逐张卡的调整清单

筛选档位是**固定枚举**，不能写具体值：
- 电压档：`208V / 400V / 480V / 690V / 800V`
- 电流档：`8~20A / 30~50A / 50~200A`

| # | 卡片（slug） | 表里的参数 | 现 data-v | 拟 data-v | 现 data-a | 拟 data-a | 变动 |
|---|---|---|---|---|---|---|---|
| 1 | Silicon Carbide MOSFET AHF<br>`sic-ultra-ahf` | 400V（208/480 联系我们）<br>APF 50/75/100/150/200A | `400V,480V,690V` | `400V,480V`（删 690V） | `50~200A` | `50~200A` | 电压删 690V |
| 2 | Anti-Pollution AHF<br>`anti-pollution-ahf` | 400V（可选 208/480/690/800）<br>APF 50/75/100/150/200A | `400V,480V` | `208V,400V,480V,690V,800V` | `50~200A` | `50~200A` | 电压大幅补档 |
| 3 | Ultra-slim AHF<br>`ultra-slim-ahf` | 400V（208/480）<br>APF 8A / 15A | `400V,480V` | `208V,400V,480V` | `30~50A` | **`8~20A`** | ⚠️ 电流降档 |
| 4 | Distributed AHF<br>`distributed-ahf` | 400V（仅）<br>APF 30A / 50A | `400V,480V` | `400V`（删 480V） | `30~50A` | `30~50A` | 电压删 480V |
| 5 | Rack mounted AHF<br>`rack-mounted-ahf` | **表里无** | `208V,400V` | 不动 | `8~20A` | 不动 | — |
| 6 | IP65 SiC-Fanless AHF<br>`ip65-sic-fanless-ahf` | Fanless：400V（208/480 联系我们）<br>APF 30A / 50A | `400V,480V` | `400V,480V` | `8~20A` | **`30~50A`** | ⚠️ 电流升档 |
| 7 | IP65 AHF<br>`ip65-ahf` | **表里无** | `400V,480V` | 不动 | `8~20A` | 不动 | — |
| 8 | SiC-Fanless & Low Noise AHF<br>`sic-fanless-ahf` | Fanless：400V（208/480 联系我们）<br>APF 30A / 50A | `400V,480V` | `400V,480V` | `8~20A` | **`30~50A`** | ⚠️ 电流升档 |
| 9 | Advanced AHF<br>`advanced-ahf` | **表里无** | `400V,480V` | 不动 | `8~20A` | 不动 | — |

---

## 3. 改完以后筛选器的命中情况（副作用，需要一起确认）

| 档位 | 现在命中 | 改后命中 | 说明 |
|---|---|---|---|
| 208V | 1 张（Rack mounted） | 3 张（+ Ultra-slim、Anti-Pollution） | SiC 若也加 208V 则 4 张 |
| 400V | 9 张 | 9 张 | 不变 |
| 480V | 8 张 | 7 张 | Distributed 只有 400V，退出该档 |
| 690V | 1 张（SiC） | 1 张（Anti-Pollution） | 换了对象 |
| **800V** | **0 张（死档）** | **1 张（Anti-Pollution）** | ✅ 顺带修好一个既有 bug |
| 8~20A | 5 张 | 4 张 | ⑥⑧ 升档出去，③ 降档进来 |
| 30~50A | 2 张 | 3 张 | +⑥⑧，−③ |
| 50~200A | 2 张 | 2 张 | 不变 |

> **发现**：目前侧栏的 `800V` 勾选框**永远返回 0 条结果**（没有任何卡片标 800V）。
> 表里 Anti-Pollution 明确写了可选 800VAC → 加上它正好把这个死档修活。

---

## 4. 需要你拍板的 4 件事

1. **"可选 / please contact us" 的电压要不要写进 data-v**
   - 写进去 → 客户按电压筛选能命中（推荐）
   - 不写 → 只保留标准 400V，可选电压仅在详情页文字里说明

2. **Fanless 一行覆盖哪几张卡**
   - ⑥ IP65 SiC-Fanless + ⑧ SiC-Fanless 两张都改（推荐，同尺寸同平台）
   - 只改 ⑧ / 只改 ⑥

3. **表里没数据的 ⑤ Rack mounted、⑦ IP65、⑨ Advanced 怎么办**
   - 保持现状不动（推荐）
   - 按系列推断给值（我来猜，你复核）
   - 从列表页下架

4. **改动范围**
   - 只改列表页卡片的 `data-*`（最小改动）
   - 同时在卡片上加一行**可见规格**（如 `400VAC · APF 50/75/100/150/200A`）
   - 同步 9 个详情页的 Rated Voltage / Rated Capacity 与选型按钮（现全部写死 `208–690V`，与表冲突）
   - 同步 SVG 页 `products-svg.astro`（表里给了 kvar 值；该页目前沿用 A 档位，对 SVG 不合理）
