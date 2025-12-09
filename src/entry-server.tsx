import type { Request, Response } from "express";
import httpClient from "./http/client";
import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";
import { dehydrate, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory } from "@tanstack/react-router";
import config from "./config.server";

export async function render({
  req,
  res,
  template,
}: {
  req: Request;
  res: Response;
  template: string;
}) {
  const url = new URL(
    req?.originalUrl || req.url,
    "http://localhost:" + config?.port?.toString()
  ).href;

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
  const history = createMemoryHistory({ initialEntries: [url] });
  const router = createRouter({ head: "", queryClient: httpClient }, history);
  await router.load({ sync: true });
  // load route
  const dehydrated = dehydrate(httpClient);

  const handler = createRequestHandler({
    request,
    createRouter: () => router,
  });

  const response = await handler(({ responseHeaders, router }) => {
    tanstackRouter = router;
    const children = (
      <QueryClientProvider client={httpClient}>
        <RouterServer router={router} />
      </QueryClientProvider>
    );
    return renderRouterToString({
      responseHeaders,
      router,
      children,
    });
  });

  res.statusMessage = response.statusText;
  res.status(response.status);
  response.headers.forEach((value, name) => res.setHeader(name, value));
  const headHtml = tanstackRouter?.options.context?.head ?? "";
  const appHtml = await response.text();
  const html = template
    .replace("<!--app-head-->", headHtml)
    .replace("<!--app-html-->", appHtml)
    .replace(
      "<!--ssr-data-->",
      `<script>window.__TANSTACK_QUERY_STATE__=${JSON.stringify(dehydrated)}</script>`
    );
  res.send(html);
  return { html, dehydrated };
}
