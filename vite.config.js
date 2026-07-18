import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/ctfchildren/" : "/",
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
