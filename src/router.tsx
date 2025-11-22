import { createRouter as createReactRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFoundComponent from "./components/NotFound/NotFound";

export function createRouter() {
  return createReactRouter({
    routeTree: routeTree,
    context: {
      head: "",
    },
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
