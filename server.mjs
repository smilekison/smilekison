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

// Small in-memory rate limiter: enough protection for a personal portfolio
// without adding Redis, a database, or another AWS service.
const rateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const sendJson = (res, status, body) => {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(data),
  });
  res.end(data);
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now - entry.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
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
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return sendJson(res, 429, {
        success: false,
        message: "Too many messages from this address. Please try again later.",
      });
    }

    const raw = await readBody(req);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return sendJson(res, 400, { success: false, message: "Invalid request." });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return sendJson(res, 400, { success: false, message: "Please complete all fields." });
    }

    if (name.length > 120 || email.length > 254 || message.length > 10000) {
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

    const notification = new SendEmailCommand({
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
    });

    const confirmation = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Charset: "UTF-8", Data: "Thanks for contacting Smile Kisan" },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Hi ${name},\n\nThank you for contacting me through my website.\n\nI have received your message and will contact you soon.\n\nFor your reference, here is the message you submitted:\n\n${message}\n\nBest regards,\nSmile Kisan\nhttps://smilekisan.com`,
          },
        },
      },
    });

    // Send the notification and visitor confirmation together. The endpoint
    // reports success only when both SES requests are accepted.
    await Promise.all([ses.send(notification), ses.send(confirmation)]);

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
