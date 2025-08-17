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

- `BOT_TOKEN`: Telegram Bot token for file downloads.
- `PORT`: Port to run the server.

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

### Download the File

```sh
curl https://cdn-haki.zone.id/files/xyz789.png --output downloaded.png
```

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

---
z
