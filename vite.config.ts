import { defineConfig, type BuildEnvironmentOptions } from "vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSR configuration
const ssrBuildConfig: BuildEnvironmentOptions = {
  ssr: true,
  outDir: "dist/server",
  ssrEmitAssets: true,
  copyPublicDir: false,
  emptyOutDir: true,
  assetsDir: "./assets",
  rollupOptions: {
    input: path.resolve(__dirname, "src/entry-server.tsx"),
    output: {
      entryFileNames: "[name].js",
      chunkFileNames: "assets/[name]-[hash].js",
      assetFileNames: "assets/[name]-[hash][extname]",
    },
  },
};

// Client-specific configuration
const clientBuildConfig: BuildEnvironmentOptions = {
  outDir: "dist/client",
  ssr: false,
  emitAssets: true,
  copyPublicDir: true,
  emptyOutDir: true,
  manifest: true,
  assetsDir: "./assets",
};

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
    ],
    build: isSsrBuild ? ssrBuildConfig : clientBuildConfig,
  };
});
