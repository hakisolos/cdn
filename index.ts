import { Hono } from "hono";
import { upload } from "./src/upload";
import { randomId } from "./src/utils";
import { serveStatic } from '@hono/node-server/serve-static'
const cdn = new Hono();
const fileMap = new Map<string, string>();

cdn.use('/static/*', serveStatic({ root: './public' }))
cdn.get('/', serveStatic({ path: './public/index.html' }))


cdn.post("/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;

  if (!file) return c.json({ error: "no file uploaded" }, 401);

  const buff = Buffer.from(await file.arrayBuffer());
  const res = await upload(buff);

  if (!res) return c.json({ error: "upload failed >_<" }, 500);

  const ext = res.filePath.split(".").pop() ?? "";
  let id: string;
  do {
    id = `${randomId()}.${ext}`;
  } while (fileMap.has(id));

  fileMap.set(id, res.filePath);

  const url = new URL(c.req.url);
  return c.json({
    url: `${url.protocol}//${url.host}/files/${id}`,
    fileSize: buff.length
  });
});

cdn.get("/files/:id", async (c) => {
  const id = c.req.param("id");
  const path = fileMap.get(id);

  if (!path) return c.json({ error: "file not found" }, 404);

  const tgUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${path}`;
  const tgRes = await fetch(tgUrl);

  if (!tgRes.ok) return c.json({ error: "file not found" }, 404);

  return new Response(tgRes.body, {
    status: 200,
    headers: {
      "Content-Type": tgRes.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000"
    }
  });
});

Bun.serve({ fetch: cdn.fetch, port: Number(process.env.PORT) });
console.log(`Cdn Server running on port ${process.env.PORT}`);
