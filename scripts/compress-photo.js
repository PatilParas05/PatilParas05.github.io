/**
 * compress-photo.js
 * Generates two optimised versions of the About section portrait:
 *   assets/img/paras-opt.webp  — primary (WebP, ~80 quality, ~60-90 KB)
 *   assets/img/paras-opt.jpg   — fallback (JPEG, ~82 quality, ~90-120 KB)
 *
 * Keeps the original parasss.jpeg untouched.
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const SRC  = path.resolve(__dirname, '../assets/img/parasss.jpeg');
const DEST_WEBP = path.resolve(__dirname, '../assets/img/paras-opt.webp');
const DEST_JPG  = path.resolve(__dirname, '../assets/img/paras-opt.jpg');

// Target display size: the frame is clamped to max 280 px wide, but we
// render at 2× for HiDPI screens → 560 px max physical pixels.
const TARGET_WIDTH = 560;

async function compress() {
  const srcStat = fs.statSync(SRC);
  console.log(`Source : ${SRC}`);
  console.log(`         ${(srcStat.size / 1024).toFixed(1)} KB\n`);

  const pipeline = sharp(SRC)
    .rotate()                        // auto-orient from EXIF before anything else
    .resize(TARGET_WIDTH, null, {    // resize width; height auto-scales
      withoutEnlargement: true,
      fit: 'inside',
    });

  // ── WebP (primary) ─────────────────────────────────────────────────────────
  await pipeline
    .clone()
    .webp({ quality: 82, effort: 6 })
    .toFile(DEST_WEBP);

  const webpStat = fs.statSync(DEST_WEBP);
  console.log(`WebP   : ${DEST_WEBP}`);
  console.log(`         ${(webpStat.size / 1024).toFixed(1)} KB  (${((1 - webpStat.size / srcStat.size) * 100).toFixed(0)}% smaller)\n`);

  // ── JPEG fallback ───────────────────────────────────────────────────────────
  await pipeline
    .clone()
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(DEST_JPG);

  const jpgStat = fs.statSync(DEST_JPG);
  console.log(`JPEG   : ${DEST_JPG}`);
  console.log(`         ${(jpgStat.size / 1024).toFixed(1)} KB  (${((1 - jpgStat.size / srcStat.size) * 100).toFixed(0)}% smaller)\n`);

  console.log('Done ✓');
}

compress().catch(err => {
  console.error('Compression failed:', err.message);
  process.exit(1);
});

