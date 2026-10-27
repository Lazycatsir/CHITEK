# -*- coding: utf-8 -*-
"""
产品图管理台生成器（本地工具，与站点构建/上传无关）

核心：一张「型号 × 规格 → 产品图」台账。
  · 型号 = 24 个详情页（8 系列 × 3 线：AHF / SVG / ASVG）
  · 规格 = 页面 SKU 配置器的维度：容量 a × 电压 v（另附接线 c / 安装 i / 防护 p）
  · 图   = 规格级专属图（优先）→ 回落系列图

映射主数据在 img-admin/product-image-map.json（可手改）：
    "series": {
        "sic-ultra-ahf": {
            "image": "products-ahf-sic.webp",          # 系列默认图
            "specs": { "50A|400V": "products-ahf-sic-ultra-50a-400v.webp" }   # 规格级覆盖
        }
    }
    "specs" 的 key 写 "容量|电压"；值写 public/assets/images 下的文件名。
    第一次运行会自动创建这个文件（specs 为空），之后不会覆盖你手填的内容。

另外两个视图：8 产品卡一致性检查（15 个汇总页 × 5 语）、全部图片盘点。

用法：
    C:/Users/lenovo/miniconda3/python.exe D:/download/CHITEK/img-admin/build_product_images.py
"""
import base64
import hashlib
import html as htmllib
import io
import json
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    from PIL import Image
except Exception:
    Image = None

ROOT = Path(r"D:/download/CHITEK")
IMG_DIR = ROOT / "public" / "assets" / "images"
SRC_DIR = ROOT / "src"
PAGES_DIR = SRC_DIR / "pages"
OUT_DIR = ROOT / "img-admin"
OUT_HTML = OUT_DIR / "product-images.html"
MAP_JSON = OUT_DIR / "product-image-map.json"

IMG_EXT = {".webp", ".png", ".jpg", ".jpeg", ".svg", ".avif", ".gif"}
SRC_EXT = {".astro", ".js", ".ts", ".mjs", ".md", ".json"}

REF_RE = re.compile(r"/assets/images/([A-Za-z0-9_\-./]+?\.(?:webp|png|jpe?g|svg|avif|gif))", re.I)
IMG_TAG_RE = re.compile(r"<img\b[^>]*>", re.I | re.S)
SRC_ATTR_RE = re.compile(r"""src\s*=\s*["']([^"']+)["']""", re.I)
ALT_ATTR_RE = re.compile(r"""alt\s*=\s*["']([^"']*)["']""", re.I | re.S)

LINES = [
    ("AHF", "AHF 有源电力滤波器", {"en": "en/products.astro", "zh": "products.astro",
                                "es": "es/products.astro", "ar": "ar/products.astro", "pt": "pt/products.astro"},
     "en/products"),
    ("SVG", "SVG 静止无功发生器", {"en": "en/products-svg.astro", "zh": "products-svg.astro",
                               "es": "es/products-svg.astro", "ar": "ar/products-svg.astro", "pt": "pt/products-svg.astro"},
     "en/products-svg"),
    ("ASVG", "ASVG 增强型静止无功发生器", {"en": "en/products-asvg.astro", "zh": "products-asvg.astro",
                                      "es": "es/products-asvg.astro", "ar": "ar/products-asvg.astro", "pt": "pt/products-asvg.astro"},
     "en/products-asvg"),
]
LANGS = ["en", "zh", "es", "ar", "pt"]
CARD_ANCHOR = '<div class="cbp-vm-image">'

# 屏形态默认判定（人工看图确认，写进 product-image-map.json 的 screens，可改）
DEFAULT_SCREENS = {
    "products-ahf-sic.webp": "with",
    "products-ahf-anti-pollution.webp": "with",
    "products-ahf-anti-pollution-690v-800v-rackmount.webp": "with",
    "products-ahf-rack-mounted.webp": "with",
    "products-ahf-advanced.webp": "with",
    "products-ahf-anti-pollution-690v-800v.webp": "with",
    "products-ahf-distributed.webp": "with",
    "products-ahf-distributed-rackmount.webp": "with",
    "products-asvg-4u-din-rail.webp": "with",
    "products-asvg-4u-wall-mounted.webp": "with",
    "products-asvg-cabinet.webp": "with",
    "products-ahf-ultra-slim-rackmount.webp": "without",
    "products-ahf-ultra-slim.webp": "without",
    "products-ahf-ip65.webp": "without",
    "products-ahf-ip65-fanless.webp": "without",
    "products-ahf-sic-fanless.webp": "without",
}

# 安装形态默认判定（壁挂式 wall / 导轨式 rail / 机柜式 cabinet / any 通用外观）
DEFAULT_MOUNTS = {
    "products-ahf-sic.webp": "wall",
    "products-ahf-anti-pollution.webp": "rail",
    "products-ahf-anti-pollution-690v-800v-rackmount.webp": "wall",
    "products-ahf-anti-pollution-690v-800v.webp": "wall",
    "products-ahf-rack-mounted.webp": "wall",
    "products-ahf-advanced.webp": "wall",
    "products-ahf-ultra-slim-rackmount.webp": "wall",
    "products-ahf-distributed-rackmount.webp": "rail",
    "products-ahf-distributed.webp": "wall",
    "products-ahf-ultra-slim.webp": "rail",
    "products-asvg-4u-din-rail.webp": "rail",
    "products-asvg-4u-wall-mounted.webp": "wall",
    "products-asvg-cabinet.webp": "cabinet",
    "products-ahf-ip65.webp": "any",
    "products-ahf-ip65-fanless.webp": "any",
    "products-ahf-sic-fanless.webp": "any",
}

# 规格矩阵的 4 个形态列
FORM_COLS = [
    ("rail-screen", "导轨式 · 带小屏"),
    ("rail-noscreen", "导轨式 · 不带小屏"),
    ("wall-screen", "壁挂式 · 带小屏"),
    ("wall-noscreen", "壁挂式 · 不带小屏"),
]

# ---------------------------------------------------------------- 尺寸组 × 形态
# 业务模型（用户 10-21 裁定）：
#   · AHF / SVG / ASVG 三线共模 —— 管好 AHF 一套，另两线直接复用同一张图
#   · 产品按「物理尺寸规格」共模：同尺寸 + 同形态 = 同一张图
#   · 1U 只有机架 / 导轨两种（该尺寸没有带屏版本）；2U 以上再分带屏 / 不带屏
FORM_4 = ["wall-screen", "wall-noscreen", "rail-screen", "rail-noscreen"]
FORM_LABEL = {
    "wall-screen": "壁挂式 · 带小屏",
    "wall-noscreen": "壁挂式 · 不带小屏",
    "rail-screen": "导轨式 · 带小屏",
    "rail-noscreen": "导轨式 · 不带小屏",
    "wall": "壁挂式（无带屏区分）",
    "rail": "导轨式（无带屏区分）",
    "generic": "通用外观 · 未分形态",
}
DIM_GROUPS = [
    {"h": 45,  "slug": "1u",      "label": "1U",   "w": 340, "d": 410, "forms": ["wall", "rail"]},
    {"h": 88,  "slug": "2u",      "label": "2U",   "w": 380, "d": 400, "forms": FORM_4},
    {"h": 130, "slug": "3u",      "label": "3U",   "w": 500, "d": 550, "forms": FORM_4},
    {"h": 175, "slug": "4u",      "label": "4U",   "w": 480, "d": 600, "forms": FORM_4},
    {"h": 185, "slug": "special", "label": "特化", "w": 515, "d": 500, "forms": FORM_4},
    {"h": 220, "slug": "ip65",    "label": "IP65", "w": 600, "d": 500, "forms": FORM_4},
]
# 页面参数表没填 Dimensions 的型号 —— 用这里补（用户 10-21 口头确认 IP65 = 600×500×220）
DIM_OVERRIDE = {
    "ip65-ahf": (600, 500, 220),
    "ip65-svg": (600, 500, 220),
    "ip65-asvg": (600, 500, 220),
}
# 尺寸组 → 形态 → 图（可写单文件名，也可写文件名单；generic 为「现状通用图」，不占 22 格）
DEFAULT_MATRIX = {
    "45": {"forms": {
        "wall": ["products-ahf-ultra-slim-rackmount.webp"],
        "rail": ["products-ahf-ultra-slim.webp"],
    }},
    "88": {"forms": {
        "rail-screen": ["products-ahf-distributed-rackmount.webp"],
        "wall-screen": ["products-ahf-distributed.webp"],
    }},
    "130": {"forms": {
        "wall-screen": ["products-ahf-sic.webp"],
        "rail-screen": ["products-ahf-anti-pollution.webp"],
    }},
    "175": {"forms": {
        "rail-screen": ["products-ahf-anti-pollution-690v-800v-rackmount.webp"],
        "wall-screen": ["products-ahf-anti-pollution-690v-800v.webp"],
    }},
    "185": {"generic": ["products-ahf-sic-fanless.webp", "products-ahf-ip65-fanless.webp"]},
    "220": {"generic": ["products-ahf-ip65.webp"]},
}
HREF_RE = re.compile(r"""href=(?:"([^"]+)"|\{'([^']+)'\}|\{lp\('([^']+)'\)\})""")
H3_RE = re.compile(r"<h3[^>]*>\s*<a[^>]*>(.*?)</a>", re.S)


# ---------------------------------------------------------------- 基础工具
def category_of(rel: str) -> str:
    name = rel.split("/")[-1].lower()
    if rel.startswith(("blog/", "news/")):
        return "新闻图"
    if rel.startswith("flags/"):
        return "图标"
    if name.startswith(("logo", "favicon", "apple-touch")):
        return "品牌图标"
    if name.startswith(("products-", "sic-", "index-product-", "working-principle-")):
        return "产品图"
    if name.startswith("solutions-"):
        return "方案图"
    if name.startswith("about-"):
        return "关于页"
    if name.startswith("services-"):
        return "服务页"
    if name.startswith("certificate-"):
        return "证书"
    if name.startswith("index-"):
        return "首页"
    return "其他"


def svg_size(path: Path):
    try:
        head = path.read_text("utf-8", errors="ignore")[:2000]
    except Exception:
        return None, None
    m = re.search(r'viewBox\s*=\s*["\']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)', head)
    if m:
        return int(float(m.group(1))), int(float(m.group(2)))
    w = re.search(r'\bwidth\s*=\s*["\']([\d.]+)', head)
    h = re.search(r'\bheight\s*=\s*["\']([\d.]+)', head)
    if w and h:
        return int(float(w.group(1))), int(float(h.group(1)))
    return None, None


def image_size(path: Path):
    if path.suffix.lower() == ".svg":
        return svg_size(path)
    if Image is None:
        return None, None
    try:
        with Image.open(path) as im:
            return im.size[0], im.size[1]
    except Exception:
        return None, None


