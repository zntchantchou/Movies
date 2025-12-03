import express from "express";
import fs from "node:fs";
import path from "node:path";
import type { ViteDevServer } from "vite";
import cache from "./src/cache.ts";
import { getCloudMovieDetails } from "./src/http/queries.server.ts";
import config from "./src/config.ts";

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
    // app.use(express.static(clientDist));

    manifest = JSON.parse(
      fs.readFileSync(path.join(clientDist, ".vite/manifest.json"), "utf-8")
    );

    app.locals.manifest = manifest;
    console.log("manifest", manifest);
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

  app.get("/movie-details/:id", async (req, res) => {
    console.log("REQ.IP ", req.ip);
    // id must be validated
    // send error if input is not exactly seven digit integer
    // only allow access from the client (using a key that should not appear on the front-end?) filter req.origin using domain-name + page?
    const movieId = req.params.id;
    const isValidId = /^\d{3,7}$/.test(req.params.id);
    console.log("IS VALID ", isValidId);
    if (!isValidId) {
      return res.status(400).json({ error: "the id is not valid" });
    }
    const cached = cache.get(movieId);
    if (cached) return res.send(cached);
    let movieData;
    try {
      movieData = await getCloudMovieDetails(movieId);
      cache.set(movieId, movieData);
    } catch (e) {
      console.log("ERROR FETCHING MOVIE DETAILS ", e);
    }
    return res.send(movieData);
  });

  app.get("*all", async (req, res) => {
    try {
      const url = req.originalUrl;

      let templateHtml;
      if (isProd) templateHtml = fs.readFileSync("./index.prod.html", "utf-8");
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
      console.log("IsProd ", isProd);

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
  app.listen(config.port, () => console.log(`App listening on port ${3002}`));
});
