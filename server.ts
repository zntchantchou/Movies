import { createServer } from "vite";
import express from "express";
import fs from "node:fs/promises";

const app = express();
const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

app.use(viteServer.middlewares);
app.use("*all", async (req, res, next) => {
  const url = req.originalUrl;
  try {
    let template = await fs.readFile("./index.html", "utf-8");
    template = await viteServer.transformIndexHtml(url, template);
    const render = (await viteServer.ssrLoadModule("/src/entry-server.tsx"))
      .render;
    const appHtml = await render(url);
    const html = template
      .replace("<!--app-head-->", () => appHtml.head ?? "")
      .replace("<!--app-html-->", () => appHtml.html ?? "");

    return res.status(200).set({ "Content-Type": "text-html" }).end(html);
  } catch (e) {
    viteServer.ssrFixStacktrace(e as Error);
    console.log("Error", e);
    next(e);
  }
});

app.listen(3001, () => console.log("Listening on 3001"));