def md5_of(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def thumb_uri(path: Path, size=132) -> str:
    """生成内嵌缩略图（data URI）—— 保证预览面板 / 双击 file:// 都能显示"""
    try:
        if path.suffix.lower() == ".svg":
            return "data:image/svg+xml;base64," + base64.b64encode(path.read_bytes()).decode()
        if Image is None:
            return ""
        with Image.open(path) as im:
            im = im.convert("RGBA")
            im.thumbnail((size, size), Image.LANCZOS)
            bg = Image.new("RGB", im.size, (247, 247, 247))
            bg.paste(im, mask=im.split()[-1])
            buf = io.BytesIO()
            bg.save(buf, format="WEBP", quality=78, method=4)
        return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    except Exception:
        return ""


def large_uri(path: Path, size=600) -> str:
    """灯箱用大图（内嵌），保证预览面板 / file:// 都能放大看"""
    try:
        if path.suffix.lower() == ".svg" or Image is None:
            return ""
        with Image.open(path) as im:
            im = im.convert("RGBA")
            im.thumbnail((size, size), Image.LANCZOS)
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1])
            buf = io.BytesIO()
            bg.save(buf, format="WEBP", quality=78, method=4)
        return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    except Exception:
        return ""


def clean_text(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = htmllib.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


# ---------------------------------------------------------------- 图片 & 引用
def scan_images():
    items, existing, thumbs, larges = [], set(), {}, {}
    for p in sorted(IMG_DIR.rglob("*")):
        if not p.is_file() or p.suffix.lower() not in IMG_EXT:
            continue
        rel = p.relative_to(IMG_DIR).as_posix()
        existing.add(rel)
        w, h = image_size(p)
        t = thumb_uri(p)
        if t:
            thumbs[rel] = t
        g = large_uri(p)
        if g:
            larges[rel] = g
        items.append({
            "path": rel, "name": p.name, "cat": category_of(rel),
            "w": w, "h": h, "bytes": p.stat().st_size, "md5": md5_of(p),
        })
    return items, existing, thumbs, larges


def scan_refs():
    refs = {}
    for p in SRC_DIR.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in SRC_EXT:
            continue
        try:
            text = p.read_text("utf-8", errors="ignore")
        except Exception:
            continue
        if "/assets/images/" not in text:
            continue
        page = p.relative_to(SRC_DIR).as_posix()
        local = {}

        def add(rel, alt=None):
            rel = rel.strip()
            if not rel:
                return
            local.setdefault(rel, set())
            if alt:
                local[rel].add(re.sub(r"\s+", " ", alt).strip())

        for tag in IMG_TAG_RE.finditer(text):
            t = tag.group(0)
            sm = SRC_ATTR_RE.search(t)
            if not sm:
                continue
            for rm in REF_RE.finditer(sm.group(1)):
                am = ALT_ATTR_RE.search(t)
                add(rm.group(1), am.group(1) if am else None)
        for rm in REF_RE.finditer(text):
            add(rm.group(1))

        for rel, alts in local.items():
            slot = refs.setdefault(rel, {"pages": [], "alts": []})
            if page not in slot["pages"]:
                slot["pages"].append(page)
            for a in alts:
                if a not in slot["alts"]:
                    slot["alts"].append(a)
    return refs


# ---------------------------------------------------------------- 汇总页卡片
def parse_cards(abs_path: Path):
    if not abs_path.exists():
        return None
    text = abs_path.read_text("utf-8", errors="ignore")
    idx = [m.start() for m in re.finditer(re.escape(CARD_ANCHOR), text)]
    cards = []
    for n, start in enumerate(idx):
        end = idx[n + 1] if n + 1 < len(idx) else min(len(text), start + 4000)
        chunk = text[start:end]
        hm = HREF_RE.search(chunk)
        href = next((g for g in hm.groups() if g), "") if hm else ""
        im = re.search(r'src="(/assets/images/[^"]+)"', chunk)
        am = re.search(r'alt="([^"]*)"', chunk)
        tm = H3_RE.search(chunk[:3000])
        cards.append({
            "pos": n + 1,
            "href": href,
            "img": (im.group(1).replace("/assets/images/", "") if im else ""),
            "alt": htmllib.unescape(am.group(1)).strip() if am else "",
            "title": clean_text(tm.group(1)) if tm else "",
        })
    return cards


# ---------------------------------------------------------------- 型号档案
def parse_series_page(path: Path, line: str):
    """从一个详情页抽型号名、规格维度、料号前缀"""
    t = path.read_text("utf-8", errors="ignore")
    h1m = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
    name = clean_text(h1m.group(1)) if h1m else path.stem
    name = name.split(" — ")[0].strip()

    pnm = re.search(r"partNo\s*=\s*'([A-Za-z0-9_\-]+)'", t)
    prefix = pnm.group(1) if pnm else ""
    if prefix.endswith("-") or prefix.endswith("_"):
        prefix = prefix[:-1]

    dims = {}
    for m in re.finditer(r'data-group="([a-z])" data-val="([^"]*)"', t):
        g, v = m.group(1), m.group(2)
        dims.setdefault(g, [])
        if v not in dims[g]:
            dims[g].append(v)

    volt = re.search(r"Rated Voltage:</strong>\s*([^<]+)", t)
    cap = re.search(r"Power Capacity:</strong>\s*([^<]+)", t)

    # 外形尺寸 W×D×H (mm) —— 参数表 Dimensions 行
    dm = re.search(r"Dimensions W[^<]*\(mm\)</th>\s*<td[^>]*>(.*?)</td>", t, re.S)
    dim_raw = clean_text(dm.group(1)) if dm else ""
    nums = re.findall(r"\d+", dim_raw)
    dim_w = dim_d = dim_h = dim_u = None
    dim_l = None
    if len(nums) >= 3:
        dim_w, dim_d, dim_h = int(nums[0]), int(nums[1]), int(nums[2])
        dim_u = round(dim_h / 44.45)          # 1U = 44.45 mm
        dim_l = round(dim_w * dim_d * dim_h / 1e6, 1)

    caps = [c for c in dims.get("a", []) if c.lower() != "unlimited"]
    volts = dims.get("v", [])
    return {
        "slug": path.stem,
        "line": line,
        "name": name,
        "prefix": prefix,
        "caps": caps,
        "volts": volts,
        "wiring": dims.get("c", []),
        "mount": dims.get("i", []),
        "protect": dims.get("p", []),
        "specVoltage": clean_text(volt.group(1)) if volt else " / ".join(volts) + " VAC",
        "specCapacity": clean_text(cap.group(1)) if cap else " / ".join(caps),
        "dim": {"raw": dim_raw, "w": dim_w, "d": dim_d, "h": dim_h, "u": dim_u, "l": dim_l},
    }


def load_map(series_index):
    """读取/初始化映射主数据，非破坏式补全"""
    data = {"_note": "", "naming": "products-{line}-{series}-{capacity}-{voltage}.webp", "series": {}}
    if MAP_JSON.exists():
        try:
            data = json.loads(MAP_JSON.read_text("utf-8"))
        except Exception:
            print("警告：product-image-map.json 解析失败，按空表处理")
    data.setdefault("series", {})
    data.setdefault("screens", {})
    data.setdefault("mounts", {})
    data["_note"] = ("产品图主数据。"
                     "★ matrix = 尺寸组 × 形态 矩阵（主用）：matrix[\"130\"].forms[\"wall-screen\"] = 文件名（可写数组）；"
                     "matrix[\"185\"].generic = 该尺寸暂无形态区分时的通用图。"
                     "series[slug].image = 系列默认图；series[slug].specs = 规格级覆盖，key 写「容量|电压」；"
                     "series[slug].forms = 形态级配图，key 为 wall-screen / wall-noscreen / rail-screen / rail-noscreen；"
                     "screens = 屏形态：with(带小屏) / without(不带小屏)；"
                     "mounts = 安装形态：wall(壁挂式) / rail(导轨式) / cabinet(机柜式) / any(通用外观) —— 全站只有壁挂和导轨两种主形态，没有「机架式」。"
                     "值统一写 public/assets/images 下的文件名。改完重跑 build_product_images.py。")
    for slug, info in series_index.items():
        item = data["series"].setdefault(slug, {})
        item.setdefault("image", info["image"])
        item.setdefault("specs", {})
        item.setdefault("forms", {})
        item["line"] = info["line"]
        item["name"] = info["name"]
    for img in set(DEFAULT_SCREENS) | {i["image"] for i in series_index.values() if i.get("image")}:
        data["screens"].setdefault(img, DEFAULT_SCREENS.get(img, ""))
    # 口径修正（10-21 用户裁决）：安装形态**只有壁挂式 / 导轨式**，不再用「机架式」。
    # 旧值 rack 全部迁到 wall；matrix 里的 rack / rack-screen / rack-noscreen 同步搬到 wall*。
    for img, v in list(data["mounts"].items()):
        if v == "rack":
            data["mounts"][img] = "wall"
    data["mounts"]["products-asvg-4u-wall-mounted.webp"] = "wall"
    RACK2WALL = {"rack": "wall", "rack-screen": "wall-screen", "rack-noscreen": "wall-noscreen"}
    for key, node in (data.get("matrix") or {}).items():
        forms = node.get("forms") or {}
        for old, new in RACK2WALL.items():
            if old in forms:
                if new not in forms:
                    forms[new] = forms.pop(old)
                else:
                    forms.pop(old)
        node["forms"] = forms
    for slug, item in (data.get("series") or {}).items():
        fm = item.get("forms") or {}
        for old, new in RACK2WALL.items():
            if old in fm:
                fm.setdefault(new, fm.pop(old))
        item["forms"] = fm
    for img in set(DEFAULT_MOUNTS) | {i["image"] for i in series_index.values() if i.get("image")}:
        data["mounts"].setdefault(img, DEFAULT_MOUNTS.get(img, ""))
    # 尺寸组 × 形态 矩阵（非破坏式：已存在的手改内容一律保留）
    data.setdefault("matrix", {})
    for key, node in DEFAULT_MATRIX.items():
        slot = data["matrix"].setdefault(key, {})
        slot.setdefault("forms", {})
        for fk, val in (node.get("forms") or {}).items():
            slot["forms"].setdefault(fk, val)
        if "generic" in node:
            slot.setdefault("generic", node["generic"])

    # 以 matrix 槽位回灌 mounts —— 确保「图属性」和「它所在的格」不会互相打脸
    # （rail-* 槽里的图标导轨式，wall-* 槽里的图标壁挂式）
    def _ls(v):
        if not v:
            return []
        return [v] if isinstance(v, str) else [x for x in v if x]

    for node in (data.get("matrix") or {}).values():
        for fk, lst in (node.get("forms") or {}).items():
            base = fk.split("-")[0]
            if base in ("wall", "rail"):
                for img in _ls(lst):
                    data["mounts"][img] = base
            # 带不带屏同样以槽位为准（注意 -noscreen 必须排在 -screen 之前判断）
            if fk.endswith("-noscreen"):
                for img in _ls(lst):
                    data["screens"][img] = "without"
            elif fk.endswith("-screen"):
                for img in _ls(lst):
                    data["screens"][img] = "with"
    # 文件名语义兜底（这两张不在矩阵里，但名字已经写明安装方式）
    for img in list(data["mounts"]):
        low = img.lower()
        if "din-rail" in low:
            data["mounts"][img] = "rail"
        elif "wall-mounted" in low:
            data["mounts"][img] = "wall"
    MAP_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(MAP_JSON, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return data


def main():
    if not IMG_DIR.exists():
        print("找不到图片目录:", IMG_DIR)
        sys.exit(1)

    imgs, existing, thumbs, larges = scan_images()
    refs = scan_refs()
    for it in imgs:
        r = refs.get(it["path"], {"pages": [], "alts": []})
        it["pages"], it["alts"], it["refs"] = r["pages"], r["alts"], len(r["pages"])
    missing = [{"path": rel, "pages": r["pages"]} for rel, r in sorted(refs.items()) if rel not in existing]

    by_md5 = {}
    for it in imgs:
        by_md5.setdefault(it["md5"], []).append(it["path"])
    dup_names = {}
    for v in by_md5.values():
        if len(v) > 1:
            for rel in v:
                dup_names[rel] = [x for x in v if x != rel]
    for it in imgs:
        it["dup"] = dup_names.get(it["path"], [])
    ref_index = {i["path"]: i["refs"] for i in imgs}

    # ---------- 汇总页卡片（8 卡一致性 + 系列图来源）----------
    lines_out, card_issues = [], []
    card_pages, card_slots = 0, 0
    slug_image = {}
    for key, label, pages, dir_name in LINES:
        per_lang = {}
        for lang in LANGS:
            cards = parse_cards(PAGES_DIR / pages[lang])
            if cards is not None:
                card_pages += 1
            else:
                card_issues.append(f"{key}/{lang}: 页面文件找不到（{pages[lang]}）")
                continue
            if len(cards) != 8:
                card_issues.append(f"{key}/{lang}: 卡片数量是 {len(cards)}，应为 8")
            per_lang[lang] = cards
        for c in per_lang.get("en", []):
            slug = c["href"].rstrip("/").split("/")[-1]
            slug_image[slug] = {"image": c["img"], "line": key, "name": c["title"]}

        matrix = []
        for pos in range(1, 9):
            entry = {"pos": pos, "langs": {}}
            for lang, cards in per_lang.items():
                if pos - 1 < len(cards):
                    entry["langs"][lang] = cards[pos - 1]
            en = entry["langs"].get("en") or next(iter(entry["langs"].values()), None)
            if not en:
                continue
            card_slots += 1
            entry.update({"img": en["img"], "title": en["title"], "alt": en["alt"],
                          "href": en["href"], "refs": ref_index.get(en["img"], 0)})
            used = sorted({c["img"] for c in entry["langs"].values()})
            entry["sameImg"] = len(used) == 1
            entry["badAlt"] = [lg for lg, c in entry["langs"].items() if c["alt"] != c["title"]]
            if not entry["sameImg"]:
                card_issues.append(f"{key} 卡{pos}: 5 语用的图不一致 → {', '.join(used)}")
            if entry["badAlt"]:
                card_issues.append(f"{key} 卡{pos}: alt≠标题（{', '.join(entry['badAlt'])}）")
            if en["img"] and en["img"] not in existing:
                card_issues.append(f"{key} 卡{pos}: 图不存在 → {en['img']}")
            matrix.append(entry)
        if matrix and len({c['img'] for c in matrix}) != len(matrix):
            card_issues.append(f"{key}: 8 卡没有用 8 张不同的图")
        if matrix and len({c['href'] for c in matrix}) != len(matrix):
            card_issues.append(f"{key}: 8 卡没有指向 8 个不同详情页")
        lines_out.append({"key": key, "label": label, "pages": pages, "cards": matrix,
                          "uniqImg": len({c['img'] for c in matrix}),
                          "uniqHref": len({c['href'] for c in matrix})})

    # ---------- 型号档案 ----------
    series_index = {}
    for key, label, pages, dir_name in LINES:
        for p in sorted((PAGES_DIR / dir_name).glob("*.astro")):
            info = parse_series_page(p, key)
            series_index[info["slug"]] = info

    for slug, info in series_index.items():
        src = slug_image.get(slug, {})
        info.setdefault("image", src.get("image", ""))
        # 页面参数表没填 Dimensions 的型号：用 DIM_OVERRIDE 补录，并标记 override
        if slug in DIM_OVERRIDE:
            w, d, h = DIM_OVERRIDE[slug]
            info["dim"] = {"raw": "%d×%d×%d" % (w, d, h), "w": w, "d": d, "h": h,
                           "u": round(h / 44.45), "l": round(w * d * h / 1e6, 1),
                           "override": True}

    img_map = load_map(series_index)

    # 图 → 被哪些产品线使用（用于判定「本线专属 / 借自他线」）
    line_of_image = {}
    for ln in lines_out:
        for cd in ln["cards"]:
            line_of_image.setdefault(cd["img"], set()).add(ln["key"])

    # ---------- 尺寸组 × 形态 矩阵（三线共模） ----------
    FAMILY_TAIL = ("-rackmount", "-din-rail", "-wall-mounted", "-rack-mounted", "-mounted")

    def _as_list(v):
        if not v:
            return []
        if isinstance(v, str):
            return [v]
        return [x for x in v if x]

    def _dim_h(info, slug):
        if slug in DIM_OVERRIDE:
            return DIM_OVERRIDE[slug][2]
        return info["dim"]["h"]

    def _form_of(img):
        mnt = img_map.get("mounts", {}).get(img, "")
        scr = img_map.get("screens", {}).get(img, "")
        if mnt in ("wall", "rail") and scr in ("with", "without"):
            return "%s-%s" % (mnt, "screen" if scr == "with" else "noscreen")
        if mnt in ("wall", "rail"):
            return mnt
        return "generic"

    def _family(img):
        """同一个系列的不同安装形态图归为一族：ultra-slim / ultra-slim-rackmount → ultra-slim"""
        b = img.rsplit(".", 1)[0]
        hit = True
        while hit:
            hit = False
            for tail in FAMILY_TAIL:
                if b.endswith(tail):
                    b = b[: -len(tail)]
                    hit = True
        return b

    # 第一遍：每组每格声明了哪些图
    decl_map, generic_map = {}, {}
    for g in DIM_GROUPS:
        node = (img_map.get("matrix") or {}).get(str(g["h"])) or {}
        decl_map[g["h"]] = {fk: _as_list((node.get("forms") or {}).get(fk)) for fk in g["forms"]}
        generic_map[g["h"]] = [x for x in _as_list(node.get("generic")) if x in existing]

    def _forms_of(img, h, group_forms, generic):
        """一个型号该落在本尺寸组的哪些形态格（同系列不同安装形态都算它的位子）"""
        if generic and not any(decl_map[h].values()):
            return ["generic"]
        fam = _family(img)
        hits = [fk for fk in group_forms
                if any(_family(x) == fam for x in decl_map[h].get(fk, []))]
        if hits:
            return hits
        return ["generic"] if generic else [_form_of(img)]

    dim_matrix = []
    matrix_used = set()
    need_total = fill_total = cover_total = 0
    for g in DIM_GROUPS:
        h = g["h"]
        decl_forms, generic = decl_map[h], generic_map[h]

        members = []
        for slug, info in series_index.items():
            if _dim_h(info, slug) != h:
                continue
            img = info.get("image", "")
            members.append({
                "slug": slug, "line": info["line"], "name": info["name"],
                "image": img, "dimOverride": slug in DIM_OVERRIDE,
                "forms": _forms_of(img, h, g["forms"], generic),
            })

        def _models_in(fk):
            return [m for m in members if fk in m["forms"]]

        rows = []
        all_generic = not any(decl_forms.values())
        for fk in g["forms"]:
            decl = decl_forms.get(fk) or []
            ok = [d for d in decl if d in existing]
            bad = [d for d in decl if d not in existing]
            if ok:
                state = "own"
            elif generic and not all_generic:
                state = "generic"
            else:
                state = "miss"
            cell_imgs = ok if ok else (generic if state == "generic" else [])
            for x in cell_imgs:
                matrix_used.add(x)
            if all_generic:
                continue          # 整组无形态区分 → 下面只出「通用外观」一行
            rows.append({
                "form": fk, "label": FORM_LABEL.get(fk, fk),
                "imgs": cell_imgs, "bad": bad, "state": state, "need": True,
                "models": _models_in(fk),
                "suggest": "products-ahf-%s-%s.webp" % (g["slug"], fk),
            })
        if generic or any("generic" in m["forms"] for m in members):
            for x in generic:
                matrix_used.add(x)
            rows.append({
                "form": "generic", "label": FORM_LABEL["generic"],
                "imgs": generic, "bad": [],
                "state": "generic" if generic else "miss",
                "need": False, "models": _models_in("generic"), "suggest": "",
            })

        need = len(g["forms"])
        filled = len([r for r in rows if r["need"] and r["state"] == "own"])
        # 通用图覆盖 = 整组通用时算全覆盖；否则只算「被通用图顶上的格」
        cover = need if all_generic else len([r for r in rows if r["need"] and r["state"] != "miss"])
        need_total += need
        fill_total += filled
        cover_total += cover
        dim_matrix.append({
            "h": h, "slug": g["slug"], "label": g["label"],
            "size": "%d×%d×%d" % (g["w"], g["d"], g["h"]),
            "w": g["w"], "d": g["d"], "u": round(h / 44.45, 1),
            "need": need, "filled": filled, "cover": cover,
            "genericOnly": all_generic,
            "forms": g["forms"], "rows": rows,
            "pending": ([] if not all_generic else [
                {"form": fk, "label": FORM_LABEL.get(fk, fk),
                 "suggest": "products-ahf-%s-%s.webp" % (g["slug"], fk)}
                for fk in g["forms"]]),
            "modelCount": len(members),
            "seriesLines": sorted({m["line"] for m in members}),
        })

    models = []
    spec_total = spec_filled = 0
    for key, label, pages, dir_name in LINES:
        for slug, info in series_index.items():
            if info["line"] != key:
                continue
            entry = img_map["series"].get(slug, {})
            series_img = entry.get("image") or info.get("image") or ""
            specs = entry.get("specs", {}) or {}
            # 4 个形态列：导轨式带屏 / 导轨式不带屏 / 机架式带屏 / 机架式不带屏
            mount_kind = img_map.get("mounts", {}).get(series_img, "")
            screen_kind = img_map.get("screens", {}).get(series_img, "")
            default_form = ""
            if mount_kind in ("rail", "wall") and screen_kind in ("with", "without"):
                default_form = "%s-%s" % (mount_kind, "screen" if screen_kind == "with" else "noscreen")
            short = slug[:-len("-" + key.lower())] if slug.endswith("-" + key.lower()) else slug
            forms = entry.get("forms", {}) or {}
            rows = []
            for cap in info["caps"]:
                for volt in info["volts"]:
                    cells = []
                    for fk, flabel in FORM_COLS:
                        custom = forms.get(fk, "") or specs.get("%s|%s|%s" % (cap, volt, fk), "")
                        if custom and custom in existing:
                            img, own, declared = custom, True, ""
                        elif custom:
                            img, own, declared = "", False, custom
                        elif fk == default_form:
                            img, own, declared = series_img, False, ""
                        elif not default_form and mount_kind in ("any", "cabinet") and series_img:
                            # 通用外观图：4 个形态列都挂同一张，标为「通用」
                            img, own, declared = series_img, False, ""
                        else:
                            img, own, declared = "", False, ""
                        spec_total += 1
                        if own:
                            spec_filled += 1
                        cells.append({
                            "form": fk, "label": flabel, "img": img, "own": own,
                            "generic": bool(img) and not own and fk != default_form,
                            "declared": declared,
                            "suggest": "products-%s-%s-%s-%s-%s.webp" % (
                                key.lower(), short, cap.lower(), volt.lower(), fk),
                        })
                    rows.append({"cap": cap, "volt": volt, "cells": cells})
            owners = line_of_image.get(series_img, set())
            native = ""
            low = series_img.lower()
            if "asvg" in low:
                native = "ASVG"
            elif "svg" in low:
                native = "SVG"
            elif "ahf" in low:
                native = "AHF"
            if not series_img or series_img not in existing:
                owner, shared_with = "missing", []
            elif native == key:
                owner, shared_with = "own", []
            elif native:
                owner, shared_with = "borrow", [native]
            elif owners:
                owner, shared_with = "shared", sorted(owners - {key})
            else:
                owner, shared_with = "unused", []
            models.append({
                "line": key, "slug": slug, "name": info["name"], "prefix": info["prefix"],
                "caps": info["caps"], "volts": info["volts"],
                "wiring": info["wiring"], "mount": info["mount"], "protect": info["protect"],
                "specVoltage": info["specVoltage"], "specCapacity": info["specCapacity"],
                "dim": info["dim"],
                "image": series_img, "refs": ref_index.get(series_img, 0),
                "owner": owner, "sharedWith": shared_with,
                "screen": img_map.get("screens", {}).get(series_img, ""),
                "mountForm": img_map.get("mounts", {}).get(series_img, ""),
                "rows": rows, "defaultForm": default_form,
                "formOwn": len([fk for fk, _ in FORM_COLS if (forms.get(fk) or "") in existing and forms.get(fk)]),
                "formFilled": len([fk for fk, _ in FORM_COLS if ((forms.get(fk) or "") in existing and forms.get(fk)) or fk == default_form or (not default_form and mount_kind in ("any", "cabinet"))]),
                "ownCount": sum(1 for r in rows for c in r["cells"] if c["own"]),
                "seriesMissing": bool(series_img) and series_img not in existing,
            })

    stats = {
        "total": len(imgs), "bytes": sum(i["bytes"] for i in imgs),
        "unused": sum(1 for i in imgs if i["refs"] == 0),
        "missing": len(missing),
        "dupgroups": sum(1 for v in by_md5.values() if len(v) > 1),
    }
    cats = {}
    for i in imgs:
        cats[i["cat"]] = cats.get(i["cat"], 0) + 1

    def is_deco(rel):
        n = rel.lower()
        return any(k in n for k in ("hero", "-bg", "industry", "case-study", "monitoring",
                                    "series-", "key-features", "index-product"))

    idle_pool = [i["path"] for i in imgs
                 if i["cat"] == "产品图" and i["refs"] == 0 and not is_deco(i["path"])]
    alt_pool = [i["path"] for i in imgs
                if i["cat"] == "产品图" and any(k in i["path"].lower() for k in ("asvg", "-svg"))
                and not is_deco(i["path"]) and "working-principle" not in i["path"]]

    # 矩阵候选图池：产品图里既没进矩阵、也没当卡片图、也不是响应式变体的
    card_imgs = {cd["img"] for ln in lines_out for cd in ln["cards"]}
    matrix_pool = []
    for i in imgs:
        p = i["path"]
        if i["cat"] != "产品图" or is_deco(p):
            continue
        if re.search(r"-(480w|960w)\.", p) or "working-principle" in p:
            continue
        if p in matrix_used or p in card_imgs:
            continue
        matrix_pool.append(p)

    payload = {
        "generated": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "stats": stats, "cats": cats, "images": imgs, "missing": missing,
        "imgBase": "../public/assets/images/",
        "thumbs": thumbs,
        "larges": larges,
        "lines": lines_out, "langs": LANGS, "models": models,
        "dimMatrix": dim_matrix,
        "dimStat": {"need": need_total, "filled": fill_total, "cover": cover_total,
                    "groups": len(dim_matrix),
                    "models": sum(g["modelCount"] for g in dim_matrix)},
        "formLabel": FORM_LABEL,
        "cardCheck": {"pages": card_pages, "slots": card_slots, "issues": card_issues},
        "specStat": {"total": spec_total, "filled": spec_filled},
        "formCols": FORM_COLS,
        "idlePool": idle_pool, "altPool": alt_pool, "matrixPool": matrix_pool,
        "screens": img_map.get("screens", {}),
        "mounts": img_map.get("mounts", {}),
        "naming": img_map.get("naming", ""),
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUT_HTML, "w", encoding="utf-8", newline="\n") as f:
        f.write(HTML.replace("__IMG_JSON__", json.dumps(payload, ensure_ascii=False)))

    print("生成:", OUT_HTML)
    print("映射主数据:", MAP_JSON)
    print("尺寸矩阵: %d 组（1U/2U/3U/4U/特化/IP65）· 需图 %d 格 · 专属已配 %d · 通用图覆盖 %d · 缺 %d"
          % (len(dim_matrix), need_total, fill_total, cover_total, need_total - cover_total))
    for g in dim_matrix:
        miss = [r["label"] for r in g["rows"] if r["need"] and r["state"] == "miss"]
        print("  %-5s %-17s 形态 %d 格 / 已配 %d / 通用 %d / 型号 %d%s"
              % (g["label"], g["size"], g["need"], g["filled"],
                 g["cover"] - g["filled"], g["modelCount"],
                 ("  ← 缺: " + "、".join(miss)) if miss else ""))
    print("型号: %d 个 / 规格格 %d 个（已配专属图 %d）/ 系列图 %d 张"
          % (len(models), spec_total, spec_filled, len({m['image'] for m in models})))
    print("8 卡检查: %d 页 / %d 卡位 / 问题 %d 条" % (card_pages, card_slots, len(card_issues)))
    print("图片: %d 张 / %.1f MB / 未引用 %d / 缺失 %d / 重复组 %d"
          % (stats["total"], stats["bytes"] / 1048576, stats["unused"], stats["missing"], stats["dupgroups"]))
    sys.stdout.flush()


HTML = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>产品图管理台 · CHITEK</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 20px 24px 60px; background: #fff; color: #1a1a1a;
    font: 13px/1.55 -apple-system, "Segoe UI", "Microsoft YaHei", Arial, sans-serif; }
  h1 { font-size: 18px; margin: 0 0 4px; font-weight: 700; }
  .sub { color: #777; font-size: 12px; }
  .tabs { margin: 14px 0 0; display: flex; gap: 18px; border-bottom: 1px solid #e5e5e5; }
  .tab { padding: 7px 2px; cursor: pointer; color: #666; border-bottom: 2px solid transparent; user-select: none; }
  .tab.on { color: #1a1a1a; border-bottom-color: #EA511E; font-weight: 600; }
  .bar { margin: 12px 0 10px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  input[type=search], select { font: inherit; padding: 5px 8px; border: 1px solid #ccc; border-radius: 2px; background: #fff; color: #1a1a1a; }
  input[type=search] { width: 240px; }
  .stat { color: #444; }
  .warn { color: #c0392b; }
  .ok { color: #1e7a3c; }
  table { border-collapse: collapse; width: 100%; table-layout: fixed; }
  th, td { border-bottom: 1px solid #eee; padding: 6px 8px; text-align: left; vertical-align: middle; }
  th { position: sticky; top: 0; background: #fafafa; font-weight: 600; font-size: 12px; color: #555;
    border-bottom: 1px solid #ddd; white-space: nowrap; z-index: 2; }
  thead th[data-k] { cursor: pointer; user-select: none; }
  .thumb { width: 44px; height: 44px; object-fit: contain; background: #f7f7f7; display: block; }
  .thumb.sm { width: 38px; height: 38px; }
  .name { font-family: Consolas, "Courier New", monospace; font-size: 11.5px; word-break: break-all; color: #444; }
  .num { font-variant-numeric: tabular-nums; color: #444; white-space: nowrap; }
  .muted { color: #999; }
  .alt { color: #333; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .tag { display: inline-block; padding: 0 5px; border: 1px solid #ddd; border-radius: 2px; font-size: 11px; color: #666; }
  .tag.prod { border-color: #f0b9a6; color: #b8410f; }
  .tag.bad { border-color: #e0a0a0; color: #c0392b; }
  .tag.dup { border-color: #c9c07a; color: #8a7400; }
  .tag.good { border-color: #b7d8c0; color: #1e7a3c; }
  .tag.own { border-color: #f0b9a6; color: #b8410f; background: #fdf3ee; }
  .pos { font-variant-numeric: tabular-nums; font-weight: 700; color: #EA511E; }
  button.copy, button.mini { font: inherit; font-size: 12px; padding: 2px 7px; border: 1px solid #ccc;
    background: #fff; border-radius: 2px; cursor: pointer; color: #333; }
  button.copy:hover, button.mini:hover { border-color: #888; }
  tr.row:hover { background: #fcfcfc; }
  tr.row { cursor: pointer; }
  tr.detail > td { background: #fafafa; padding: 10px; }
  tr.detail table { width: auto; min-width: 70%; }
  tr.detail th, tr.detail td { border: 1px solid #e8e8e8; font-size: 12px; padding: 4px 6px; background: #fff; }
  tr.detail th { background: #f4f4f4; position: static; }
  .lbl { color: #999; margin-right: 6px; }
  .group { margin-top: 26px; }
  .group h2 { font-size: 14px; margin: 0 0 2px; }
  .group .meta { color: #888; font-size: 12px; margin-bottom: 8px; }
  .cell { width: 128px; text-align: center; padding: 5px 3px !important; }
  .cell img { margin: 0 auto 2px; }
  .cell .fn { display: block; font-family: Consolas, monospace; font-size: 10px; color: #888;
    word-break: break-all; line-height: 1.25; }
  .cell.own { background: #fdf6f2; }
  .cell.gen { background: #f7f7f7; }
  .cell.miss .fn { font-size: 9px; color: #b9a2a2; line-height: 1.15; }
  .cell.own img { background: #fff; }
  .cell.miss { background: #fdf0f0; }
  .mximg { display: flex; gap: 12px 26px; flex-wrap: wrap; align-items: center; }
  .mximg figure { margin: 0; display: flex; align-items: center; gap: 10px; }
  .mximg .fn { display: block; font-family: Consolas, monospace; font-size: 11px; color: #666;
    word-break: break-all; line-height: 1.45; max-width: 210px; margin: 0; }
  .thumb.lg { width: 92px; height: 92px; }
  #mxGroups .mximg { min-height: 92px; }
  #mxGroups td { padding: 12px 10px; }
  #mxGroups th, #mxGroups td { vertical-align: middle; }
  td.st-own { background: #fdf7f3; }
  td.st-gen { background: #f7f7f7; }
  td.st-miss { background: #fdf2f2; }
  .mxh { font-family: Consolas, monospace; font-size: 11.5px; color: #444; }
  .mxh b { font-family: inherit; color: #EA511E; }
  .spec-grid th.rh { background: #f4f4f4; font-weight: 600; white-space: nowrap; }
  .pool { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
  .pool .pi { width: 140px; border: 1px solid #eee; padding: 6px; }
  .pool .pi img { width: 100%; height: 92px; object-fit: contain; background: #f7f7f7; display: block; }
  .pool .pi .fn { font-family: Consolas, monospace; font-size: 10.5px; color: #555; word-break: break-all; margin-top: 4px; line-height: 1.3; }
  .issues { margin: 10px 0 0; padding: 8px 10px; border: 1px solid #f0d0d0; background: #fdf7f7; }
  .issues div { color: #c0392b; font-size: 12px; font-family: Consolas, monospace; }
  .hint { color: #777; font-size: 12px; margin-top: 26px; border-top: 1px solid #eee; padding-top: 10px; }
  .hint code { background: #f4f4f4; padding: 1px 4px; font-size: 11.5px; }
  .empty { color: #999; padding: 10px 0; }
  img[data-p] { cursor: zoom-in; }
  #lb { position: fixed; inset: 0; background: rgba(0,0,0,.84); z-index: 99; cursor: zoom-out;
    display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
  #lb img { max-width: 92vw; max-height: 82vh; background: #fff; display: block; }
  #lb .cap { color: #eee; font: 12px/1.5 Consolas, monospace; margin-top: 10px; word-break: break-all; text-align: center; }
  #lb .cap b { color: #fff; font-weight: 600; }
  [hidden] { display: none !important; }
</style>
</head>
<body>

<h1>产品图管理台</h1>
<div class="sub">CHITEK · 尺寸规格 × 形态 → 产品图（三线共模）· 数据快照：<span id="gen"></span> · 本页不参与站点构建，也不上传</div>

<div class="tabs">
  <div class="tab on" data-tab="matrix">产品图矩阵（尺寸 × 形态）</div>
  <div class="tab" data-tab="models">型号台账（24 型号）</div>
  <div class="tab" data-tab="screen">形态分类（屏 / 安装）</div>
  <div class="tab" data-tab="cards">8 产品卡（5 语一致性）</div>
  <div class="tab" data-tab="all">全部图片（<span id="cntAll"></span>）</div>
</div>

<!-- ================= 型号 · 规格 ================= -->
<section id="pane-models" hidden>
  <div class="bar">
    <input type="search" id="q0" placeholder="搜型号 / 系列 / 规格 / 图片名">
    <select id="st0">
      <option value="all">全部型号</option>
      <option value="noown">只看没有专属图的</option>
      <option value="own">只看已有专属图的</option>
      <option value="scr-with">只看带小屏</option>
      <option value="scr-without">只看不带小屏</option>
      <option value="mt-rail">只看导轨式</option>
      <option value="mt-wall">只看壁挂式</option>
      <option value="mt-cabinet">只看机柜式</option>
    </select>
    <button class="mini" id="csv">下载映射 CSV</button>
    <span class="stat" id="stat0"></span>
  </div>
  <div id="groups0"></div>
  <div class="section" id="poolWrap" hidden>
    <h2>可指定图池 <span class="muted" id="poolCnt"></span></h2>
    <div class="sub">这些产品图目前没挂到任何型号（含闲置图 + SVG/ASVG 候选图）。要启用就把文件名写进 <code>product-image-map.json</code> 对应型号的 <code>image</code> 或 <code>specs</code>。</div>
    <div id="pool" class="pool"></div>
  </div>
</section>

<!-- ================= 形态分类 ================= -->
<section id="pane-screen" hidden>
  <div class="bar">
    <select id="dimSel">
      <option value="screens">屏形态：带小屏 / 不带小屏</option>
      <option value="mounts">安装形态：壁挂式 / 导轨式 / 机柜式</option>
    </select>
    <input type="search" id="q3" placeholder="搜文件名 / 型号 / 系列">
    <span class="stat" id="stat3"></span>
  </div>
  <div id="screenGroups"></div>
</section>

<!-- ================= 产品图矩阵：尺寸 × 形态 ================= -->
<section id="pane-matrix">
  <div class="bar">
    <input type="search" id="q5" placeholder="搜尺寸 / 形态 / 型号 / 图片名">
    <select id="st5">
      <option value="all">全部格子</option>
      <option value="miss">只看缺图</option>
      <option value="own">只看已配专属图</option>
      <option value="gen">只看靠通用图覆盖</option>
    </select>
    <button class="mini" id="csv5">下载矩阵 CSV</button>
    <span class="stat" id="stat5"></span>
  </div>
  <div class="sub" style="margin-bottom:10px">
    业务模型：<b>AHF / SVG / ASVG 三线共模</b> —— 同一「尺寸 + 形态」共用一张图，管好一套即可复用。
    安装形态全站只有<b>壁挂式 / 导轨式</b>两种（没有机架式）。1U 只有壁挂 / 导轨、不分带屏；2U 以上再分带屏 / 不带屏。共 6 个尺寸组、22 格图。
  </div>
  <div id="mxGroups"></div>
  <div class="group" id="mxPoolWrap" hidden>
    <h2>可指定图池 <span class="muted" id="mxPoolCnt"></span></h2>
    <div class="sub">这些产品图还没进矩阵 —— 要启用就把文件名写进 <code>product-image-map.json</code> 的 <code>matrix["尺寸高度"].forms["形态"]</code>，或 <code>generic</code>。</div>
    <div id="mxPool" class="pool"></div>
  </div>
</section>

<!-- ================= 8 产品卡 ================= -->
<section id="pane-cards" hidden>
  <div class="bar">
    <select id="lang"></select>
    <input type="search" id="q2" placeholder="搜产品名 / 图片 / 详情页">
    <select id="st2">
      <option value="all">全部卡位</option>
      <option value="bad">只看有问题的</option>
    </select>
    <span class="stat" id="stat2"></span>
  </div>
  <div class="issues" id="issues" hidden></div>
  <div id="groups"></div>
</section>

<!-- ================= 全部图片 ================= -->
<section id="pane-all" hidden>
  <div class="bar">
    <input type="search" id="q" placeholder="搜文件名 / alt / 页面路径">
    <select id="cat"></select>
    <select id="status">
      <option value="all">全部状态</option>
      <option value="unused">未引用</option>
      <option value="used">已被引用</option>
      <option value="dup">有重复文件</option>
    </select>
    <select id="sort">
      <option value="cat">按分类</option>
      <option value="name">按文件名</option>
      <option value="size">按体积（大→小）</option>
      <option value="refs">按引用次数（多→少）</option>
      <option value="px">按像素（大→小）</option>
    </select>
    <span class="stat" id="stat"></span>
  </div>
  <table>
    <colgroup>
      <col style="width:56px"><col style="width:auto"><col style="width:84px"><col style="width:70px">
      <col style="width:64px"><col style="width:56px"><col style="width:36%"><col style="width:66px">
    </colgroup>
    <thead><tr>
      <th>图</th><th data-k="name">文件名</th><th data-k="px">尺寸</th><th data-k="size">体积</th>
      <th data-k="cat">分类</th><th data-k="refs">引用</th><th>alt 文案</th><th>操作</th>
    </tr></thead>
    <tbody id="tb"></tbody>
  </table>
  <div class="section" id="missWrap" hidden>
    <h2>缺失引用 <span class="warn" id="missCnt"></span></h2>
    <div class="sub">代码里引用了，但 public/assets/images 下没有这个文件 —— 一定是死图。</div>
    <table style="margin-top:8px">
      <thead><tr><th>缺失路径</th><th>被这些文件引用</th></tr></thead>
      <tbody id="missTb"></tbody>
    </table>
  </div>
</section>

<div class="hint">
  映射主数据：<code>img-admin/product-image-map.json</code> ——
  <b>主用 <code>matrix</code></b>：<code>matrix["130"].forms["wall-screen"] = 文件名</code>（尺寸组按高度 mm 做 key：45 / 88 / 130 / 175 / 185 / 220）；
  型号级改动看 <code>series[型号].image</code> 与 <code>series[型号].specs</code>。改完重跑：
  <code>C:/Users/lenovo/miniconda3/python.exe D:/download/CHITEK/img-admin/build_product_images.py</code><br>
  建议图名规范：<code id="namingHint"></code>
</div>

<div id="lb" hidden><img id="lbImg" alt=""><div class="cap" id="lbCap"></div></div>

<script id="IMG_DATA" type="application/json">__IMG_JSON__</script>
<script>
(function () {
  var D = JSON.parse(document.getElementById('IMG_DATA').textContent);
  var base = D.imgBase, imgs = D.images, models = D.models;
  document.getElementById('gen').textContent = D.generated;
  document.getElementById('cntAll').textContent = imgs.length;
  document.getElementById('namingHint').textContent = D.naming || 'products-{line}-{series}-{capacity}-{voltage}.webp';

  function kb(n) { return n >= 1048576 ? (n / 1048576).toFixed(2) + ' MB' : Math.round(n / 1024) + ' KB'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function src(p) { return (D.thumbs && D.thumbs[p]) || (base + p); }

  /* 灯箱：所有图片点击放大 */
  function openLb(p) {
    if (!p) return;
    var im = document.getElementById('lbImg');
    im.src = (D.larges && D.larges[p]) || src(p);
    var info = imgs.filter(function (x) { return x.path === p; })[0];
    document.getElementById('lbCap').innerHTML = '<b>' + esc(p) + '</b>' +
      (info ? '　' + (info.w ? info.w + '×' + info.h + '　' : '') + kb(info.bytes) : '') +
      (info ? '　<span style="color:#aaa">' + esc(info.cat) + '</span>' : '');
    document.getElementById('lb').hidden = false;
  }
  function closeLb() { document.getElementById('lb').hidden = true; }
  document.getElementById('lb').addEventListener('click', function (e) {
    if (e.target.id === 'lb') closeLb();   // 只点遮罩关闭，点图片不关闭
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  document.addEventListener('click', function (e) {
    var im = e.target.closest('img[data-p]');
    if (!im) return;
    e.preventDefault(); e.stopPropagation();
    openLb(im.getAttribute('data-p'));
  }, true);
  function copyText(txt, btn) {
    var label = btn.textContent, done = function () { btn.textContent = '已复制'; setTimeout(function () { btn.textContent = label; }, 900); };
    function fb() {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.top = '-100px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = '复制失败'; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fb);
    else fb();
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button.copy');
    if (btn) { e.stopPropagation(); copyText(btn.getAttribute('data-p'), btn); }
  });

  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('on', x === t); });
      document.getElementById('pane-matrix').hidden = t.dataset.tab !== 'matrix';
      document.getElementById('pane-models').hidden = t.dataset.tab !== 'models';
      document.getElementById('pane-screen').hidden = t.dataset.tab !== 'screen';
      document.getElementById('pane-cards').hidden = t.dataset.tab !== 'cards';
      document.getElementById('pane-all').hidden = t.dataset.tab !== 'all';
    });
  });

  /* ============ 型号 · 规格 → 图 ============ */
  function screenTag(s) {
    if (s === 'with') return '<span class="tag own">带小屏</span>';
    if (s === 'without') return '<span class="tag">不带小屏</span>';
    return '<span class="tag">屏未判定</span>';
  }
  function mountTag(s) {
    var map = { rail: '导轨式', wall: '壁挂式', cabinet: '机柜式', any: '通用外观' };
    if (!s) return '<span class="tag">安装未判定</span>';
    return '<span class="tag' + (s === 'wall' ? ' own' : '') + '">' + map[s] + '</span>';
  }

  function modelRow(m) {
    var filled = m.formFilled, total = D.formCols.length;
    var status;
    if (m.owner === 'missing') status = '<span class="tag bad">图缺失</span>';
    else if (m.owner === 'borrow') status = '<span class="tag bad">借 ' + m.sharedWith.join(' / ') + ' 的图</span>';
    else if (m.owner === 'shared') status = '<span class="tag bad">与 ' + m.sharedWith.join(' / ') + ' 共用</span>';
    else if (m.owner === 'own') status = '<span class="tag good">本线专属图</span>';
    else status = '<span class="tag">未挂线</span>';
    var badgeCls = filled >= total ? 'tag good' : (filled ? 'tag own' : 'tag bad');
    status += '<div style="margin-top:3px"><span class="' + badgeCls + '">形态图 ' + filled + '/' + total + '</span></div>';
    status += '<div style="margin-top:3px">' + screenTag(m.screen) + ' ' + mountTag(m.mountForm) + '</div>';
    return '<tr class="row" data-slug="' + esc(m.slug) + '">' +
      '<td><div class="alt"><b>' + esc(m.name) + '</b></div><div class="name">' + esc(m.slug) + '</div></td>' +
      '<td>' + esc(m.specVoltage) + '<div class="muted" style="font-size:11.5px">' + esc(m.specCapacity) + '</div>' +
        '<div class="muted" style="font-size:11px">' + (m.dim.raw ? esc(m.dim.raw) + ' mm · ' + m.dim.u + 'U' : '尺寸未标注') + '</div></td>' +
      '<td class="name">' + (m.prefix ? esc(m.prefix) + '-' : '<span class="muted">未定义</span>') +
        '<div class="muted" style="font-size:11px">' + m.caps.length + ' 容量 × ' + m.volts.length + ' 电压 = ' + total + ' 格</div></td>' +
      '<td><img class="thumb" loading="lazy" data-p="' + esc(m.image) + '" src="' + src(m.image) + '" alt="" onerror="this.style.visibility=\'hidden\'"><div class="name">' + esc(m.image) + '</div></td>' +
      '<td>' + status + '</td>' +
      '<td><button class="copy" data-p="/assets/images/' + esc(m.image) + '">复制默认图</button></td>' +
      '</tr>' + '<tr class="detail" hidden><td colspan="6">' + matrixHtml(m) + '</td></tr>';
  }

  function matrixHtml(m) {
    var head = '<tr><th style="width:96px">容量</th><th style="width:74px">电压</th>' +
      D.formCols.map(function (c) { return '<th>' + esc(c[1]) + '</th>'; }).join('') + '</tr>';
    var body = m.rows.map(function (r) {
      return '<tr><th class="rh">' + esc(r.cap) + '</th><td class="num" style="background:#fafafa">' + esc(r.volt) + '</td>' +
        r.cells.map(function (c) {
          if (!c.img) {
            return '<td class="cell miss" title="缺图 ｜ 建议命名 ' + esc(c.suggest) + '">' +
              '<span class="muted">—</span><span class="fn">' + esc(c.suggest) + '</span></td>';
          }
          var cls = 'cell' + (c.own ? ' own' : (c.generic ? ' gen' : ''));
          var tip = (c.own ? '形态专属图 ' : '系列默认图 ') + c.img + ' ｜ 建议命名 ' + c.suggest;
          return '<td class="' + cls + '" title="' + esc(tip) + '">' +
            '<img class="thumb sm" loading="lazy" data-p="' + esc(c.img) + '" src="' + src(c.img) + '" alt="">' +
            '<span class="fn">' + (c.own ? esc(c.img) : '<span class="muted">' + (c.generic ? '通用图' : '默认图') + '</span>') + '</span></td>';
        }).join('') + '</tr>';
    }).join('');
    return '<div class="lbl">' + esc(m.slug) + ' · 行=容量×电压，列=4 形态；灰色「—」= 该形态还没配图</div>' +
      '<table class="spec-grid" style="margin-top:6px">' + head + body + '</table>' +
      '<div class="muted" style="margin-top:6px">接线 ' + esc(m.wiring.join(' / ') || '—') +
      ' · 安装 ' + esc(m.mount.join(' / ') || '—') + ' · 防护 ' + esc(m.protect.join(' / ') || '—') + '</div>';
  }

  function renderModels() {
    var q = document.getElementById('q0').value.trim().toLowerCase();
    var st = document.getElementById('st0').value;
    var total = 0, shown = 0, ownModels = 0;

    var html = D.lines.map(function (line) {
      var list = models.filter(function (m) {
        total++;
        if (m.formOwn) ownModels++;
        if (st === 'noown' && m.formOwn) return false;
        if (st === 'own' && !m.formOwn) return false;
        if (st === 'scr-with' && m.screen !== 'with') return false;
        if (st === 'scr-without' && m.screen !== 'without') return false;
        if (st === 'mt-rail' && m.mountForm !== 'rail') return false;
        if (st === 'mt-wall' && m.mountForm !== 'wall') return false;
        if (st === 'mt-cabinet' && m.mountForm !== 'cabinet') return false;
        if (!q) return true;
        var blob = [m.name, m.slug, m.specVoltage, m.specCapacity, m.image, m.prefix, m.caps.join(' '), m.volts.join(' ')].join(' ').toLowerCase();
        return blob.indexOf(q) >= 0;
      }).filter(function (m) { return m.line === line.key; });
      if (!list.length) return '';
      shown += list.length;
      return '<div class="group"><h2>' + line.key + ' · ' + esc(line.label) + '</h2>' +
        '<div class="meta">' + list.length + ' 个型号 · 点一行展开「容量 × 电压」规格矩阵</div>' +
        '<table><colgroup><col style="width:auto"><col style="width:210px"><col style="width:200px">' +
        '<col style="width:190px"><col style="width:130px"><col style="width:96px"></colgroup>' +
        '<thead><tr><th>型号 / 系列</th><th>规格</th><th>料号前缀</th><th>当前图</th><th>状态</th><th>操作</th></tr></thead>' +
        '<tbody>' + list.map(modelRow).join('') + '</tbody></table></div>';
    }).join('');

    document.getElementById('groups0').innerHTML = html || '<div class="empty">没有匹配的型号</div>';
    var ss = D.specStat;
    document.getElementById('stat0').innerHTML =
      '显示 <b>' + shown + '</b> / ' + models.length + ' 个型号 · 已知专属图型号 <b>' + ownModels + '</b>' +
      ' · 形态格 <b>' + ss.filled + '</b> / ' + ss.total + ' 已配图';
  }

  document.getElementById('groups0').addEventListener('click', function (e) {
    if (e.target.closest('button.copy') || e.target.closest('img[data-p]')) return;
    var tr = e.target.closest('tr.row');
    if (tr) { var d = tr.nextElementSibling; if (d && d.classList.contains('detail')) d.hidden = !d.hidden; }
  });
  document.getElementById('q0').addEventListener('input', renderModels);
  document.getElementById('st0').addEventListener('change', renderModels);

  (function renderPool() {
    var used = {};
    models.forEach(function (m) { used[m.image] = 1; });
    var pool = [];
    (D.idlePool || []).forEach(function (p) { pool.push({ p: p, kind: '闲置' }); });
    (D.altPool || []).forEach(function (p) { if (!used[p] && !pool.some(function (x) { return x.p === p; })) pool.push({ p: p, kind: 'SVG/ASVG 候选' }); });
    if (!pool.length) return;
    document.getElementById('poolWrap').hidden = false;
    document.getElementById('poolCnt').textContent = '（' + pool.length + '）';
    document.getElementById('pool').innerHTML = pool.map(function (x) {
      var usedBy = models.filter(function (m) { return m.image === x.p; }).length;
      return '<div class="pi"><img loading="lazy" data-p="' + esc(x.p) + '" src="' + src(x.p) + '" alt="">' +
        '<div class="fn">' + esc(x.p) + '</div>' +
        '<div style="margin-top:4px"><span class="tag' + (x.kind === '闲置' ? '' : ' own') + '">' + x.kind + '</span>' +
        (usedBy ? ' <span class="tag good">已用于 ' + usedBy + '</span>' : '') + '</div>' +
        '<div style="margin-top:4px"><button class="copy" data-p="/assets/images/' + esc(x.p) + '">复制路径</button></div></div>';
    }).join('');
  })();

  document.getElementById('csv').addEventListener('click', function () {
    var rows = [['line', 'model_slug', 'model_name', 'partno_prefix', 'capacity', 'voltage',
                 'form_code', 'form_label', 'image', 'state', 'suggest_name']];
    models.forEach(function (m) {
      m.rows.forEach(function (r) {
        r.cells.forEach(function (c) {
          rows.push([m.line, m.slug, m.name, m.prefix, r.cap, r.volt,
                     c.form, c.label, c.img,
                     c.own ? '专属' : (c.img ? (c.generic ? '通用图' : '默认图') : '缺图'),
                     c.suggest]);
        });
      });
    });
    var csv = '\ufeff' + rows.map(function (r) {
      return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'product-image-map.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });

  /* ============ 形态分类（屏 / 安装） ============ */
  var FORM_DIMS = {
    screens: {
      title: '屏形态',
      defs: [
        { k: 'with', label: '带小屏', note: '前面板有 LCD 显示窗（黑框），可现场读电压 / 电流 / 谐波' },
        { k: 'without', label: '不带小屏', note: '前面板只有接线端子 / 指示灯 / 散热，无显示窗' },
        { k: '', label: '未判定', note: 'screens 里留空 —— 新加的图记得补标' }
      ]
    },
    mounts: {
      title: '安装形态',
      defs: [
        { k: 'wall', label: '壁挂式', note: '壁挂安装，箱体式（含 1U 超薄机型）' },
        { k: 'rail', label: '导轨式', note: 'DIN 导轨安装，箱体式' },
        { k: 'cabinet', label: '机柜式', note: '成套立柜，落地安装' },
        { k: 'any', label: '通用外观', note: '图本身不体现安装方式，各配置共用同一张' },
        { k: '', label: '未判定', note: 'mounts 里留空 —— 新加的图记得补标' }
      ]
    }
  };

  function renderForm() {
    var dim = document.getElementById('dimSel').value;
    var cfg = FORM_DIMS[dim];
    var q = document.getElementById('q3').value.trim().toLowerCase();
    var html = '';
    var counts = [];

    cfg.defs.forEach(function (d) {
      var list = imgs.filter(function (i) {
        return i.cat === '产品图' && ((D[dim] || {})[i.path] || '') === d.k;
      });
      if (!list.length && d.k === '') return;
      counts.push(d.label + ' <b>' + list.length + '</b>');
      var shown = list.filter(function (i) {
        if (!q) return true;
        var users = models.filter(function (m) { return m.image === i.path; })
          .map(function (m) { return m.slug + ' ' + m.name; }).join(' ');
        return (i.path + ' ' + users).toLowerCase().indexOf(q) >= 0;
      });
      html += '<div class="group"><h2>' + d.label + ' <span class="muted">（' + list.length + ' 张）</span></h2>' +
        '<div class="meta">' + d.note + '</div>' +
        (shown.length ? '<div class="pool">' + shown.map(function (i) {
          var users = models.filter(function (m) { return m.image === i.path; });
          return '<div class="pi"><img loading="lazy" data-p="' + esc(i.path) + '" src="' + src(i.path) + '" alt="">' +
            '<div class="fn">' + esc(i.path) + '</div>' +
            '<div style="margin-top:4px;font-size:11px;color:#666">' +
            (users.length ? users.map(function (m) { return esc(m.line + ' · ' + m.slug); }).join('<br>')
              : '<span class="muted">未挂型号</span>') + '</div>' +
            '<div style="margin-top:4px"><button class="copy" data-p="/assets/images/' + esc(i.path) + '">复制路径</button></div></div>';
        }).join('') + '</div>' : '<div class="empty">没有匹配的图</div>') + '</div>';
    });

    document.getElementById('screenGroups').innerHTML = html || '<div class="empty">暂无产品图</div>';
    var byModel = models.reduce(function (a, m) {
      var k = (dim === 'screens')
        ? ({ with: '带屏', without: '不带屏', '': '未定' }[m.screen] || '未定')
        : ({ rail: '导轨', wall: '壁挂', cabinet: '机柜', any: '通用', '': '未定' }[m.mountForm] || '未定');
      a[k] = (a[k] || 0) + 1;
      return a;
    }, {});
    document.getElementById('stat3').innerHTML = counts.join(' · ') + ' · 24 型号：' +
      Object.keys(byModel).map(function (k) { return k + ' <b>' + byModel[k] + '</b>'; }).join(' / ');
  }
  document.getElementById('dimSel').addEventListener('change', renderForm);
  document.getElementById('q3').addEventListener('input', renderForm);

  /* ============ 产品图矩阵：尺寸组 × 形态（三线共模） ============ */
  var STATE_LABEL = {
    own: '<span class="tag good">专属图</span>',
    gen: '<span class="tag">通用图·未分形态</span>',
    miss: '<span class="tag bad">缺图</span>'
  };

  function seriesOf(slug) { return slug.replace(/-(ahf|svg|asvg)$/, ''); }

  function modelsHtml(list) {
    if (!list || !list.length) return '<span class="muted">—</span>';
    var byS = {};
    list.forEach(function (m) {
      var s = seriesOf(m.slug);
      (byS[s] = byS[s] || []).push(m.line);
    });
    var keys = Object.keys(byS);
    return keys.map(function (s) {
      var lines = byS[s];
      var badge = lines.length >= 3 ? '<span class="tag own">三线共模</span>' : '';
      return '<div class="mxh"><b>' + esc(s) + '</b> <span class="muted">' + esc(lines.join(' / ')) + '</span> ' + badge + '</div>';
    }).join('');
  }

  function mxRow(g, r) {
    var stCls = r.state === 'own' ? 'st-own' : (r.state === 'generic' ? 'st-gen' : 'st-miss');
    var imgs = '';
    if (r.imgs.length) {
      imgs = '<div class="mximg">' + r.imgs.map(function (p) {
        return '<figure><img class="thumb lg" loading="lazy" data-p="' + esc(p) + '" src="' + src(p) + '" alt="">' +
          '<figcaption class="fn">' + esc(p) + '</figcaption></figure>';
      }).join('') + '</div>';
    } else {
      imgs = '<div class="mximg"><span class="muted" style="font-size:16px">—</span>' +
        (r.suggest ? '<span class="fn" style="color:#c08a80">' + esc(r.suggest) + '</span>' : '') + '</div>';
    }
    var state = STATE_LABEL[r.state === 'own' ? 'own' : (r.state === 'generic' ? 'gen' : 'miss')];
    if (r.bad && r.bad.length) state += '<div class="name" style="color:#c0392b">文件不存在：' + esc(r.bad.join('、')) + '</div>';
    if (!r.need) state += '<div class="muted" style="font-size:11px">现状槽位 · 不计入 22 格</div>';
    var act = r.imgs.length
      ? '<button class="copy" data-p="/assets/images/' + esc(r.imgs[0]) + '">复制路径</button>'
      : (r.suggest ? '<button class="copy" data-p="/assets/images/' + esc(r.suggest) + '">复制建议名</button>' : '');
    return '<tr class="row"><td><b>' + esc(r.label) + '</b>' +
      '<div class="mxh muted">' + esc(r.form) + '</div></td>' +
      '<td>' + imgs + '</td>' +
      '<td class="' + stCls + '">' + state + '</td>' +
      '<td>' + modelsHtml(r.models) +
      (r.models && r.models.some(function (m) { return m.dimOverride; })
        ? '<div class="muted" style="font-size:11px">尺寸为补录值（页面参数表未填）</div>' : '') + '</td>' +
      '<td>' + act + '</td></tr>';
  }

  function renderMatrix() {
    var q = document.getElementById('q5').value.trim().toLowerCase();
    var st = document.getElementById('st5').value;
    var html = '', shownGroups = 0;

    (D.dimMatrix || []).forEach(function (g) {
      var rows = g.rows.filter(function (r) {
        if (st === 'miss' && !(r.need && r.state === 'miss')) return false;
        if (st === 'own' && !(r.need && r.state === 'own')) return false;
        if (st === 'gen' && !(r.need && r.state === 'generic')) return false;
        if (!q) return true;
        var blob = [g.label, g.size, r.label, r.form, r.suggest,
          r.imgs.join(' '), (r.models || []).map(function (m) { return m.slug + ' ' + m.name + ' ' + m.line; }).join(' ')]
          .join(' ').toLowerCase();
        return blob.indexOf(q) >= 0;
      });
      if (!rows.length) return;
      shownGroups++;
      var miss = g.need - g.cover;
      var head = g.genericOnly
        ? g.need + ' 形态待分 · 现用通用图 · ' + g.modelCount + ' 个型号'
        : g.need + ' 形态 · 已配 ' + g.filled + ' · 通用覆盖 ' + (g.cover - g.filled) +
          ' · 缺 ' + miss + ' · ' + g.modelCount + ' 个型号';
      var pend = '';
      if (g.genericOnly && g.pending && g.pending.length && (!st || st === 'all' || st === 'miss')) {
        pend = '<div class="sub" style="margin-top:6px">待分形态（' + g.pending.length + ' 格）—— ' +
          g.pending.map(function (x) {
            return '<span class="tag">' + esc(x.label) + '</span> <code style="font-size:11px">' + esc(x.suggest) + '</code>';
          }).join('　') + '</div>';
      }
      html += '<div class="group"><h2>' + esc(g.label) + ' · ' + esc(g.size) + ' mm' +
        ' <span class="muted">（' + head + '）</span></h2>' +
        '<div class="meta">≈' + g.u + 'U 高（1U = 44.45 mm）· 体积约 ' + (Math.round(g.w * g.d * g.h / 1000) / 1000) + ' L' +
        ' · 归入本组的产品线：' + esc(g.seriesLines.join(' / ') || '—') + '</div>' +
        '<table><colgroup><col style="width:150px"><col style="width:auto"><col style="width:160px">' +
        '<col style="width:250px"><col style="width:100px"></colgroup>' +
        '<thead><tr><th>形态</th><th>产品图（点图放大）</th><th>状态</th><th>落位型号</th><th>操作</th></tr></thead>' +
        '<tbody>' + rows.map(function (r) { return mxRow(g, r); }).join('') + '</tbody></table>' + pend + '</div>';
    });

    document.getElementById('mxGroups').innerHTML = html || '<div class="empty">没有匹配的格子</div>';
    var s = D.dimStat;
    document.getElementById('stat5').innerHTML = '尺寸组 <b>' + s.groups + '</b> · 需图 <b>' + s.need +
      '</b> 格 · 专属已配 <b class="' + (s.filled ? 'ok' : 'warn') + '">' + s.filled +
      '</b> · 通用图覆盖 <b>' + (s.cover - s.filled) + '</b> · 缺图 <b class="' +
      (s.need - s.cover ? 'warn' : 'ok') + '">' + (s.need - s.cover) + '</b> · 型号 ' + s.models + ' 个';
  }

  function renderMxPool() {
    var list = D.matrixPool || [];
    if (!list.length) return;
    document.getElementById('mxPoolWrap').hidden = false;
    document.getElementById('mxPoolCnt').textContent = '（' + list.length + '）';
    document.getElementById('mxPool').innerHTML = list.map(function (p) {
      var i = imgs.filter(function (x) { return x.path === p; })[0] || {};
      return '<div class="pi"><img loading="lazy" data-p="' + esc(p) + '" src="' + src(p) + '" alt="">' +
        '<div class="fn">' + esc(p) + '</div>' +
        '<div style="margin-top:3px;font-size:11px;color:#666">' + (i.w ? i.w + '×' + i.h : '—') + '</div>' +
        '<div style="margin-top:4px"><button class="copy" data-p="/assets/images/' + esc(p) + '">复制路径</button></div></div>';
    }).join('');
  }

  document.getElementById('q5').addEventListener('input', renderMatrix);
  document.getElementById('st5').addEventListener('change', renderMatrix);

  document.getElementById('csv5').addEventListener('click', function () {
    var rows = [['size_label', 'size_mm', 'u_height', 'form_code', 'form_label',
                 'images', 'state', 'suggest_name', 'models', 'lines']];
    (D.dimMatrix || []).forEach(function (g) {
      g.rows.forEach(function (r) {
        rows.push([g.label, g.size, g.u, r.form, r.label,
          r.imgs.join(' | '),
          r.state === 'own' ? '专属图' : (r.state === 'generic' ? '通用图' : '缺图'),
          r.suggest,
          (r.models || []).map(function (m) { return m.slug; }).join(' | '),
          (r.models || []).map(function (m) { return m.line; }).join(' | ')]);
      });
      (g.pending || []).forEach(function (x) {
        rows.push([g.label, g.size, g.u, x.form, x.label, '', '待分形态', x.suggest, '', '']);
      });
    });
    var csv = '\ufeff' + rows.map(function (r) {
      return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'product-image-matrix.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });

  /* ============ 8 产品卡 ============ */
  var LANG_NAME = { en: 'EN 英文', zh: 'ZH 中文', es: 'ES 西语', ar: 'AR 阿语', pt: 'PT 葡语' };
  var langSel = document.getElementById('lang');
  langSel.innerHTML = D.langs.map(function (l) { return '<option value="' + l + '">' + LANG_NAME[l] + '</option>'; }).join('');
  langSel.value = 'en';

  function cardOf(c, lang) { return c.langs[lang] || c.langs.en || null; }

  function detailHtml(line, c) {
    var rows = D.langs.map(function (l) {
      var d = c.langs[l];
      if (!d) return '<tr><td>' + LANG_NAME[l] + '</td><td class="muted" colspan="4">缺卡</td></tr>';
      var f = [];
      if (c.langs.en && d.img !== c.langs.en.img) f.push('<span class="tag bad">图与EN不同</span>');
      if (d.alt !== d.title) f.push('<span class="tag bad">alt≠标题</span>');
      return '<tr><td>' + LANG_NAME[l] + '</td><td>' + esc(d.title) + '</td><td class="name">' + esc(d.img) + '</td>' +
        '<td>' + (f.length ? f.join(' ') : '<span class="tag good">一致</span>') + '</td>' +
        '<td class="name">' + esc(d.href) + '</td></tr>';
    }).join('');
    return '<div class="lbl">卡位 #' + c.pos + ' · ' + line.key + ' 线 5 语对照</div>' +
      '<table><thead><tr><th>语言</th><th>标题</th><th>图片</th><th>检查</th><th>详情页</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function renderCards() {
    var lang = langSel.value;
    var q = document.getElementById('q2').value.trim().toLowerCase();
    var onlyBad = document.getElementById('st2').value === 'bad';
    var total = 0, shown = 0, badCnt = 0;

    var html = D.lines.map(function (line) {
      var rows = line.cards.filter(function (c) {
        total++;
        var bad = !c.sameImg || c.badAlt.length > 0;
        if (bad) badCnt++;
        if (onlyBad && !bad) return false;
        if (!q) return true;
        var d = cardOf(c, lang);
        return [c.pos, c.title, c.img, c.href, d ? (d.title + ' ' + d.img + ' ' + d.alt + ' ' + d.href) : '']
          .join(' ').toLowerCase().indexOf(q) >= 0;
      });
      if (!rows.length) return '';
      shown += rows.length;
      var body = rows.map(function (c) {
        var d = cardOf(c, lang), title = d ? d.title : c.title, img = d ? d.img : c.img;
        var flags = '';
        if (!c.sameImg) flags += ' <span class="tag bad">5语图不同</span>';
        if (c.badAlt.length) flags += ' <span class="tag bad">alt≠标题</span>';
        if (!flags) flags += ' <span class="tag good">一致</span>';
        return '<tr class="row"><td class="pos">#' + c.pos + '</td>' +
          '<td><img class="thumb" loading="lazy" data-p="' + esc(img) + '" src="' + src(img) + '" alt=""></td>' +
          '<td><div class="alt" title="' + esc(title) + '">' + esc(title || '—') + flags + '</div></td>' +
          '<td class="name">' + esc(img) + '</td><td class="num">' + (c.refs || 0) + '</td>' +
          '<td class="name">' + esc(c.href.replace(/^\/en/, '')) + '</td>' +
          '<td><button class="copy" data-p="/assets/images/' + esc(img) + '">复制路径</button></td></tr>' +
          '<tr class="detail" hidden><td colspan="7">' + detailHtml(line, c) + '</td></tr>';
      }).join('');
      return '<div class="group"><h2>' + line.key + ' · ' + esc(line.label) + '</h2>' +
        '<div class="meta">8 卡 · 唯一图 ' + line.uniqImg + '/8 · 唯一详情页 ' + line.uniqHref + '/8</div>' +
        '<table><colgroup><col style="width:44px"><col style="width:58px"><col style="width:auto">' +
        '<col style="width:260px"><col style="width:50px"><col style="width:190px"><col style="width:66px"></colgroup>' +
        '<thead><tr><th>卡位</th><th>图</th><th>卡片标题（' + LANG_NAME[lang] + '）</th><th>图片文件</th>' +
        '<th>引用</th><th>详情页</th><th>操作</th></tr></thead><tbody>' + body + '</tbody></table></div>';
    }).join('');

    document.getElementById('groups').innerHTML = html || '<div class="empty">没有匹配的卡位</div>';
    document.getElementById('stat2').innerHTML = '显示 <b>' + shown + '</b> / ' + total + ' 个卡位 · 异常 <b class="' +
      (badCnt ? 'warn' : 'ok') + '">' + badCnt + '</b> · 检查页 ' + D.cardCheck.pages + '/15';
  }

  document.getElementById('groups').addEventListener('click', function (e) {
    if (e.target.closest('button.copy') || e.target.closest('img[data-p]')) return;
    var tr = e.target.closest('tr.row');
    if (tr) { var d = tr.nextElementSibling; if (d && d.classList.contains('detail')) d.hidden = !d.hidden; }
  });
  ['lang', 'st2'].forEach(function (id) { document.getElementById(id).addEventListener('change', renderCards); });
  document.getElementById('q2').addEventListener('input', renderCards);

  if (D.cardCheck.issues.length) {
    var box = document.getElementById('issues');
    box.hidden = false;
    box.innerHTML = '<div class="lbl" style="color:#c0392b">一致性问题 ' + D.cardCheck.issues.length + ' 条</div>' +
      D.cardCheck.issues.map(function (s) { return '<div>' + esc(s) + '</div>'; }).join('');
  }

  /* ============ 全部图片 ============ */
  var catSel = document.getElementById('cat');
  var cats = Object.keys(D.cats).sort(function (a, b) { return D.cats[b] - D.cats[a]; });
  catSel.innerHTML = '<option value="all">全部分类（' + imgs.length + '）</option>' +
    cats.map(function (c) { return '<option value="' + c + '">' + c + '（' + D.cats[c] + '）</option>'; }).join('');
  catSel.value = '产品图';

  var sortKey = 'cat', sortDir = 1;
  function cmp(a, b) {
    var k = sortKey, r;
    if (k === 'size') r = b.bytes - a.bytes;
    else if (k === 'refs') r = b.refs - a.refs;
    else if (k === 'px') r = ((b.w || 0) * (b.h || 0)) - ((a.w || 0) * (a.h || 0));
    else if (k === 'name') r = a.name.localeCompare(b.name);
    else r = (a.cat + a.name).localeCompare(b.cat + b.name);
    return r * sortDir;
  }

  function renderAll() {
    var q = document.getElementById('q').value.trim().toLowerCase();
    var cat = catSel.value, st = document.getElementById('status').value;
    var list = imgs.filter(function (i) {
      if (cat !== 'all' && i.cat !== cat) return false;
      if (st === 'unused' && i.refs !== 0) return false;
      if (st === 'used' && i.refs === 0) return false;
      if (st === 'dup' && (!i.dup || !i.dup.length)) return false;
      if (!q) return true;
      return (i.name + ' ' + i.path + ' ' + i.alts.join(' ') + ' ' + i.pages.join(' ')).toLowerCase().indexOf(q) >= 0;
    }).sort(cmp);

    var sum = list.reduce(function (a, i) { return a + i.bytes; }, 0);
    document.getElementById('stat').innerHTML = '显示 <b>' + list.length + '</b> / ' + imgs.length + ' 张 · ' + kb(sum) +
      ' · 未引用 <b class="' + (D.stats.unused ? 'warn' : '') + '">' + D.stats.unused + '</b>' +
      ' · 缺失 <b class="' + (D.stats.missing ? 'warn' : '') + '">' + D.stats.missing + '</b>' +
      ' · 重复组 <b>' + D.stats.dupgroups + '</b>';

    document.getElementById('tb').innerHTML = list.map(function (i) {
      var flags = '';
      if (!i.refs) flags += ' <span class="tag bad">未引用</span>';
      if (i.dup && i.dup.length) flags += ' <span class="tag dup">重复</span>';
      return '<tr class="row"><td><img class="thumb" loading="lazy" data-p="' + esc(i.path) + '" src="' + src(i.path) + '" alt=""></td>' +
        '<td><div class="name">' + esc(i.path) + flags + '</div></td>' +
        '<td class="num">' + (i.w ? i.w + '×' + i.h : '<span class="muted">—</span>') + '</td>' +
        '<td class="num">' + kb(i.bytes) + '</td>' +
        '<td><span class="tag' + (i.cat === '产品图' ? ' prod' : '') + '">' + esc(i.cat) + '</span></td>' +
        '<td class="num">' + (i.refs || '<span class="muted">0</span>') + '</td>' +
        '<td><div class="alt" title="' + esc(i.alts[0] || '') + '">' + (i.alts[0] ? esc(i.alts[0]) : '<span class="muted">—</span>') + '</div></td>' +
        '<td><button class="copy" data-p="/assets/images/' + esc(i.path) + '">复制路径</button></td></tr>' +
        '<tr class="detail" hidden><td colspan="8">' +
          '<div><span class="lbl">路径</span><code>' + esc(i.path) + '</code></div>' +
          (i.alts.length ? '<div style="margin-top:6px"><span class="lbl">alt 文案（' + i.alts.length + ' 种）</span></div><ul>' +
            i.alts.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' : '') +
          (i.pages.length ? '<div><span class="lbl">被引用页面（' + i.pages.length + '）</span></div><ul>' +
            i.pages.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>'
            : '<div class="muted">没有任何页面引用这张图。</div>') +
          (i.dup && i.dup.length ? '<div><span class="lbl">内容相同</span>' + i.dup.map(esc).join('、') + '</div>' : '') +
        '</td></tr>';
    }).join('') || '<tr><td colspan="8" class="empty">没有匹配的图片</td></tr>';
  }

  document.getElementById('tb').addEventListener('click', function (e) {
    if (e.target.closest('button.copy') || e.target.closest('img[data-p]')) return;
    var tr = e.target.closest('tr.row');
    if (tr) { var d = tr.nextElementSibling; if (d && d.classList.contains('detail')) d.hidden = !d.hidden; }
  });
  document.querySelectorAll('th[data-k]').forEach(function (th) {
    th.addEventListener('click', function () {
      var k = th.getAttribute('data-k');
      if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = 1; }
      renderAll();
    });
  });
  ['q', 'cat', 'status', 'sort'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { if (id === 'sort') { sortKey = this.value; sortDir = 1; } renderAll(); });
    el.addEventListener('change', function () { if (id === 'sort') { sortKey = this.value; sortDir = 1; } renderAll(); });
  });

  if (D.missing.length) {
    document.getElementById('missWrap').hidden = false;
    document.getElementById('missCnt').textContent = '（' + D.missing.length + '）';
    document.getElementById('missTb').innerHTML = D.missing.map(function (m) {
      return '<tr><td class="name">' + esc(m.path) + '</td><td class="name">' + m.pages.map(esc).join('<br>') + '</td></tr>';
    }).join('');
  }

  renderMatrix();
  renderMxPool();
  renderModels();
  renderForm();
  renderCards();
  renderAll();
})();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
