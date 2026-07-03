import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dev routing for a multi-page-ish static site:
 *   /            → home (index.html)
 *   /home        → home (index.html)
 *   /404.html    → the 404 page
 *   anything else → 404.html (with a 404 status)
 *
 * Build/prod routing still depends on your host's redirect/404 config
 * (e.g. Netlify `_redirects` or Vercel `vercel.json`).
 */
function kelvoRoutes() {
  return {
    name: "kelvo-routes",
    configureServer(server) {
      const root = server.config.root || __dirname;
      server.middlewares.use((req, res, next) => {
        const method = req.method;
        if (method !== "GET" && method !== "HEAD") return next();

        const pathname = decodeURIComponent((req.url || "/").split("?")[0]);

        // /home → serve the home page (let Vite transform index.html)
        if (pathname === "/home") {
          req.url = "/index.html";
          return next();
        }

        // Known routes + assets → let Vite handle them
        if (
          pathname === "/" ||
          pathname === "/index.html" ||
          pathname === "/404.html"
        ) {
          return next();
        }
        if (path.extname(pathname)) return next(); // .css .js .svg .png …
        if (pathname.startsWith("/@") || pathname.startsWith("/node_modules")) {
          return next();
        }

        // Unknown route → 404 page
        const file = path.join(root, "404.html");
        if (fs.existsSync(file)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          if (method === "HEAD") {
            res.end();
            return;
          }
          fs.createReadStream(file).pipe(res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  appType: "mpa",
  server: {
    port: 5173,
  },
  plugins: [kelvoRoutes()],
});
