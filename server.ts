import express from "express";
import fs from "node:fs";
import path from "node:path";
import type { ViteDevServer } from "vite";
import config from "./src/config.ts";
import getMovieDetails from "./src/server/controllers/movie-details.ts";
import { errorMiddleware } from "./src/server/middleware/errors.ts";
import logMiddelware from "./src/server/middleware/logmiddleware.ts";
import Logger from "./src/utils/Logger.ts";
import rateLimit from "express-rate-limit";
import RLHandler from "./src/server/controllers/ratelimit.ts";

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
    app.use(logMiddelware);
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
  // if (import.meta.env?.SSR) { // build specific workaround }
  app.use(
    rateLimit({
      windowMs: (config.rateLimitWindow as unknown as number) * 1000,
      limit: config.rateLimitAmount as unknown as number,
      standardHeaders: true,
      legacyHeaders: false,
      handler: RLHandler,
    })
  );

  app.get("/movie-details/:id", getMovieDetails);
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
  if (!config.port) {
    Logger.error(new Error("Missing port for the server."));
    process.exit();
  }
  app.listen(config.port, () =>
    Logger.info(`App listening on port ${config.port}`)
  );
});
