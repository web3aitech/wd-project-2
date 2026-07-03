# Brand assets

Drop your favicon and social preview banner in this folder. Two placeholder
files are included so the site works out of the box — replace them with your
final artwork whenever you're ready.

## Files the site references

| File | Used for | Recommended size |
|------|----------|------------------|
| `favicon.svg`     | Browser tab icon, apple-touch-icon | 64×64+ (SVG scales) |
| `social-banner.png` | `og:image` / `twitter:image` social preview | **1200×630** PNG/JPG |

> The HTML already points to these exact paths, so just name your files the
> same and overwrite — no code change needed.

## Notes

- **favicon.svg** — the placeholder is a green rounded square with a white
  `k` in *Racing Sans One*. SVG favicons render in all modern browsers; if
  you want legacy `.ico` support, add a `favicon.ico` alongside and add a
  `<link rel="icon" href="/assets/brand/favicon.ico" />` line in `index.html`
  before the `.svg` link.
- **social-banner.png** — the placeholder is provided as `social-banner.svg`
  for design reference. Most social platforms (X, LinkedIn, Slack, etc.) do
  **not** render SVG for `og:image`, so export your final banner as a PNG
  (or JPG) named `social-banner.png` at 1200×630. The `index.html` `<head>`
  already references `/assets/brand/social-banner.png`.

## Updating the brand colors / copy in the placeholders

The placeholders use:
- Green: `#06402B`
- Logo font: *Racing Sans One*
- Body font: *Satoshi*

Edit the SVGs directly to tweak them, or replace them outright with your own
designed assets.
