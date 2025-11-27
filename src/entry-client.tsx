import { hydrateRoot } from "react-dom/client";
import { RouterClient } from "@tanstack/react-router/ssr/client";
import { createRouter } from "./router.tsx";
import { hydrate, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const dehydrated = (window as any).__TANSTACK_QUERY_STATE__; // eslint-disable-line

hydrate(queryClient, dehydrated);

// console.log("DEHYDRATED ", dehydrated);
const router = createRouter({ head: "", queryClient });

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <RouterClient router={router} />
);
