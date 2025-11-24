import {
  createRootRouteWithContext,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "./root.scss";
import type { RouterContext } from "../routerContext";

function RootLayout() {
  return (
    <>
      <div id="header">
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Outlet />
        <Scripts />
        <TanStackRouterDevtools />
      </div>
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
