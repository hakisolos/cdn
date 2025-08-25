import { Hono } from "hono";
import { randomId } from "./src/utils";
import { serveStatic } from '@hono/node-server/serve-static'
import fs from 'fs/promises'
import path from 'path'

const cdn = new Hono();
const fileMap = new Map<string, string>();

cdn.use('/*', serveStatic({ root: './public' }))
cdn.get('/', serveStatic({ path: './public/index.html' }))

const uploadDir = path.join(process.cwd(), "uploads");
await fs.mkdir(uploadDir, { recursive: true });

cdn.post("/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;

  if (!file) return c.json({ error: "no file uploaded" }, 401);

  const buff = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "").toLowerCase();

  let id: string;
  do {
    id = `${randomId()}.${ext}`;
  } while (fileMap.has(id));

  const filePath = path.join(uploadDir, id);
  await fs.writeFile(filePath, buff);

  fileMap.set(id, filePath);

  const url = new URL(c.req.url);
  return c.json({
    url: `${url.protocol}//${url.host}/files/${id}`,
    fileSize: buff.length
  });
});

cdn.get("/files/:id", async (c) => {
  const id = c.req.param("id");
  const filePath = fileMap.get(id);

  if (!filePath) return c.json({ error: "file not found" }, 404);

  try {
    const stat = await fs.stat(filePath);
    return new Response(await fs.readFile(filePath), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000"
      }
    });
  } catch {
    return c.json({ error: "file not found" }, 404);
  }
});

Bun.serve({ fetch: cdn.fetch, port: Number(process.env.PORT) });
console.log(`Cdn Server running on port ${process.env.PORT}`);
