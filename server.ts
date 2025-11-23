import express from "express";
import fs from "node:fs";
import path from "node:path";
import type { ViteDevServer } from "vite";

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  let vite: ViteDevServer | undefined = undefined;
  let manifest: Record<string, unknown> = {};

  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: "info",
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    const clientDist = path.resolve(root, "dist/client");
    const serverDist = path.resolve(root, "dist/server");

    // Serve static client files
    app.use(express.static(clientDist));

    manifest = JSON.parse(
      fs.readFileSync(path.join(clientDist, ".vite/manifest.json"), "utf-8")
    );

    app.locals.manifest = manifest;
    app.locals.serverDist = serverDist;
  }

  app.use("*all", async (req, res) => {
    try {
      const url = req.originalUrl;

      let templateHtml = "";

      if (!isProd) {
        templateHtml = await vite!.transformIndexHtml(
          url,
          fs.readFileSync("index.html", "utf-8")
        );
      }

      // Load server entry module
      const entry = await (async () => {
        if (!isProd) {
          return vite!.ssrLoadModule("/src/entry-server.tsx");
        }

        return import(path.join(app.locals.serverDist, "entry-server.js"));
      })();
      entry.render({
        req,
        res,
        template: templateHtml,
        manifest: isProd ? app.locals.manifest : null,
      });
    } catch (e) {
      const err = e as Error;
      if (!isProd && vite) vite.ssrFixStacktrace(err);
      console.error(err);
      res.status(500).end(err.stack);
    }
  });

  return { app, vite };
}

createServer().then(({ app }) => {
  app.listen(3002, () => console.log(`App listening on port ${3002}`));
});
