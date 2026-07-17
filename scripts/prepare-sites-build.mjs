import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("dist/server/ssr", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

await copyFile("dist/server/index.mjs", "dist/server/index.js");
await copyFile("dist/server/ssr/index.mjs", "dist/server/ssr/index.js");
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
await writeFile("dist/package.json", JSON.stringify({ type: "module" }, null, 2));
