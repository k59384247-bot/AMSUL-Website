// Optimize local static files in place only when their decoded pixels are unchanged.
const fs = require('node:fs/promises');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const sharp = require('sharp');

const root = process.argv[2] || 'public/assets';
const jpegtran = spawnSync('jpegtran', ['-version'], { stdio: 'ignore' }).error?.code !== 'ENOENT';
async function* files(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(file);
    else if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name)) yield file;
  }
}
async function pixels(input) {
  const { data, info } = await sharp(input, { limitInputPixels: false }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return [info.width, info.height, createHash('sha256').update(data).digest('hex')].join(':');
}
(async () => {
  let saved = 0, changed = 0, jpegSkipped = 0;
  for await (const file of files(root)) {
    const original = await fs.readFile(file);
    const metadata = await sharp(original).metadata();
    if ((metadata.pages ?? 1) > 1) continue;
    let candidate;
    if (metadata.format === 'jpeg') {
      if (!jpegtran) { jpegSkipped++; continue; }
      const result = spawnSync('jpegtran', ['-copy', 'all', '-optimize'], { input: original, maxBuffer: 100 * 1024 * 1024 });
      if (result.status !== 0) throw new Error(`jpegtran failed for ${file}: ${result.stderr}`);
      candidate = result.stdout;
    } else if (metadata.format === 'png') {
      candidate = await sharp(original).keepMetadata().png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer();
    } else if (metadata.format === 'webp') {
      candidate = await sharp(original).keepMetadata().webp({ lossless: true, effort: 4 }).toBuffer();
    } else continue;
    if (candidate.length >= original.length) continue;
    const after = await sharp(candidate).metadata();
    if (metadata.orientation !== after.orientation || !Buffer.from(metadata.icc || []).equals(Buffer.from(after.icc || [])) || await pixels(original) !== await pixels(candidate)) continue;
    await fs.writeFile(file, candidate);
    saved += original.length - candidate.length; changed++;
  }
  console.log(`Losslessly optimized ${changed} images, saving ${(saved / 1024 / 1024).toFixed(2)} MB in ${root}.`);
  if (jpegSkipped) console.warn(`Skipped ${jpegSkipped} JPEGs: install jpegtran to optimize them without losing quality.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
