import { createServer } from "node:http";
await import("./build.mjs");
const { default: worker } = await import(`../dist/server/index.js?ts=${Date.now()}`);

const port = Number(process.env.PORT || 8787);
const server = createServer(async (req, res) => {
  try {
    const response = await worker.fetch(new Request(`http://127.0.0.1:${port}${req.url}`, { method: req.method }));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(error instanceof Error ? error.message : "Internal error");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Local URL: http://127.0.0.1:${port}`));
