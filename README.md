# Paras Patil — Portfolio

My personal portfolio site, built with plain HTML/CSS/JS — no framework, no build step for the core site. Live at [patilparas05.github.io](https://patilparas05.github.io).

## ✨ Features

- Light/dark theme toggle with system preference detection
- Scroll-triggered entrance animations (Intersection Observer)
- Fully responsive — mobile nav, adaptive layouts
- Sections: About, Experience, Education, Activities, Projects, Blog
- **Blog list auto-syncs from Medium** — see [Automation](#-automation) below

## 🗂 Project structure
```
.
├── index.html # Home page (About/Experience/Education/Activities + top 3 blog preview)
├── projects.html # Full projects archive
├── blogs.html # Full blog archive (auto-generated list)
├── css/
│ ├── style.css # Core styles, nav, hero, footer, theme tokens
│ ├── sections.css # Reusable "info-section" pattern (About/Experience/etc.)
│ ├── archive.css # Blog list + project card grid styles
│ └── animations.css # Loading screen + scroll entrance animations
├── js/
│ └── app.js # Theme toggle, mobile nav, scroll observer, ticker
├── assets/ # Images, icons, blog thumbnails
├── data/
│ └── blogs.json # Source of truth for all blog posts
├── scripts/ # Node scripts that power the blog automation
│ ├── fetch-blogs.js
│ ├── build-blogs-html.js
│ ├── build-index-blog-preview.js
│ └── generate-sitemap.js
├── .github/workflows/
│ └── sync-blogs.yml # Scheduled GitHub Action that runs the automation
├── sitemap.xml # Auto-generated
└── robots.txt
```

## 🚀 Running locally

This is a static site — no build step required to view it.

```bash
git clone https://github.com/PatilParas05/PatilParas05.github.io.git
cd PatilParas05.github.io
```

Open `index.html` directly in a browser, or serve it locally (recommended, avoids relative-path issues):

```bash
npx serve .
```

## 🤖 Automation

The Blog section is **not hand-maintained**. New posts published on [Medium](https://medium.com/@parasspatil.dev) are picked up automatically and synced into the site.

### How it works
```
Medium RSS feed
│
▼
scripts/fetch-blogs.js ──► data/blogs.json (source of truth)
│
┌──────────────┼──────────────────┐
▼ ▼ ▼
build-blogs-html.js build-index-blog-preview.js generate-sitemap.js
│ │ │
▼ ▼ ▼
blogs.html index.html (top 3) sitemap.xml
```


- **`fetch-blogs.js`** — pulls the Medium RSS feed, compares against `data/blogs.json` by URL and normalized title (to catch cross-posted duplicates), downloads new thumbnail images into `assets/Blogs/`, and appends new entries with an auto-incremented post number.
- **`build-blogs-html.js`** — renders every post in `data/blogs.json` into `blogs.html`, between `<!--BLOG_LIST_START -->` / `<!--BLOG_LIST_END -->` markers.
- **`build-index-blog-preview.js`** — renders the 3 newest posts into the Blog section of `index.html`, between `<!--BLOG_PREVIEW_START -->` / `<!--BLOG_PREVIEW_END -->` markers.
- **`generate-sitemap.js`** — regenerates `sitemap.xml` from the static pages.

### Running the sync manually

```bash
npm install
npm run sync-blogs
```

This runs fetch → build blogs.html → build index.html preview → regenerate sitemap, in order.

Individual scripts can also be run separately:
```bash
npm run fetch-blogs         # check Medium, update data/blogs.json only
npm run build-blogs         # regenerate blogs.html from data/blogs.json
npm run build-index-preview # regenerate the index.html preview
npm run generate-sitemap    # regenerate sitemap.xml
```

### Automatic sync (GitHub Actions)

`.github/workflows/sync-blogs.yml` runs the full sync every **Monday at 06:00 UTC**, and commits/pushes changes automatically if anything changed. It can also be triggered manually from the **Actions** tab → *Sync Medium blog posts* → *Run workflow*.

### Adding/editing a post manually

Don't hand-edit `blogs.html` or `index.html`'s blog preview directly — those are overwritten on every sync. Instead:

1. Edit the relevant entry in `data/blogs.json`
2. Run `npm run sync-blogs` to regenerate everything
3. Commit and push

### ⚠️ Note on generated files

If you're pulling changes after the scheduled Action has run, `git pull` before making local edits — the Action may have pushed its own commit updating `data/blogs.json`, `blogs.html`, `index.html`, and `sitemap.xml`.

## 🛠 Tech

- HTML / CSS / vanilla JS (no framework)
- [Node.js](https://nodejs.org) + [`rss-parser`](https://www.npmjs.com/package/rss-parser) for the blog sync scripts
- GitHub Actions for scheduled automation
- GitHub Pages for hosting

## 📄 License

©2026 [Paras Patil](https://patilparas05.github.io) — Licensed under the  [Apache License 2.0](./LICENSE) Feel free to use this as a structural reference for your own portfolio, but please don't copy the content or Medium posts wholesale.
