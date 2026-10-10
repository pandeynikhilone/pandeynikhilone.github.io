import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

function projectCatalogPlugin() {
  return {
    name: "portfolio-project-catalog",
    generateBundle() {
      for (const filename of ["projects.json", "auto-projects.json"]) {
        this.emitFile({
          type: "asset",
          fileName: "data/" + filename,
          source: readFileSync(resolve(projectRoot, "data", filename), "utf8")
        });
      }
    }
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), projectCatalogPlugin()],
  build: { outDir: "dist", emptyOutDir: true }
});
