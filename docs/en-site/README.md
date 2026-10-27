# CHITEK 英文站管理文档

> 生成 2026-10-08 21:20 ｜ 目录 `docs/en-site/`

把英文站的新闻、下载链接、产品 SKU 三块「管理型」数据与字体审计报告集中成 HTML + Markdown 双格式文档。
全部由源码**只读**生成，不修改站点任何文件。

## 文件清单

| 文件 | 用途 |
|---|---|
| `index.html` | 总览入口（浏览器打开） |
| `01-news-cards-and-links.html` / `.md` | 新闻卡片与推荐链接汇总 |
| `02-download-links.html` / `.md` | 英文站下载链接管理 |
| `03-product-sku.html` / `.md` | 产品 SKU 管理 |
| `04-font-audit.html` / `.md` | 英文站字体审计（字族 / 字重 / 字符调整） |
| `_gen/gen_en_site_docs.py` | 生成器（重跑一次即刷新全部文档） |

## 重新生成

```
python docs/en-site/_gen/gen_en_site_docs.py
```

## 数据源（只读）

- `src/data/enNewsCards.js` — 列表页新闻卡片
- `src/pages/en/news/*.astro` — 每篇文章的 article 元信息 + 三块推荐链接
- `src/pages/en/products*.astro` + `src/pages/en/products*/ *.astro` — 卡片参数 / 配置器 / 下载按钮
- `public/assets/pdf/*.pdf` — 现有 PDF 资产
