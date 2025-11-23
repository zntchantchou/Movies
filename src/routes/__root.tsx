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
  head: () => ({
    links: [{ rel: "icon", href: "/images/favicon.ico" }],
    meta: [
      {
        title: "TanStack Router SSR Basic File Based Streaming",
      },
      {
        charSet: "UTF-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    scripts: [
      ...(!import.meta.env.PROD
        ? [
            {
              type: "module",
              children: `import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true`,
            },
            {
              type: "module",
              src: "/@vite/client",
            },
          ]
        : []),
      {
        type: "module",
        src: import.meta.env.PROD
          ? "/dist/client/entry-client.js"
          : "/src/entry-client.tsx",
      },
      {
        type: "module",
        children: 'console.log("Script hoho")',
      },
    ],
  }),
  component: RootLayout,
});
