/**
 * Reads data/blogs.json, takes the top 3 newest posts, and injects
 * <a class="info-card"> markup into index.html between the
 * BLOG_PREVIEW_START / BLOG_PREVIEW_END markers.
 *
 * Run: node scripts/build-index-blog-preview.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "blogs.json");
const HTML_PATH = path.join(ROOT, "index.html");

const START_RE = /<!--\s*BLOG_PREVIEW_START\s*-->/;
const END_RE = /<!--\s*BLOG_PREVIEW_END\s*-->/;

const PREVIEW_COUNT = 3;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCard(post) {
  return `
            <a href="${escapeHtml(post.url)}" class="info-card" target="_blank" rel="noopener">
              <div class="info-card-header">
                <span class="info-card-title">${escapeHtml(post.title)}</span>
                <span class="info-card-meta">${escapeHtml(post.displayDate)}</span>
              </div>
              <p class="info-card-desc">${escapeHtml(post.desc)}</p>
            </a>`;
}

function main() {
  const posts = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const top3 = posts.slice(0, PREVIEW_COUNT);
  const rendered = top3.map(renderCard).join("\n") + "\n          ";

  const html = fs.readFileSync(HTML_PATH, "utf8");
  const startMatch = html.match(START_RE);
  const endMatch = html.match(END_RE);

  if (!startMatch || !endMatch) {
    console.error("Could not find BLOG_PREVIEW_START / BLOG_PREVIEW_END markers in index.html");
    process.exit(1);
  }

  const startIdx = startMatch.index + startMatch[0].length;
  const endIdx = endMatch.index;

  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx);

  const newHtml = `${before}\n${rendered}\n            ${after}`;

  fs.writeFileSync(HTML_PATH, newHtml, "utf8");
  console.log(`Wrote top ${top3.length} posts into index.html`);
}

main();