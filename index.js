import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { upload } from "./src/upload.js";
import { randomId } from "./src/utils.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const uploadMiddleware = multer();
const fileMap = new Map();

app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

app.post("/upload", uploadMiddleware.single("file"), async (req, res) => {
  if (!req.file) return res.status(401).json({ error: "no file uploaded" });

  const buff = req.file.buffer;
  const result = await upload(buff);
  if (!result) return res.status(500).json({ error: "upload failed >_<" });

  const ext = result.filePath.split(".").pop() ?? "";
  let id;
  do {
    id = `${randomId()}.${ext}`;
  } while (fileMap.has(id));

  fileMap.set(id, result.filePath);

  return res.json({
    url: `${req.protocol}://${req.get("host")}/files/${id}`,
    fileSize: buff.length
  });
});

app.get("/files/:id", async (req, res) => {
  const id = req.params.id;
  const path = fileMap.get(id);
  if (!path) return res.status(404).json({ error: "file not found" });

  const tgUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${path}`;
  const tgRes = await fetch(tgUrl);
  if (!tgRes.ok) return res.status(404).json({ error: "file not found" });

  res.set({
    "Content-Type": tgRes.headers.get("content-type") ?? "application/octet-stream",
    "Cache-Control": "public, max-age=31536000"
  });
  tgRes.body.pipe(res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Cdn Server running on port ${port}`));
