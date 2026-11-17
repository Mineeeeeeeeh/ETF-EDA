import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "server"), { recursive: true });
await mkdir(join(dist, ".openai"), { recursive: true });
const workerSource = await readFile(join(root, "worker", "index.js"), "utf8");
const html = await readFile(join(root, "index.html"), "utf8");
const marker = 'const page = "__ETF_DASHBOARD_HTML__";';

if (!workerSource.includes(marker)) throw new Error("Worker HTML marker not found");
await writeFile(join(dist, "server", "index.js"), workerSource.replace(marker, `const page = ${JSON.stringify(html)};`));

const manifest = JSON.parse(await readFile(join(root, ".openai", "hosting.json"), "utf8"));
await writeFile(join(dist, ".openai", "hosting.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`Built ${dist}`);
