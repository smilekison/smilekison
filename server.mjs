import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "out");
const CERT_DIR = path.join(__dirname, "certs");
const PORT = Number(process.env.PORT || 8443);
const HOST = "0.0.0.0";

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const sendJson = (res, status, body) => {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(data),
  });
  res.end(data);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > 20000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const safeStaticPath = (requestPath) => {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  const normalized = path.posix.normalize(decoded).replace(/^\/+/, "");
  if (normalized.includes("..")) return null;
  return path.join(OUT_DIR, normalized);
};

const serveStatic = (req, res) => {
  let filePath = safeStaticPath(req.url || "/");
  if (!filePath) {
    res.writeHead(400);
    return res.end("Bad request");
  }

  try {
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    // Try the requested path with the static-export index fallback below.
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const cleanPath = (req.url || "/").split("?")[0];
    const fallback = cleanPath.endsWith("/")
      ? path.join(OUT_DIR, cleanPath, "index.html")
      : path.join(OUT_DIR, `${cleanPath}.html`);

    if (fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
      filePath = fallback;
    } else {
      filePath = path.join(OUT_DIR, "404.html");
    }
  }

  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end("Internal server error");
  }
};

const handleContact = async (req, res) => {
  try {
    const raw = await readBody(req);
    const body = JSON.parse(raw);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return sendJson(res, 400, { success: false, message: "Please complete all fields." });
    }

    if (name.length > 120 || email.length > 320 || message.length > 10000) {
      return sendJson(res, 400, { success: false, message: "One or more fields are too long." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendJson(res, 400, { success: false, message: "Please enter a valid email address." });
    }

    const from = process.env.SES_FROM_EMAIL;
    const to = process.env.SES_TO_EMAIL;
    if (!from || !to) {
      console.error("Missing SES_FROM_EMAIL or SES_TO_EMAIL");
      return sendJson(res, 500, { success: false, message: "Email service is not configured yet." });
    }

    await ses.send(new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Charset: "UTF-8", Data: `Portfolio contact from ${name}` },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
        },
      },
    }));

    return sendJson(res, 200, { success: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Couldn't send your message right now. Please try again later.",
    });
  }
};

const server = https.createServer(
  {
    cert: fs.readFileSync(path.join(CERT_DIR, "cert.pem")),
    key: fs.readFileSync(path.join(CERT_DIR, "key.pem")),
  },
  async (req, res) => {
    if (req.method === "POST" && (req.url || "").split("?")[0] === "/api/contact") {
      return handleContact(req, res);
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD, POST" });
      return res.end("Method not allowed");
    }

    return serveStatic(req, res);
  },
);

server.listen(PORT, HOST, () => {
  console.log(`Portfolio server listening on https://${HOST}:${PORT}`);
});
