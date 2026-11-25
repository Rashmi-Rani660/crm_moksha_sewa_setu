// Prepares the brand logo for the login screen.
//
//   node scripts/build-images.mjs
//
// scripts/images/logo-source.png (white background)
//   -> public/images/moksha-sewa-logo.png (transparent background, trimmed).
// Needs `sharp` (already present as a Next.js dependency).
import { mkdirSync } from "node:fs";
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
