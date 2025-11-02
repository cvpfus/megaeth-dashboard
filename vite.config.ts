import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig(({ mode }) => {
  return {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      {
        name: "simpleanalytics",
        transformIndexHtml(html) {
          const file = mode === "development" ? "latest.dev.js" : "latest.js";
          return {
            html,
            tags: [
              {
                tag: "script",
                attrs: {
                  async: true,
                  src: `https://scripts.simpleanalyticscdn.com/${file}`,
                },
                injectTo: "head",
              },
            ],
          };
        },
      },
    ],
  };
});

export default config;
