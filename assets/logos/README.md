# Client logos

Drop your client logo files in this folder. Any format works (`.svg`, `.png`, `.webp`).

## How to use them in the ticker

1. Add your file to this folder (e.g. `callvera.svg`).
2. Open `js/main.js` and edit the `LOGOS` array at the top:

```js
const LOGOS = [
  { src: "assets/logos/callvera.svg", alt: "Callvera" },
  { src: "assets/logos/affinity.svg", alt: "Affinity Sales Training" },
  // …add as many as you like
];
```

That's it — the ticker duplicates the list automatically for a seamless
infinite scroll, and anything you add appears.

## Tips

- **Best results:** use horizontal/wordmark logos on a transparent
  background (SVG preferred). Taller logos get clipped to 36px height.
- Logos render greyscale and dim by default, and brighten on hover.
- If a file is missing or fails to load, the ticker gracefully falls back
  to showing the logo's `alt` text as a styled wordmark — so the layout
  never breaks while you're populating this folder.
