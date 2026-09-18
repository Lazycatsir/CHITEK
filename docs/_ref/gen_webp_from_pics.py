# -*- coding: utf-8 -*-
"""产品图 → 站点规格 WEBP 批处理器（CHITEK）

规格（2026-09-18 用户确认）：
    整幅等比 contain（**零裁剪**，保留原白底/倒影）→ 居中贴进 **1200x1200 正方形**白底画布 → WEBP quality 82 / method 6

⚠️ **必须是正方形**：卡片图框是 1:1（`.cbp-vm-view-grid .cbp-vm-image{aspect-ratio:1/1}`），
   出方形图 = 零裁切。曾误做成 1200x900 被用户否掉，别再犯。
⚠️ 不要裁剪白边（用户明确要求），除非用户再次要求。

用法：
    python gen_webp_from_pics.py <源目录> [输出目录]
    # 输出目录缺省 = <源目录>/webp

同时产出 contact sheet（6 列缩略图）与 _manifest.json 便于验收。
"""
import os
import sys
import json

SIZE = 1200      # 正方形边长
QUALITY = 82


def _ensure_pillow():
    """托管 python 零第三方包 → 缺 PIL 时自动 re-exec 到共享 venv。"""
    try:
        import PIL  # noqa: F401
        return
    except ImportError:
        pass
    shared = r"C:\Users\lenovo\.workbuddy\binaries\python\envs\default\Scripts\python.exe"
    if os.path.exists(shared) and os.path.abspath(sys.executable) != os.path.abspath(shared):
        os.execv(shared, [shared, os.path.abspath(__file__)] + sys.argv[1:])
    raise SystemExit("Pillow missing: install it into %s" % shared)


_ensure_pillow()

from PIL import Image  # noqa: E402

W, H, Q = SIZE, SIZE, QUALITY      # 正方形画布
EXTS = (".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff")


def convert(src_dir, dst_dir):
    os.makedirs(dst_dir, exist_ok=True)
    names = [n for n in sorted(os.listdir(src_dir))
             if os.path.isfile(os.path.join(src_dir, n)) and n.lower().endswith(EXTS)]

    rows = []
    for n in names:
        src = os.path.join(src_dir, n)
        im = Image.open(src)
        rgba = im.convert("RGBA")
        flat = Image.alpha_composite(
            Image.new("RGBA", rgba.size, (255, 255, 255, 255)), rgba).convert("RGB")

        scale = min(W / flat.width, H / flat.height)
        nw, nh = max(1, int(round(flat.width * scale))), max(1, int(round(flat.height * scale)))
        rs = flat.resize((nw, nh), Image.LANCZOS)

        canvas = Image.new("RGB", (W, H), (255, 255, 255))
        ox, oy = (W - nw) // 2, (H - nh) // 2
        canvas.paste(rs, (ox, oy))

        out = os.path.join(dst_dir, os.path.splitext(n)[0] + ".webp")
        canvas.save(out, "WEBP", quality=Q, method=6)
        rows.append({"src": n, "src_size": list(im.size), "src_bytes": os.path.getsize(src),
                     "out": os.path.basename(out), "out_size": [W, H],
                     "content_in_canvas": [nw, nh], "offset": [ox, oy],
                     "out_bytes": os.path.getsize(out),
                     "fill_ratio": round((nw * nh) / (W * H), 3)})

    # contact sheet：6 列缩略图（正方形）
    cols, cw, ch = 6, 200, 200
    rows_n = (len(rows) + cols - 1) // cols or 1
    sheet = Image.new("RGB", (cols * cw, rows_n * ch), (245, 245, 245))
    for i, r in enumerate(rows):
        t = Image.open(os.path.join(dst_dir, r["out"])).resize((cw, ch), Image.LANCZOS)
        sheet.paste(t, ((i % cols) * cw, (i // cols) * ch))
    sheet_path = os.path.join(dst_dir, "_contact_sheet.png")
    sheet.save(sheet_path)

    manifest = {"src_dir": src_dir, "dst_dir": dst_dir, "canvas": [W, H], "quality": Q,
                "count": len(rows), "contact_sheet": sheet_path, "rows": rows}
    with open(os.path.join(dst_dir, "_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    return manifest


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(1)
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else os.path.join(src, "webp")
    m = convert(src, dst)
    print("converted %d -> %s" % (m["count"], m["dst_dir"]))
