import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "out");
// Plain HTTP by design: nginx on the host terminates TLS (real certs via
// certbot) and reverse-proxies here over the loopback interface. Nothing in
// this container ever touches a certificate or private key.
const PORT = Number(process.env.PORT || 8080);
// 0.0.0.0 *inside* the container's own network namespace — this is not the
// same as being reachable from the internet. That's controlled entirely by
// how the port is published (see docker-compose.yml: bound to 127.0.0.1 on
// the host, so only nginx on the same machine can reach it).
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

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Table-based layout + inline styles: the safe subset that renders
// consistently across Gmail, Outlook, and Apple Mail.
const emailShell = (title, bodyHtml) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:24px 32px;">
              <span style="color:#ffffff;font-size:15px;font-weight:600;letter-spacing:0.02em;">Smile Kisan</span>
            </td>
          </tr>
          <tr><td style="padding:32px;">${bodyHtml}</td></tr>
          <tr>
            <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #eee;">
              <span style="color:#9ca3af;font-size:12px;">smilekisan.com &middot; sent via the portfolio contact form</span>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const notificationHtml = ({ name, email, message }) =>
  emailShell(
    "New portfolio contact",
    `
    <h1 style="margin:0 0 20px;color:#111827;font-size:18px;">New message from your portfolio</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:13px;width:70px;">Name</td>
        <td style="padding:4px 0;color:#111827;font-size:14px;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:13px;">Email</td>
        <td style="padding:4px 0;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#667eea;text-decoration:none;">${escapeHtml(email)}</a></td>
      </tr>
    </table>
    <div style="background:#f9fafb;border-left:3px solid #764ba2;border-radius:8px;padding:16px 18px;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>
    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">Hit reply — it goes straight to ${escapeHtml(email)}.</p>
  `
  );

const confirmationHtml = ({ name, message }) =>
  emailShell(
    "Thanks for reaching out",
    `
    <h1 style="margin:0 0 12px;color:#111827;font-size:18px;">Thanks for reaching out, ${escapeHtml(name)}</h1>
    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">I've received your message and will get back to you soon.</p>
    <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Your message</p>
    <div style="background:#f9fafb;border-left:3px solid #764ba2;border-radius:8px;padding:16px 18px;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;margin-bottom:24px;">${escapeHtml(message)}</div>
    <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">Best,<br/>Smile Kisan<br/><a href="https://smilekisan.com" style="color:#667eea;text-decoration:none;">smilekisan.com</a></p>
  `
  );

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
      // Display name carries the visitor's name/address for readability in
      // your inbox; the actual From address must stay the SES-verified
      // contact@smilekisan.com — SES will reject (or Gmail will spam-flag)
      // any attempt to send From the visitor's own address, since it has no
      // SPF/DKIM/DMARC authorization for your domain.
      Source: `"${name.replace(/["\r\n]/g, "")} via smilekisan.com" <${from}>`,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Charset: "UTF-8", Data: `Portfolio contact from ${name}` },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
          Html: {
            Charset: "UTF-8",
            Data: notificationHtml({ name, email, message }),
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
          Html: {
            Charset: "UTF-8",
            Data: confirmationHtml({ name, message }),
          },
        },
      },
    });

    // The notification (to you) is the one thing that must succeed — that's
    // the actual point of the form. The visitor confirmation is a nice-to-
    // have that fails in SES sandbox mode for any address you haven't
    // individually verified, which is every real visitor; it must never be
    // allowed to make the whole form look broken when the message you
    // actually needed went through fine.
    await ses.send(notification);
    ses.send(confirmation).catch((err) => {
      console.warn("Visitor confirmation email failed (notification still sent):", err.message);
    });

    return sendJson(res, 200, { success: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Couldn't send your message right now. Please try again later.",
    });
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && (req.url || "").split("?")[0] === "/api/contact") {
    return handleContact(req, res);
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD, POST" });
    return res.end("Method not allowed");
  }

  return serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Portfolio server listening on http://${HOST}:${PORT} (behind nginx for TLS)`);
});
