// Prepares the brand logos and favicons.
//
//   node scripts/build-images.mjs
//
// scripts/images/logo-source.png (white background)
//   -> public/images/moksha-sewa-logo-light.png / -dark.png
//      (transparent background, trimmed, with the brand ornament)
//   -> src/app/favicon.ico, icon.png, apple-icon.png
// Needs `sharp` (already present as a Next.js dependency).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/images");
mkdirSync(out, { recursive: true });

const { data, info } = await sharp(
  resolve(root, "scripts/images/logo-source.png"),
)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Turn the white background into alpha ("colour to alpha"), keeping the
// anti-aliased edges clean on any background colour.
const bg = [255, 255, 255];
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  let a = 0;
  for (let c = 0; c < 3; c++) a = Math.max(a, (bg[c] - data[i + c]) / bg[c]);
  a = a < 0.04 ? 0 : Math.min(1, a);
  rgba[j + 3] = Math.round(a * 255);
  for (let c = 0; c < 3; c++) {
    const v = a > 0 ? (data[i + c] - bg[c] * (1 - a)) / a : 0;
    rgba[j + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
}

const result = await sharp(rgba, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 1 })
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });

// ---------------------------------------------------------------------------
// Logos, both with the blue line-dot-line ornament from the brand sheet under
// the "MOKSHA SEWA" wordmark:
//   public/images/moksha-sewa-logo-light.png navy wordmark, light backgrounds
//                                            (login / forgot / verify screens)
//   public/images/moksha-sewa-logo-dark.png  white wordmark, dark backgrounds
//                                            (dashboard sidebar)
// ---------------------------------------------------------------------------
{
  const { data: px, info: li } = await sharp(result.data)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = li.width;
  const H = li.height;
  const rowHasInk = (y) => {
    for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3] > 8) return true;
    return false;
  };
  // The wordmark is the last block of ink; the first empty row above it is
  // the gap between the waves and the text.
  let textTop = H - 1;
  while (textTop > 0 && rowHasInk(textTop)) textTop--;
  textTop++;
  let x0 = W;
  let x1 = 0;
  for (let y = textTop; y < H; y++)
    for (let x = 0; x < W; x++)
      if (px[(y * W + x) * 4 + 3] > 8) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
      }

  const whiteText = Buffer.from(px);
  for (let y = textTop; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      whiteText[i] = whiteText[i + 1] = whiteText[i + 2] = 255;
    }

  // Ornament, proportioned from the brand sheet (relative to wordmark width).
  const tw = x1 - x0;
  const cx = (x0 + x1) / 2;
  const dot = tw * 0.03;
  const half = tw * 0.41;
  const gap = dot * 1.6;
  const thick = tw * 0.012;
  const extra = Math.round(tw * 0.06);
  const cy = H + extra * 0.55;
  const line = (from, to) => {
    // tapered: thin at the outer end, full thickness next to the dot
    const inner = to;
    const outer = from;
    return `<path d="M${outer} ${cy} L${inner} ${cy - thick / 2} L${inner} ${cy + thick / 2} Z" fill="url(#g)"/>`;
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + extra}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#5fb8ee"/><stop offset="0.5" stop-color="#1f8fe0"/><stop offset="1" stop-color="#5fb8ee"/></linearGradient></defs>
    ${line(cx - half, cx - gap)}
    ${line(cx + half, cx + gap)}
    <circle cx="${cx}" cy="${cy}" r="${dot / 2}" fill="#1f8fe0"/>
  </svg>`;

  for (const [name, art] of [
    ["moksha-sewa-logo-light.png", px],
    ["moksha-sewa-logo-dark.png", whiteText],
  ]) {
    await sharp({
      create: { width: W, height: H + extra, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([
        { input: art, raw: { width: W, height: H, channels: 4 }, left: 0, top: 0 },
        { input: Buffer.from(svg), left: 0, top: 0 },
      ])
      .png({ compressionLevel: 9 })
      .toFile(resolve(out, name));
    console.log(`Wrote public/images/${name} (${W}x${H + extra})`);
  }
}

// ---------------------------------------------------------------------------
// Favicons: emblem only (lotus + waves), cropped above the "MOKSHA SEWA" text.
//   src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png
// ---------------------------------------------------------------------------
{
  // Use the logo without the ornament: the wordmark occupies its bottom ~12%.
  const lm = result.info;
  const emblem = await sharp(result.data)
    .extract({ left: 0, top: 0, width: lm.width, height: Math.round(lm.height * 0.875) })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  const square = async (size, background = { r: 0, g: 0, b: 0, alpha: 0 }) => {
    const inner = Math.round(size * 0.92);
    const art = await sharp(emblem)
      .resize(inner, inner, { fit: "inside", kernel: "lanczos3" })
      .png()
      .toBuffer();
    return sharp({
      create: { width: size, height: size, channels: 4, background },
    })
      .composite([{ input: art, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  const appDir = resolve(root, "src/app");
  writeFileSync(resolve(appDir, "icon.png"), await square(512));
  writeFileSync(
    resolve(appDir, "apple-icon.png"),
    await square(180, { r: 255, g: 255, b: 255, alpha: 1 }),
  );

  // Multi-size ICO with PNG payloads.
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((n) => square(n)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  const dir = Buffer.alloc(16 * sizes.length);
  let offset = 6 + dir.length;
  sizes.forEach((n, i) => {
    const o = i * 16;
    dir[o] = n;
    dir[o + 1] = n;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(pngs[i].length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += pngs[i].length;
  });
  writeFileSync(resolve(appDir, "favicon.ico"), Buffer.concat([header, dir, ...pngs]));
  console.log("Wrote src/app/favicon.ico, icon.png, apple-icon.png");
}
