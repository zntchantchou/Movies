import type { Request, Response } from "express";
import {
  createRequestHandler,
  renderRouterToStream,
  RouterServer,
} from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";
// import { Readable } from "node:stream";
// import { ReadableStream as WebStream } from "node:stream/web";

export async function render({
  req,
  res,
  template,
}: {
  req: Request;
  res: Response;
  template: string;
}) {
  const url = new URL(req?.originalUrl || req.url, "http://localhost:3001")
    .href;

  const request = new Request(url, {
    method: req.method,
    headers: (() => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") headers.set(key, value);
        else if (Array.isArray(value)) headers.set(key, value.join(","));
        else if (value != null) headers.set(key, String(value));
      }
      return headers;
    })(),
  });

  let tanstackRouter: ReturnType<typeof createRouter> | undefined;

  const handler = createRequestHandler({
    request,
    createRouter,
  });

  const response = await handler(({ responseHeaders, router }) => {
    tanstackRouter = router;
    return renderRouterToStream({
      request,
      responseHeaders,
      router,
      children: <RouterServer router={router} />,
    });
  });

  res.statusMessage = response.statusText;
  res.status(response.status);
  response.headers.forEach((value, name) => res.setHeader(name, value));
  const headHtml = tanstackRouter?.options.context?.head ?? "";

  // ----- NON-STREAMING -----

  const appHtml = await response.text();
  const html = template
    .replace("<!--app-head-->", headHtml)
    .replace("<!--app-html-->", appHtml);
  return res.send(html);

  // ----- STREAMING -----
  // const splitTemplate = template.split("<!--app-html-->");
  // const templateStart = splitTemplate[0].replace("<!--app-head-->", headHtml);

  // res.write(templateStart);
  // const nodeStream = Readable.fromWeb(response.body as WebStream);
  // await new Promise<void>((resolve, reject) => {
  //   nodeStream.on("data", (chunk) => {
  //     // console.log("Data event ", chunk);
  //     res.write(chunk);
  //   });
  //   nodeStream.on("end", () => resolve());
  //   nodeStream.on("error", reject);
  // });

  // const templateEnd = splitTemplate[1] ?? "";
  // res.write(templateEnd);
  // res.end();
}
