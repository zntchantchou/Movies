import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "./root.scss";
import type { RouterContext } from "../routerContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../components/Header/Header";

function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 120 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <Scripts />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
