import { createServer } from "vite";
import express from "express";
import fs from "node:fs/promises";

const app = express();
const isProd = process.env.NODE_ENV === "production";
const productionTemplate = await fs.readFile(
  "./dist/client/index.html",
  "utf-8"
);

let viteServer = null;

if (!isProd) {
  viteServer = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(viteServer.middlewares);
} else {
  // add a more efficient way to load static assets
  app.use(express.static("./dist/client"));
}

app.use("*all", async (req, res, next) => {
  const url = req.originalUrl;
  try {
    let template;
    let render;
    if (!isProd && viteServer) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await viteServer.transformIndexHtml(url, template);
      render = (await viteServer.ssrLoadModule("/src/entry-server.tsx")).render;
      console.log("This is the DEV server !");
    } else {
      template = productionTemplate;
      // @ts-expect-error building quick fix
      render = (await import("./dist/server/entry-server.js"))?.render;
      console.log("This is the PROD server !");
    }
    const appHtml = await render(url);
    const html = template
      .replace("<!--app-head-->", () => appHtml.head ?? "")
      .replace("<!--app-html-->", () => appHtml.html ?? "");

    return res.status(200).set({ "Content-Type": "text-html" }).end(html);
  } catch (e) {
    viteServer?.ssrFixStacktrace(e as Error);
    console.log("Error", e);
    next(e);
  }
});

app.listen(3001, () => console.log("Listening on 3001"));
