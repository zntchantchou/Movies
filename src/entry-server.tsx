import { StrictMode } from "react";
import App from "./App";
import { renderToString } from "react-dom/server";

export function render(_url: string) {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
  return { html };
}
