# -*- coding: utf-8 -*-
"""把「产品卡用图」接到站点（CHITEK，反复用到）

流程：拿用户新贴的图 与 `F:\\projects\\pic\\pic\\<源图名>` 逐像素比对
  - 差 < 3.0 → 判定同一张，直接复用 `webp\\<源图名>.webp`（已按 1200x1200 正方形规格转好）
  - 否则 → 用新贴的图重新转一张（避免「贴了新版本却用旧图」）
然后复制成 `public/assets/images/<站点文件名>.webp`。

用法：
    python wire_card_image.py --src "4U导轨式-黑.png" --site products-ahf-rack-mounted --clip "clipboard-2026-09-18T08-26-40-808Z-*"
    # --clip 可用通配符；忽略则只做「webp → 站点」复制（不比对）

注意：只做「生成/复制图片」，**不改 .astro**（改名/换 src 由调用方用 Edit 精确改，避免误替换子串）。
"""
import argparse
import glob
import json
import os
import shutil
import sys

PIC_DIR = r"F:\projects\pic\pic"
WEBP_DIR = os.path.join(PIC_DIR, "webp")
SITE_DIR = r"F:\下载\CHITEK\public\assets\images"
CLIP_DIR = r"C:\Users\lenovo\.workbuddy\clipboard-images"
TMP = r"C:\Users\lenovo\WorkBuddy\00_中转站\_wire_tmp"


def _ensure_pillow():
    try:
        import PIL  # noqa: F401
        return
    except ImportError:
        pass
    shared = r"C:\Users\lenovo\.workbuddy\binaries\python\envs\default\Scripts\python.exe"
    if os.path.exists(shared) and os.path.abspath(sys.executable) != os.path.abspath(shared):
        os.execv(shared, [shared, os.path.abspath(__file__)] + sys.argv[1:])
    raise SystemExit("Pillow missing")


_ensure_pillow()
from PIL import Image, ImageChops  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="工作目录里的源图名，如 4U导轨式-黑.png")
    ap.add_argument("--site", required=True, help="站点文件名（不含 .webp）")
    ap.add_argument("--clip", default="", help="剪贴板文件名通配，如 clipboard-2026-09-18T08-26-40-808Z-*")
    a = ap.parse_args()

    src = os.path.join(PIC_DIR, a.src)
    webp = os.path.join(WEBP_DIR, os.path.splitext(a.src)[0] + ".webp")
    rep = {"src": src, "existing_webp": webp, "webp_exists": os.path.exists(webp)}

    if a.clip:
        hits = glob.glob(os.path.join(CLIP_DIR, a.clip))
        if not hits:
            rep["clip"] = "NOT FOUND: " + a.clip
        else:
            clip = hits[0]
            rep["clip"] = clip
            a_img = Image.open(clip).convert("RGB")
            b_img = Image.open(src).convert("RGB").resize(a_img.size, Image.LANCZOS)
            h = ImageChops.difference(a_img, b_img).histogram()
            stat = [sum(x * n for x, n in zip(h[i * 256:(i + 1) * 256], range(256)))
                    / sum(h[i * 256:(i + 1) * 256]) for i in range(3)]
            rep["mean_abs_diff_rgb"] = [round(s, 2) for s in stat]
            if max(stat) < 3.0:
                rep["verdict"] = "SAME -> reuse existing webp"
            else:
                rep["verdict"] = "DIFFERENT -> reconvert from new clip"
                if os.path.exists(TMP):
                    shutil.rmtree(TMP)
                os.makedirs(TMP)
                stem = os.path.splitext(a.src)[0]
                shutil.copy2(clip, os.path.join(TMP, stem + os.path.splitext(clip)[1]))
                sys.path.insert(0, r"F:\下载\CHITEK\docs\_ref")
                import gen_webp_from_pics as G
                out_dir = TMP + "_out"
                if os.path.exists(out_dir):
                    shutil.rmtree(out_dir)
                G.convert(TMP, out_dir)
                webp = os.path.join(out_dir, stem + ".webp")

    assert os.path.exists(webp), "webp not found: " + webp
    dst = os.path.join(SITE_DIR, a.site + ".webp")
    # 覆盖前自动备份旧站点图到可逆中转（AI 删除规则：只进 F:\trash，不进系统回收站）
    if os.path.exists(dst):
        import datetime
        bk = os.path.join(r"F:\trash",
                          datetime.datetime.now().strftime("%Y%m%d") + "_" + a.site + "-img-swap")
        os.makedirs(bk, exist_ok=True)
        shutil.copy2(dst, os.path.join(bk, os.path.basename(dst)))
        rep["backup"] = os.path.join(bk, os.path.basename(dst))
        rep["old_site_bytes"] = os.path.getsize(dst)   # 备份的是覆盖前的旧图
    shutil.copy2(webp, dst)
    rep["site_asset"] = dst
    rep["site_bytes"] = os.path.getsize(dst)
    rep["site_size"] = list(Image.open(dst).size)
    with open(r"C:\Users\lenovo\WorkBuddy\00_中转站\_wire_report.json", "w", encoding="utf-8") as f:
        json.dump(rep, f, ensure_ascii=False, indent=2)
    print(json.dumps(rep, ensure_ascii=False))


if __name__ == "__main__":
    main()
