const fs = require("fs");
const path = require("path");
const Parser = require("rss-parser");

const MEDIUM_USERNAME = "@parasspatil.dev"; 
const FEED_URL = `https://medium.com/feed/${MEDIUM_USERNAME}`

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "blogs.json");

function stripQuery(url) {
    return url.split("?")[0];
  }

  function toDisplayDate(isoDate){
    const d = new Date(isoDate);
    const day = d.getDate();
    const month = d.toLocaleString("en-US",{month:"short"});
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  function extractFirstImage(html){
    if(!html)return null;
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  }

  function stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function main() {
    const parser = new Parser({
      customFields: {
        item: [["content:encoded", "contentEncoded"]],
      },
    });
    const feed = await parser.parseURL(FEED_URL);
  const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const existingUrls = new Set(existing.map((p) => stripQuery(p.url)));
  const existingTitles = new Set(
    existing.map((p) => p.title.toLowerCase().replace(/[^\w\s]/g, "").trim())
  );

  let nextNumber = existing.reduce((max, p) => Math.max(max, p.number), 0) + 1;
  const newPosts = [];

  for (const item of feed.items) {
    const url = stripQuery(item.link);
    const normalizedTitle = item.title.toLowerCase().replace(/[^\w\s]/g, "").trim();
    if (existingUrls.has(url) || existingTitles.has(normalizedTitle)) continue;
    const html = item.contentEncoded || item.content || "";
    const image = extractFirstImage(html);
    const descSource = stripHtml(html);

    newPosts.push({
      number: nextNumber++,
      title: item.title,
      url,
      date: new Date(item.isoDate).toISOString().slice(0, 10),
      displayDate: toDisplayDate(item.isoDate),
      // Medium's feed image is a hotlinked CDN URL — good enough to use
      // directly, or download it locally and swap this path in by hand.
      thumb: image || "assets/Blogs/placeholder.png",
      // Auto-generated excerpt — trim/rewrite this by hand for a better hook.
      desc: descSource.slice(0, 160).replace(/\s+\S*$/, "") + "…",
    });
  }

  if (newPosts.length === 0) {
    console.log("No new posts found.");
    return;
  }

  const updated = [...existing, ...newPosts];
  fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2) + "\n", "utf8");

  console.log(`Added ${newPosts.length} new post(s):`);
  newPosts.forEach((p) => console.log(`  #${p.number} ${p.title}`));
}

main().catch((err) => {
  console.error("Failed to fetch/parse Medium feed:", err);
  process.exit(1);
});