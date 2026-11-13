/**
 * generate-favicons.js
 * Generates Google Search-compliant and Apple/Android compliant favicons from assets/img/parasss.jpeg:
 * - favicon.ico at root (48x48)
 * - assets/img/favicon-48x48.png (Google Search multiple of 48px standard)
 * - assets/img/favicon-96x96.png
 * - assets/img/favicon-192x192.png (Android / PWA)
 * - assets/img/apple-touch-icon.png (180x180 for iOS)
 */

const sharp = require('sharp');
const path = require('path');

const SRC = path.resolve(__dirname, '../assets/img/parasss.jpeg');
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.resolve(__dirname, '../assets/img');

function getCircleMask(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff" /></svg>`
  );
}

async function createFavicon(size) {
  // Resize squarely with attention/center focus, then apply circular mask for clean avatar
  const mask = getCircleMask(size);
  return sharp(SRC)
    .rotate()
    .resize(size, size, { fit: 'cover', position: 'attention' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ quality: 90, compressionLevel: 9 });
}

async function generate() {
  console.log('Generating portrait favicons from', SRC);

  // 1. Root favicon.ico (48x48)
  const icoBuffer = await (await createFavicon(48)).toBuffer();
  await sharp(icoBuffer).toFile(path.join(ROOT, 'favicon.ico'));
  console.log('Created favicon.ico in root (48x48)');

  // 2. assets/img/favicon-48x48.png (Google search standard multiple of 48)
  await (await createFavicon(48)).toFile(path.join(IMG_DIR, 'favicon-48x48.png'));
  console.log('Created assets/img/favicon-48x48.png');

  // 3. assets/img/favicon-96x96.png
  await (await createFavicon(96)).toFile(path.join(IMG_DIR, 'favicon-96x96.png'));
  console.log('Created assets/img/favicon-96x96.png');

  // 4. assets/img/favicon-192x192.png (Android / Chrome)
  await (await createFavicon(192)).toFile(path.join(IMG_DIR, 'favicon-192x192.png'));
  console.log('Created assets/img/favicon-192x192.png');

  // 5. assets/img/apple-touch-icon.png (180x180)
  // Apple touch icon is typically square (iOS applies squircle clipping)
  await sharp(SRC)
    .rotate()
    .resize(180, 180, { fit: 'cover', position: 'attention' })
    .png({ quality: 90 })
    .toFile(path.join(IMG_DIR, 'apple-touch-icon.png'));
  console.log('Created assets/img/apple-touch-icon.png');

  console.log('All portrait favicons generated successfully!');
}

generate().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
