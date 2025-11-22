import type { Request, Response } from "express";
import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";
import { Readable } from "node:stream";
import { ReadableStream as WebStream } from "node:stream/web";

export async function render({
  req,
  res,
  head,
}: {
  req: Request;
  res: Response;
  head: string;
}) {
  const url = new URL(req?.originalUrl || req.url, "http://localhost:3001")
    .href;
  const request = new Request(url, {
    method: req.method,
    headers: (() => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        // @ts-expect-error we dont actually know what the headers might be...
        headers.set(key, value as unknown);
      }
      return headers;
    })(),
  });
  // WAY 1

  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter();
      router.update({
        context: { ...router.options.context, head: head },
      });
      return router;
    },
  });

  const response = await handler(({ responseHeaders, router }) =>
    renderRouterToString({
      responseHeaders,
      router,
      children: <RouterServer router={router} />,
    })
  );
  // WAY 2

  res.statusMessage = response.statusText;
  res.status(response.status);

  response.headers.forEach((value, name) => res.setHeader(name, value));
  return Readable.fromWeb(response.body as WebStream).pipe(res);
}
