/**
 * generate-favicons.js
 * Generates Google Search-compliant and Apple/Android compliant favicons from assets/img/p.png:
 * - favicon.ico at root (48x48)
 * - assets/img/favicon-48x48.png (Google Search multiple of 48px standard)
 * - assets/img/favicon-96x96.png
 * - assets/img/favicon-192x192.png (Android / PWA)
 * - assets/img/apple-touch-icon.png (180x180 for iOS)
 */

const sharp = require('sharp');
const path = require('path');

const SRC = path.resolve(__dirname, '../assets/img/p.png');
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.resolve(__dirname, '../assets/img');

async function generate() {
  console.log('Generating favicons from', SRC);

  // 1. Root favicon.ico (48x48)
  await sharp(SRC)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(ROOT, 'favicon.ico'));
  console.log('Created favicon.ico in root (48x48)');

  // 2. assets/img/favicon-48x48.png (Google search required multiple of 48)
  await sharp(SRC)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(IMG_DIR, 'favicon-48x48.png'));
  console.log('Created assets/img/favicon-48x48.png');

  // 3. assets/img/favicon-96x96.png
  await sharp(SRC)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(IMG_DIR, 'favicon-96x96.png'));
  console.log('Created assets/img/favicon-96x96.png');

  // 4. assets/img/favicon-192x192.png (Android / Chrome)
  await sharp(SRC)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(IMG_DIR, 'favicon-192x192.png'));
  console.log('Created assets/img/favicon-192x192.png');

  // 5. assets/img/apple-touch-icon.png (180x180)
  await sharp(SRC)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(IMG_DIR, 'apple-touch-icon.png'));
  console.log('Created assets/img/apple-touch-icon.png');

  console.log('All favicons generated successfully!');
}

generate().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
