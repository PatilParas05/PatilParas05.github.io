const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "blogs.json");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");

const SITE_URL = "https://patilparas05.github.io"; 

// Static pages on your site — add/remove as your site grows.
const STATIC_PAGES = [
  { loc: "/", priority: "1.0", changefreq: "monthly" },
  { loc: "/projects.html", priority: "0.8", changefreq: "monthly" },
  { loc: "/blogs.html", priority: "0.8", changefreq: "weekly" },
];

function main() {
  const posts = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  const urls = [
    ...STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  fs.writeFileSync(SITEMAP_PATH, xml, "utf8");
  console.log(`Wrote sitemap.xml with ${urls.length} URLs`);
}

main();