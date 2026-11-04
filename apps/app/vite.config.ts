import { defineConfig } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { lazyPlugins } from "vite-plus";

const isTest = process.env.VITEST === "true";

const config = defineConfig({
  run: {
    tasks: {
      dev: {
        command: "vp dev --port 5173",
        cache: false,
        dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }],
      },
      build: {
        command: "vp build",
        dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }],
      },
    },
  },
  resolve: { tsconfigPaths: true },
  // Unit tests do not need the application's SSR servers or devtools.
  plugins: lazyPlugins(() =>
    isTest
      ? [viteReact()]
      : [
          devtools(),
          nitro({ rollupConfig: { external: [/^@sentry\//] } }),
          tailwindcss(),
          tanstackStart(),
          viteReact(),
        ],
  ),
});

export default config;
