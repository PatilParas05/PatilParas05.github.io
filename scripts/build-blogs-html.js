const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "blogs.json");
const HTML_PATH = path.join(ROOT, "blogs.html");

// Tolerant of a space after <!-- (editors like VS Code/Prettier often add one)
const START_RE = /<!--\s*BLOG_LIST_START\s*-->/;
const END_RE = /<!--\s*BLOG_LIST_END\s*-->/;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPost(post) {
  return `
     <a href="${escapeHtml(post.url)}" class="blog-post-row" target="_blank" rel="noopener">
            <div class="blog-post-thumb">
              <img src="${escapeHtml(post.thumb)}" alt="${escapeHtml(post.title)} thumbnail" loading="lazy" />
            </div>
            <div class="blog-post-body">
              <span class="blog-post-number">#${post.number}</span><span class="blog-post-title">${escapeHtml(post.title)}</span>
              <div class="blog-post-date">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                ${escapeHtml(post.displayDate)}
              </div>
              <p class="blog-post-desc">
                ${escapeHtml(post.desc)}
              </p>
            </div>
          </a>`;
}

function main() {
  const posts = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const rendered = posts.map(renderPost).join("\n") + "\n          ";

  const html = fs.readFileSync(HTML_PATH, "utf8");
  const startMatch = html.match(START_RE);
  const endMatch = html.match(END_RE);

  if (!startMatch || !endMatch) {
    console.error("Could not find BLOG_LIST_START / BLOG_LIST_END markers in blogs.html");
    process.exit(1);
  }

  const startIdx = startMatch.index + startMatch[0].length;
  const endIdx = endMatch.index;

  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx);

  const newHtml = `${before}\n${rendered}\n           ${after}`;

  fs.writeFileSync(HTML_PATH, newHtml, "utf8");
  console.log(`Wrote ${posts.length} posts into blogs.html`);
}

main();