import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else files.push(path);
  }
  return files;
}

const assetEntries = [];
for (const file of await collectFiles("dist/client")) {
  const route = `/${relative("dist/client", file).split(sep).join("/")}`;
  assetEntries.push([route, {
    body: await readFile(file, "utf8"),
    type: contentTypes[extname(file)] || "application/octet-stream",
  }]);
}

const workerSource = `
const assets = new Map(${JSON.stringify(assetEntries)});

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const requested = assets.get(url.pathname);
    const asset = requested || assets.get("/index.html");

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    const isDocument = !requested || url.pathname === "/" || url.pathname === "/index.html";
    return new Response(asset.body, {
      headers: {
        "Content-Type": asset.type,
        "Cache-Control": isDocument ? "no-cache" : "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  },
};
`;

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await writeFile("dist/server/index.js", workerSource);
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
await writeFile("dist/package.json", JSON.stringify({ type: "module" }, null, 2));
