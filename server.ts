import express from "express";
import fs from "node:fs";
import path from "node:path";
import type { ViteDevServer } from "vite";
import config from "./src/config.ts";
import getMovieDetails from "./src/server/controllers/movie-details.ts";
import { errorMiddleware } from "./src/server/middleware/errors.ts";
import logMiddelware from "./src/server/middleware/logger.ts";

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
    app.use(logMiddelware);
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
    // RATE LIMIT
    if (import.meta.env?.SSR) {
      const rateLimit = await (await import("express-rate-limit")).rateLimit;
      app.use(
        rateLimit({
          windowMs: 1 * 60 * 1000,
          limit: 250,
          standardHeaders: true,
          legacyHeaders: false,
        })
      );
    }
  }

  app.get("/movie-details/:id", getMovieDetails);
  app.get("/err", (req, res, next) => {
    console.log("ERR MIDDLEWARE");
    // console.log("HEADERS SENT ", res.headersSent);
    next(Error("This is fucked up"));
    res.send("This is /er");
  });
  app.get("*all", async (req, res) => {
    try {
      const url = req.originalUrl;

      let templateHtml;
      if (isProd)
        templateHtml = fs.readFileSync("./dist/client/index.html", "utf-8");
      else {
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
  app.use(errorMiddleware);
  return { app, vite };
}

createServer().then(({ app }) => {
  app.listen(config.port, () => console.log(`App listening on port ${3002}`));
});
