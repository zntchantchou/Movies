import {
  createRootRouteWithContext,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "./root.scss";
import type { RouterContext } from "../routerContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
      <div id="header">
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Outlet />
        <Scripts />
        <TanStackRouterDevtools />
      </div>
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
