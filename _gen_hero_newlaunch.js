// 2026-10-30 首页 hero 第 4 帧背景图切片（v4：把上下留白做进画布，任何屏幕比例都不裁到机器）
// 源：D:\download\Futuristic CHITEK Active Filter Twin Units.png (2172x724, 3:1)
// 实测：左机 cols 83..1041 / 右机 cols 1168..2128，两机 rows 196..574
//
// 为什么 v3（4.95:1 紧裁）还是「上下被裁」：
//   紧裁把留白全裁掉了、机器占画幅 86% 高 → 矮窗口（如 1440x700，hero 只有 251px 高，
//   框比约 5.7:1）object-cover 仍会切掉上下，而且切的就是机器本身。
// v4：纵向留足留白（rows 110..670，机器只占 67.5% 高）+ 画布横向补到 6.2:1
//   （两侧各 650px 用同图放大模糊铺底、清晰主体左右羽化）→ 宽框只吃两侧虚化区，
//   机器上下始终有 15%~17% 呼吸空间，不会被边缘切到。
const sharp = require('sharp');
const path = require('path');

const SRC = 'D:/download/Futuristic CHITEK Active Filter Twin Units.png';
const OUT = path.resolve(__dirname, 'public/assets/images');

const CROP = { left: 0, top: 110, width: 2172, height: 560 }; // 机器 rows 196..574 → 上下各留 86 / 96
const RATIO = 6.6;

(async () => {
  const base = await sharp(SRC).extract(CROP).toBuffer();          // 2172x560
  const W = Math.round(CROP.height * RATIO);                       // 3472
  const pad = Math.round((W - CROP.width) / 2);                    // 650

  // 两侧铺底：整张拉宽到目标画布 → 模糊 → 压暗（摄影棚背景的延续感）
  const bg = await sharp(base)
    .resize({ width: W, height: CROP.height, fit: 'fill' })
    .blur(24)
    .modulate({ brightness: 0.58, saturation: 0.85 })
    .toBuffer();

  // 清晰主体左右羽化 4%，与模糊底无缝衔接
  const feather = Math.round(CROP.width * 0.04);
  const maskSvg = `<svg width="${CROP.width}" height="${CROP.height}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="${(feather / CROP.width).toFixed(4)}" stop-color="#fff" stop-opacity="1"/>
      <stop offset="${(1 - feather / CROP.width).toFixed(4)}" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${CROP.width}" height="${CROP.height}" fill="url(#g)"/></svg>`;
  const mask = await sharp(Buffer.from(maskSvg)).png().toBuffer();
  const fg = await sharp(base).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

  const master = await sharp(bg).composite([{ input: fg, left: pad, top: 0 }]).toBuffer();

  for (const t of [{ file: 'index-hero-newlaunch.webp' }, { file: 'index-hero-newlaunch-2400w.webp', width: 2400 }]) {
    let p = sharp(master);
    if (t.width) p = p.resize({ width: t.width });
    const info = await p.webp({ quality: 82, effort: 5 }).toFile(path.join(OUT, t.file));
    console.log(t.file, info.width + 'x' + info.height, (info.size / 1024).toFixed(1) + 'KB', (info.width / info.height).toFixed(2) + ':1');
  }

  // 移动/平板：rows 100..700（机器上下各留 96 / 126），cols 1150..1930 对准右机，1.30:1
  const mCrop = { left: 1150, top: 100, width: 780, height: 600 };
  for (const t of [{ file: 'index-hero-newlaunch-m.webp' }, { file: 'index-hero-newlaunch-m-480w.webp', width: 480 }]) {
    let p = sharp(SRC).extract(mCrop);
    if (t.width) p = p.resize({ width: t.width });
    const info = await p.webp({ quality: 82, effort: 5 }).toFile(path.join(OUT, t.file));
    console.log(t.file, info.width + 'x' + info.height, (info.size / 1024).toFixed(1) + 'KB', (info.width / info.height).toFixed(2) + ':1');
  }
})();
