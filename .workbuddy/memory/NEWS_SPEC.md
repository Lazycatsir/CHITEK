# 新闻管线规范（CHITEK）

> `MEMORY.md` 的拆分文件：**改新闻之前必读**。新闻 = 数据驱动，1 条命令。

## 新增文章流程
**写 4 份同 slug 的 .astro（`src/pages/{,en/,es/,ar/}news/<slug>.astro`）+ 跑 `npm run news:sync`。** 手工插卡片流程已作废。

- 别名：`news:sync` = `_extract_all_news.py`、`news:gen` = `_gen_news_pages.py`、`news:check` = `_verify_news_i18n.py`。
- 三层结构：文章 frontmatter 的 `article` 对象（人工写）→ `src/data/{zh,en,es,ar}NewsCards.js`（sync 生成，**勿手改**）→ 列表页/分页页（gen 生成）。
- 组件：`src/components/news/{NewsCard,NewsPager}.astro`。

## 硬规则
- `article` 5 个字段是卡片硬要求：`title` · `category` · `date`（`yyyy-mm-dd`）· `dateDisplay` · `description`。**缺 description → 摘要空白。**
- sync 硬门槛：四语 slug 集合必须一致，否则退出码 1 且**一个文件都不写**（未译完用 `--allow-partial`）。
- 兜底配图 = slug 的 md5 取 `news-img-1..8`（稳定）；正文第一张 `/assets/images/(news|blog)/*.webp` 优先。
- `_gen_news_pages.py` 只在改列表页版式/UI 文案时跑，每次自动建 `docs/_ref/news-gen-<ts>/` 备份。
- 正文必须来自真实草稿源 `F:/下载/web-crawler/outreach/templates/`，**严禁编造**。
- pt 没有新闻（只有 zh/en/es/ar 四语）。

## 验证
`npm run news:check -- --http http://localhost:4321` → 离线 81 + 在线 76 = 157 项；第 1 页 hreflang 精确 = 5。

## 待办
缺「新建文章脚手架」脚本，仍需手写 4 份 .astro。
