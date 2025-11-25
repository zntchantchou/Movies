import {
  createRouter as createReactRouter,
  type RouterHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFoundComponent from "./components/NotFound/NotFound";
import type { RouterContext } from "./routerContext";

export function createRouter(context: RouterContext, history?: RouterHistory) {
  const routerHistory = history ? { history } : {};
  return createReactRouter({
    ...routerHistory,
    context,
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
