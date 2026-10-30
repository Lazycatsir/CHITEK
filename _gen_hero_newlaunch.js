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
const RATIO = 7.0;

(async () => {
  const base = await sharp(SRC).extract(CROP).toBuffer();          // 2172x560
  const W = Math.round(CROP.height * RATIO);                       // 3696
  const pad = Math.round((W - CROP.width) / 2);                    // 762

  // 2026-10-30 用户要求（两次迭代）：
  //   ① 画布右侧「不够」的地方不要模糊铺底（同图模糊会把机器影子糊成一团）→ 改纯黑；
  //   ② 纯黑不能是硬边 → 改成**渐进黑**：从机器右缘之后开始，一直渐隐到画布最右沿。
  // 实现：底 = 纯黑；左侧（文字那侧、被 scrim 压暗）铺一条模糊延续；
  //       右侧在合成完成后叠一层「透明 → 黑」的缓入渐变（起点压在机器右缘之后，绝不压到机器）。
  const feather = Math.round(CROP.width * 0.04);
  const leftStripW = Math.min(W, pad + feather + 8);
  const leftBlur = await sharp(base)
    .resize({ width: W, height: CROP.height, fit: 'fill' })
    .blur(24)
    .modulate({ brightness: 0.58, saturation: 0.85 })
    .extract({ left: 0, top: 0, width: leftStripW, height: CROP.height })
    .toBuffer();

  // 清晰主体左右羽化 4%（羽化后由黑底/模糊底接住，无硬边）
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

  // 右侧「渐进黑」三段式（2026-10-30 第二次迭代：用户要求不要硬边，要渐进过渡）：
  //   ① 机器右缘之后先接一段由照片最右侧 60px 拉伸模糊出来的「延续」——它是地面反光的自然延伸；
  //   ② 延续段两端都做 alpha 羽化（左接照片、右融进黑）；
  //   ③ 最后再叠一层缓入的黑渐变，把最右侧彻底压到纯黑。
  // 这样从机器 → 地面反光 → 渐暗 → 纯黑，中间没有任何一条硬边。
  const machineRight = pad + 2128;                 // 机器右缘（画布坐标）
  const contLeft = pad + CROP.width - 100;         // 延续段与照片重叠 100px
  const contW = W - contLeft;
  const contMaskSvg = `<svg width="${contW}" height="${CROP.height}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.10" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.72" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${contW}" height="${CROP.height}" fill="url(#m)"/></svg>`;
  const contMask = await sharp(Buffer.from(contMaskSvg)).png().toBuffer();
  const cont = await sharp(base)
    .extract({ left: CROP.width - 60, top: 0, width: 60, height: CROP.height })
    .resize({ width: contW + 100, height: CROP.height, fit: 'fill' })
    .blur(30)
    .modulate({ brightness: 0.66, saturation: 0.9 })
    .extract({ left: 100, top: 0, width: contW, height: CROP.height })
    .ensureAlpha()
    .composite([{ input: contMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 缓入黑渐变：机器右缘起步，约 470px 内收成纯黑（够长不像硬边，够短不留一大片蓝雾）
  const fadeKeys = [
    [machineRight, 0], [machineRight + 50, 0.10], [machineRight + 120, 0.32],
    [machineRight + 210, 0.58], [machineRight + 300, 0.82], [machineRight + 470, 1], [W, 1],
  ];
  const stops = fadeKeys
    .map(([px, a]) => `<stop offset="${(px / W).toFixed(4)}" stop-color="#000" stop-opacity="${a}"/>`)
    .join('');
  const rightFadeSvg = `<svg width="${W}" height="${CROP.height}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient></defs>
    <rect width="${W}" height="${CROP.height}" fill="url(#f)"/></svg>`;
  const rightFade = await sharp(Buffer.from(rightFadeSvg)).png().toBuffer();

  const master = await sharp({
    create: { width: W, height: CROP.height, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite([
      { input: leftBlur, left: 0, top: 0 },
      { input: fg, left: pad, top: 0 },
      { input: cont, left: contLeft, top: 0 },   // 照片右缘的模糊延续（地面反光）
      { input: rightFade, left: 0, top: 0 },     // 缓入黑渐变，收成纯黑
    ])
    .png()
    .toBuffer();

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
