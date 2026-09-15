// Tiny production server: serves the static export (same behavior as the
// `serve` CLI, via the same underlying library it uses) and adds one real
// endpoint — POST /api/contact — that sends mail through AWS SES.
//
// Why not the `serve` CLI plus a separate Lambda: this runs the whole site
// on one container, one port, one TLS cert — no second service, no new
// security-group rule, no AWS credentials to manage (SES auth comes from
// the EC2 instance's IAM role via the default AWS SDK credential chain).
"use strict";

const https = require("https");
const fs = require("fs");
const path = require("path");
const handler = require("serve-handler");
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

const PORT = process.env.PORT || 8443;
const CERT_DIR = process.env.CERT_DIR || "/app/certs";
const PUBLIC_DIR = path.join(__dirname, "out");

// Required: set these as environment variables at `docker run` time.
// SES_FROM must be a verified identity (a verified address, or any address
// on a verified domain) in the AWS_REGION you're sending from.
const SES_FROM = process.env.SES_FROM;
const SES_TO = process.env.SES_TO;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

const ses = new SESv2Client({ region: AWS_REGION });

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(body));
}

function readBody(req, limitBytes = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleContact(req, res) {
  if (!SES_FROM || !SES_TO) {
    sendJson(res, 500, { ok: false, error: "Contact form is not configured (SES_FROM/SES_TO unset)." });
    return;
  }

  let payload;
  try {
    const raw = await readBody(req);
    payload = JSON.parse(raw);
  } catch {
    sendJson(res, 400, { ok: false, error: "Invalid request body." });
    return;
  }

  const name = String(payload.name || "").trim().slice(0, 200);
  const email = String(payload.email || "").trim().slice(0, 200);
  const message = String(payload.message || "").trim().slice(0, 5000);
  // Honeypot: a real visitor never fills a hidden field.
  if (payload.botcheck) {
    sendJson(res, 200, { ok: true });
    return;
  }
  if (!name || !EMAIL_RE.test(email) || !message) {
    sendJson(res, 400, { ok: false, error: "Please fill in a name, a valid email, and a message." });
    return;
  }

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: SES_FROM,
        Destination: { ToAddresses: [SES_TO] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Portfolio contact from ${name}` },
            Body: {
              Text: {
                Data: `From: ${name} <${email}>\n\n${message}`,
              },
            },
          },
        },
      }),
    );
    sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error("SES send failed:", err);
    sendJson(res, 502, { ok: false, error: "Could not send the message right now. Try email directly." });
  }
}

const server = https.createServer(
  {
    cert: fs.readFileSync(path.join(CERT_DIR, "cert.pem")),
    key: fs.readFileSync(path.join(CERT_DIR, "key.pem")),
  },
  async (req, res) => {
    if (req.method === "POST" && req.url === "/api/contact") {
      handleContact(req, res).catch((err) => {
        console.error(err);
        sendJson(res, 500, { ok: false, error: "Unexpected server error." });
      });
      return;
    }
    if (req.method === "OPTIONS" && req.url === "/api/contact") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }
    handler(req, res, {
      public: PUBLIC_DIR,
      // Mirrors public/serve.json — long cache for hashed assets, none for HTML.
      headers: [
        { source: "/_next/static/**", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
        { source: "**/*.@(html|xml|txt)", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      ],
    });
  },
);

server.listen(PORT, () => {
  console.log(`Listening on https://0.0.0.0:${PORT}`);
  if (!SES_FROM || !SES_TO) {
    console.warn("SES_FROM / SES_TO not set — /api/contact will return a config error until they are.");
  }
});
