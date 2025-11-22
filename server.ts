import express from "express";
import type { ViteDevServer } from "vite";

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  let vite: undefined | ViteDevServer;
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
    // add a more efficient way to load static assets
    app.use(express.static("./dist/client"));
  }

  app.use("*all", async (req, res) => {
    try {
      const url = req.originalUrl;
      let viteHead = !isProd
        ? await vite?.transformIndexHtml(
            url,
            `<html><head></head><body></body></html>`
          )
        : "";
      viteHead = viteHead?.substring(
        viteHead?.indexOf("<head>") + 6,
        viteHead?.indexOf("</head>")
      );

      const entry = await (async () => {
        if (!isProd) return vite?.ssrLoadModule("/src/entry-server.tsx");
        // @ts-expect-error not typed yet
        return import("./dist/server/entry-server.js");
      })();
      entry.render({ req, res, head: viteHead });
    } catch (e) {
      const err = e as Error;
      if (!isProd) vite?.ssrFixStacktrace(err);
      console.log("Error:", err);
      res.status(500).end(err.stack);
    }
  });
  return { app, vite };
}

createServer().then(async ({ app }) => {
  app.listen(3002, () => console.log(`App listening on port ${3002}`));
});
