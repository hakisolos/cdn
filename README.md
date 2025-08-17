# CDN Haki – Node.js Developer Documentation

Welcome to the developer docs for the Node.js version of CDN Haki!  
This branch (`nodejs-support`) is focused on Node.js compatibility and deployment for developer platforms.  
You can easily deploy, extend, or integrate this CDN backend for your own apps, websites, or automation.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Example Usage](#example-usage)
- [Deploying Your Own Instance](#deploying-your-own-instance)
  - [Vercel](#vercel)
  - [Render](#render)
  - [Heroku](#heroku)
  - [VPS/Cloud](#vpscloud)
- [Make Your Own Frontend](#make-your-own-frontend)
- [Credits & Support](#credits--support)

---

## Features

- Upload files via `/upload` (multipart/form-data)
- Get files via `/files/:id`
- Serve static assets from `/static/*` and index page (`/`)
- Files are stored/retrieved via Telegram CDN (using your bot token)
- Fast, simple, and cache-friendly responses

---

## Getting Started

### 1. Fork & Star the Repo!

- Click **Fork** and **Star** to support the project.
- Select the `nodejs-support` branch as default if you want easy Node.js deployment (recommended for Vercel/Heroku/most platforms).

### 2. Clone Your Fork

```sh
git clone https://github.com/<your-username>/cdn.git
cd cdn
git checkout nodejs-support
```

### 3. Install Dependencies

```sh
npm install
```

---

## API Endpoints

### Upload File

- **POST** `/upload`
- **Body:** FormData, key: `file`
- **Returns:** `{ url, fileSize }`

### Get Uploaded File

- **GET** `/files/:id`
- Serves file from Telegram CDN with cache headers.

### Serve Static Files

- **GET** `/static/<filename>`
- Serves files from `./public` directory.

### Serve Index Page

- **GET** `/`
- Serves `./public/index.html`

---

## Environment Variables

Create a `.env` file in the root directory and set:

```env
BOT_TOKEN=7741724916:AAGgQMEoRejBJu14MznuC-WfGWrOhyFDzAU
TEST_CHAT_ID=7384338448
CHANNEL_ID=-1002755345460
PORT=3001
```

- **BOT_TOKEN:** Telegram bot token for uploads/downloads
- **TEST_CHAT_ID:** Chat ID (for testing with bot)
- **CHANNEL_ID:** Channel ID (used for file storage)
- **PORT:** Server port (default: 3001)

**Note:** Keep your bot token secret!

---

## Example Usage

### Upload a File (cURL)

```sh
curl -X POST https://cdn-haki.zone.id/upload -F "file=@yourfile.png"
```

**Response:**
```json
{
  "url": "https://cdn-haki.zone.id/files/xyz789.png",
  "fileSize": 43210
}
```

### Download the File

```sh
curl https://cdn-haki.zone.id/files/xyz789.png --output downloaded.png
```

### Node.js Integration Example

```js
import fetch from 'node-fetch';
const fs = require('fs');
const FormData = require('form-data');

async function uploadFile(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const response = await fetch('https://cdn-haki.zone.id/upload', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });
  console.log(await response.json());
}

uploadFile('./my-local-file.jpg');
```

---

## Deploying Your Own Instance

You can deploy CDN Haki Node.js to any cloud/server, including **Vercel, Render, Heroku, VPS, etc.**

### Vercel

**Recommended for Node.js!**

1. **Fork & star the repo.**
2. **Set `nodejs-support` branch as default** in repo settings.
3. **Import your repo to Vercel.**
4. **Add environment variables (`BOT_TOKEN`, etc) in Vercel dashboard.**
5. **Add a `vercel.json` file:**

```json name=vercel.json
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.js" }
  ]
}
```

6. **Deploy and test your instance!**

> If you want a custom frontend, you can build your own and point it to your API.  
> Need a frontend? DM me on WhatsApp ([wa.me/2349112171078](https://wa.me/2349112171078)) and I’ll make one for you!

---

### Render

1. Fork & star the repo.
2. Connect your repo on Render, select Node.js environment.
3. Add your environment variables (`BOT_TOKEN`, etc) in Render dashboard.
4. Deploy!

---

### Heroku

1. Fork & star the repo.
2. Login to Heroku, create a new Node.js app.
3. Connect your GitHub repo.
4. Set your environment variables.
5. Deploy!

---

### VPS/Cloud

1. SSH into your VPS/cloud server.
2. Clone your fork:  
   `git clone https://github.com/<your-username>/cdn.git`
3. Checkout `nodejs-support` branch.
4. Install dependencies:  
   `npm install`
5. Create `.env` file with your variables.
6. Start server:  
   `node index.js` or `npm start`

---

## Make Your Own Frontend

You can make your own UI or frontend to interact with the API.  
Just point your frontend to your API server endpoints.

If you want a custom frontend, DM me on WhatsApp ([wa.me/2349112171078](https://wa.me/2349112171078)) and I’ll build it for you!

---

## Credits & Support

Made with 💚 by [Haki](https://wa.me/2349112171078) & [Ike](https://t.me/shell_haki)  
If you love this project, support, star, and follow us for more cool stuff!

- **WhatsApp:** [wa.me/2349112171078](https://wa.me/2349112171078)
- **Telegram:** [t.me/shell_haki](https://t.me/shell_haki)
- **X (Twitter):** [@haki_xer](https://x.com/haki_xer)

Your feedback, stars, and support mean a lot.  
Let us know what you're building or if you need help—drop a message or connect on socials!

---

If you encounter issues or have questions, please open an issue on the repository.
