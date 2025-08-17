# CDN Haki API Documentation

Welcome to the documentation for the CDN Haki API. This API allows you to upload files, retrieve files using unique URLs, and serve static files. The service is hosted at:  
**`https://cdn-haki.zone.id`**

---

## Table of Contents

- [Base URL](#base-url)
- [Static File Serving](#static-file-serving)
- [Upload File](#upload-file)
- [Retrieve Uploaded File](#retrieve-uploaded-file)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Environment Requirements](#environment-requirements)
- [Example Usage](#example-usage)
- [Node.js / Bun Integration Example](#nodejs--bun-integration-example)
- [How to Deploy Your Own Instance](#how-to-deploy-your-own-instance)
- [Credits & Support](#credits--support)

---

## Base URL

All endpoints are served from:

```
https://cdn-haki.zone.id
```

---

## Static File Serving

### Serve Static Assets

- **Endpoint:**  
  `GET /static/*`

- **Description:**  
  Serves static files located in the local `./public` directory.

- **Example:**  
  To access a static file located at `./public/example.png`, request:
  ```
  GET https://cdn-haki.zone.id/static/example.png
  ```

### Serve Index Page

- **Endpoint:**  
  `GET /`

- **Description:**  
  Serves the index page (`./public/index.html`).

---

## Upload File

### Endpoint

```
POST /upload
```

### Description

Uploads a file to the CDN. The server generates a unique ID for each uploaded file and returns a shareable URL.

### Request

- **Content-Type:** `multipart/form-data`
- **Body:**  
  - `file`: The file to upload.

#### Example using `curl`

```sh
curl -X POST https://cdn-haki.zone.id/upload \
  -F "file=@yourfile.jpg"
```

### Successful Response

```json
{
  "url": "https://cdn-haki.zone.id/files/{unique_id}",
  "fileSize": 12345
}
```
- `url`: The URL to access the file.
- `fileSize`: The size of the uploaded file in bytes.

---

## Retrieve Uploaded File

### Endpoint

```
GET /files/:id
```

- `:id` is the unique file identifier returned from the upload endpoint.

### Description

Retrieves the uploaded file. Files are served directly from Telegram's CDN via the Telegram Bot API.

### Example

```
GET https://cdn-haki.zone.id/files/abc123.jpg
```

- Returns the file with appropriate `Content-Type`.
- Response includes caching headers (`Cache-Control: public, max-age=31536000`).

---

## Response Formats

- **Success:**  
  - Upload: JSON object with file URL and size.
  - Retrieve: Binary file stream with proper content type.
- **Errors:**  
  - JSON objects with error messages and HTTP status codes.

#### Error Response Example

```json
{ "error": "no file uploaded" }
```

---

## Error Handling

- **401 Unauthorized:** No file provided in upload.
- **404 Not Found:** File with given ID does not exist or not found on Telegram CDN.
- **500 Internal Server Error:** Upload failed.

---

## Environment Requirements

The server requires the following environment variables:

```env
BOT_TOKEN=7741724916:AAGgQMEoRejBJu14MznuC-WfGWrOhyFDzAU
TEST_CHAT_ID=7384338448
CHANNEL_ID=-1002755345460
PORT=3001
```

- `BOT_TOKEN`: Telegram Bot token for file downloads.
- `TEST_CHAT_ID`: Chat ID for testing.
- `CHANNEL_ID`: Channel ID (used for channel-based operations).
- `PORT`: Port to run the server.

Set these in your `.env` file or environment before starting the server.

---

## Example Usage

### Upload a File

```sh
curl -X POST https://cdn-haki.zone.id/upload -F "file=@yourfile.png"
```

Response:
```json
{
  "url": "https://cdn-haki.zone.id/files/xyz789.png",
  "fileSize": 43210
}
```

---

## Node.js / Bun Integration Example

Here's how you can use the CDN Haki API programmatically in Node.js or Bun:

### Upload Example (Node.js & Bun)

```js
// Node.js or Bun
import fetch from 'node-fetch'; // Or Bun's native fetch

async function uploadFile(filePath) {
  const fs = require('fs');
  const FormData = require('form-data');
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const response = await fetch('https://cdn-haki.zone.id/upload', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });

  const result = await response.json();
  console.log(result);
}

uploadFile('./my-local-file.jpg');
```

---

## How to Deploy Your Own Instance

**This section is for developers who want to deploy the source code for themselves.  
If you just want to use the hosted API, skip this section and use the endpoints above!**

If you deploy your own instance, please credit the original project and author (see Credits & Support below).

You can run CDN Haki on your own server, VPS, or cloud platform using either Node.js or Bun. Here’s how:

### Deploying on Vercel (Node.js)

- **Step 1:** Fork or clone the repository.
- **Step 2:** Add your environment variables in Vercel dashboard (`BOT_TOKEN`, `TEST_CHAT_ID`, `CHANNEL_ID`, `PORT`).
- **Step 3:** Set up a `vercel.json` or use the default configuration.
- **Step 4:** Deploy!

> Note: Vercel may not support Bun natively yet, so use Node.js for Vercel.

### Deploying on Render

- **Step 1:** Fork or clone the repository.
- **Step 2:** Create a new web service on Render with your repo.
- **Step 3:** Set the environment variables in the Render dashboard.
- **Step 4:** Select Node.js or Bun as your environment and deploy.

### Deploying on VPS (Node.js/Bun)

- **Step 1:** SSH into your VPS.
- **Step 2:** Clone the repo:  
  `git clone https://github.com/hakisolos/cdn.git`
- **Step 3:** Install dependencies:
  - Node.js: `npm install`
  - Bun: `bun install`
- **Step 4:** Set your environment variables (see above).
- **Step 5:** Start the server:
  - Node.js: `node index.js` or `npm start`
  - Bun: `bun index.ts`

### Local .env Setup

Create a `.env` file in the root of your project with the following contents:

```env
BOT_TOKEN=your-telegram-bot-token
TEST_CHAT_ID=your-test-chat-id
CHANNEL_ID=your-channel-id
PORT=your-port
```

> **Note:** Keep your bot token secret!

### Bun vs Node

- **Node.js:** Use `npm install` and `node index.js`
- **Bun:** Use `bun install` and `bun index.ts`
- The project supports both, but Bun is faster!

---

## Credits & Support

Made with 💚 by [Haki](https://wa.me/2349112171078)

If you love this project, support, star, and follow for more cool stuff!  
If you need a custom frontend for your deployment, chat me on WhatsApp ([wa.me/2349112171078](https://wa.me/2349112171078)) and I’ll make one for you.

- **WhatsApp:** [wa.me/2349112171078](https://wa.me/2349112171078)
- **X (Twitter):** [@haki_xer](https://x.com/haki_xer)

Your feedback, stars, and support mean a lot.  
Let me know what you're building or if you need help—drop a message or connect on socials!

---

If you encounter issues or have questions, please open an issue on the repository.

---
