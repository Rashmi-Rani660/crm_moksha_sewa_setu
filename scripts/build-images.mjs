// Prepares the brand logo for the login screen.
//
//   node scripts/build-images.mjs
//
// scripts/images/logo-source.png (white background)
//   -> public/images/moksha-sewa-logo.png (transparent background, trimmed).
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

await sharp(result.data).toFile(resolve(out, "moksha-sewa-logo.png"));
console.log(
  `Wrote public/images/moksha-sewa-logo.png (${result.info.width}x${result.info.height})`,
);

// ---------------------------------------------------------------------------
// Favicons: emblem only (lotus + waves), cropped above the "MOKSHA SEWA" text.
//   src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png
// ---------------------------------------------------------------------------
{
  const logoPath = resolve(out, "moksha-sewa-logo.png");
  const lm = await sharp(logoPath).metadata();
  // The wordmark occupies the bottom ~12% of the trimmed logo.
  const emblem = await sharp(logoPath)
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
