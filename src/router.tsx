import { createRouter as createReactRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFoundComponent from "./components/NotFound/NotFound";
import httpClient from "./http/client";
// import type { RouterContext } from "./routerContext";

export function createRouter() {
  console.log("HTTP CLIENT AT CREATE ROUTER ", httpClient);
  return createReactRouter({
    context: {
      head: "",
      queryClient: httpClient,
    },
    routeTree: routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFoundComponent,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
