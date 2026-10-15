# Descend the Stack: Simon Aron's portfolio

A static, framework-free portfolio. Scrolling takes a pixel miner down through the layers of the stack, from AI products to firmware. There's a **Quick look** mode (`/#quick`) for anyone who wants everything on one plain page.

## Editing content

All content is in [`js/data.js`](js/data.js): profile, experience, skills and projects ("worlds"). The full page and the Quick look are both rendered from it by [`js/render.js`](js/render.js).

### Prerendering (SEO)

The rendered sections and the JSON-LD `Person` data are also baked into `index.html`, so search engines and link previews see the content without running JavaScript. After editing `js/data.js` (or the canonical URL), run:

```bash
node scripts/prerender.mjs
```

`node scripts/prerender.mjs --check` exits with an error if `index.html` is out of date. The page still renders from `data.js` in the browser, so visitors never see stale content. Only crawlers would.

The JSON-LD `url` comes from `<link rel="canonical">` in `index.html`. When the domain changes, update that tag (plus `og:url` and `og:image`) and re-run the script.

### Screenshots and recordings

1. Put the file in `assets/shots/` (`.png`, `.jpg`, `.webp`, `.gif`, `.mp4` or `.webm`).
2. Set `shot` on the project in `js/data.js`, e.g. `shot: 'altdwm.mp4'`.

Boss cards show the media at roughly 16:10. Videos autoplay muted and loop, so keep them short (5–15 s) and small (under ~4 MB).

### Contact form

The form needs a form backend because the site is static. With `formEndpoint` empty it falls back to opening the visitor's mail app.

1. Create a free form at [formspree.io](https://formspree.io) (or a similar service).
2. Paste the endpoint into `formEndpoint` in `js/data.js`.

## Running locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Deploying to GitHub Pages

1. Push this folder to a repo (e.g. `sheepkill15.github.io` for a root URL).
2. Go to **Settings → Pages → Deploy from a branch**, then pick `main` / root.
3. For a custom domain later, add it under **Settings → Pages** (this creates a `CNAME` file).

`.nojekyll` is included so GitHub Pages serves the files as-is.
