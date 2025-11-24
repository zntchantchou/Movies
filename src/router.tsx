import { createRouter as createReactRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFoundComponent from "./components/NotFound/NotFound";

type InitialData = { fact: unknown };

export function createRouter(data?: InitialData) {
  const context: { head?: string; serverData?: unknown } = {
    head: "",
  };

  // only provided on the server
  if (data?.fact) context.serverData = data.fact;

  return createReactRouter({
    routeTree: routeTree,
    // @ts-expect-error serverData = custom property
    context: context,
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
