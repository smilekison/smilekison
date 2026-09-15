# Deployment: Docker + nginx + AWS SES

Architecture: **nginx on the host owns HTTPS.** The app container has no
certificates, no `openssl`, no TLS code at all — it speaks plain HTTP on
`127.0.0.1:8080`, reachable only from nginx on the same machine, never
directly from the internet.

```
Internet --443/80--> nginx (host, Let's Encrypt certs) --127.0.0.1:8080--> Docker container (plain HTTP)
```

## Quick start (already-provisioned server)

```bash
docker compose up -d --build
```

Needs a `.env` file first (see **Contact form (AWS SES)** below) and nginx
already configured (see **Full setup** below, or run `deploy/setup-ec2.sh`
for a fresh instance).

## Full setup on a fresh Ubuntu 24.04 EC2 instance

Prerequisites, done once via the AWS/registrar consoles (not scriptable):
1. Elastic IP associated with the instance
2. `smilekisan.com` and `www.smilekisan.com` A records point at that IP
3. Security group allows inbound **80** and **443** from `0.0.0.0/0`
4. An **IAM role** attached to the instance with `ses:SendEmail` permission (see below — this is what lets the contact form send mail with zero credentials in the code or environment)

Then, on the instance:
```bash
git clone https://github.com/smilekison/smilekison.git ~/smilekison
cd ~/smilekison
DOMAIN=smilekisan.com EMAIL=you@example.com ./deploy/setup-ec2.sh
```

That one script: installs Docker, nginx and certbot; requests the real
Let's Encrypt certificate; installs the maintained nginx reverse-proxy
config (`nginx/smilekisan.conf`); writes a starter `.env`; builds and starts
the container. Read it before running it — it's a normal bash script, not a
black box.

## Image size

Multi-stage build: the `node:20-alpine` builder stage runs the Next.js
build and is discarded entirely. The runtime stage is also
`node:20-alpine` with exactly one runtime dependency
(`@aws-sdk/client-ses` — `server.mjs` implements static file serving
itself, no framework). Final image: **~265MB**. No TLS libraries, no
`serve`/`serve-handler`, nothing beyond what the app actually runs.

## Contact form (AWS SES)

`server.mjs` is a small hand-rolled HTTP server: it serves the static
export **and** handles `POST /api/contact`, which sends mail through AWS
SES. No API key lives in the code — SES auth comes from whatever AWS
credentials are in the environment, which on EC2 should be the **instance's
IAM role** (not access keys in `.env`).

**1. Attach an IAM role to the EC2 instance:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "ses:SendEmail",
    "Resource": "*"
  }]
}
```
EC2 Console → instance → **Actions → Security → Modify IAM role** → attach a role with that policy.

**2. Verify a sending identity in SES**, in the same region you'll run in:
- SES Console → **Verified identities** → **Create identity**
- Quickest: verify a single address (e.g. your Gmail) — SES emails a confirmation link
- Better long-term: verify the `smilekisan.com` domain, then send as `contact@smilekisan.com`

**3. Check whether the account is still in SES sandbox mode.** In
sandbox mode, SES will only deliver to *verified* recipients. This form
sends two emails per submission:
- **Notification to you** (`SES_TO_EMAIL`) — this is the one that matters, and it works in sandbox mode as long as your own address is verified
- **Auto-confirmation reply to the visitor** — this will fail for any real visitor while still in sandbox, since their address is never pre-verified

`server.mjs` is written so the visitor confirmation failing **never**
blocks or fails the actual form submission — you still get notified even
if the auto-reply silently fails. But if you want visitors to *also* get
that confirmation email, request production access: SES Console →
**Account dashboard** → **Request production access** (free, usually
approved within a day for legitimate use).

**4. `.env` on the server** (never committed — already in `.gitignore`):
```bash
AWS_REGION=us-east-1
SES_FROM_EMAIL=contact@smilekisan.com
SES_TO_EMAIL=smilekisan.dev@gmail.com
```
Deliberately **no** `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — leaving
them entirely absent (not blank) is what makes the AWS SDK correctly fall
through to the instance's IAM role. Setting them (even to empty strings)
can make the SDK try to use them literally and fail instead of falling
back.

**Rate limiting**: `server.mjs` keeps a small in-memory limiter — 5
submissions per IP per 15 minutes. No Redis or database; resets if the
container restarts, which is a fine tradeoff for a personal contact form.

## Managing the container

```bash
docker compose logs -f portfolio      # tail logs
docker compose restart portfolio      # restart
docker compose down                   # stop and remove
docker compose up -d --build          # rebuild after a git pull
```

## nginx

Config lives at `nginx/smilekisan.conf` in this repo (the source of truth —
edit it here, then `sudo cp` it to `/etc/nginx/sites-available/` and reload,
rather than editing the live file directly). It:
- Redirects `80 → 443`
- Terminates TLS with the Let's Encrypt cert at `/etc/letsencrypt/live/smilekisan.com/`
- Reverse-proxies everything to `127.0.0.1:8080`
- Sets `X-Forwarded-For` / `X-Real-IP` so `server.mjs`'s rate limiter sees the real visitor IP, not nginx's

**Certificate renewal**: certbot installs its own systemd timer
automatically; `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh`
(written by `deploy/setup-ec2.sh`) reloads nginx after each renewal so it
picks up the new cert without downtime.

## Security notes

- The app container is **never** directly reachable from the internet —
  `docker-compose.yml` binds it to `127.0.0.1:8080`, not `0.0.0.0`. Only
  nginx, on the same machine, can reach it.
- Runs as the non-root `node` user.
- No TLS material — certs, keys, or otherwise — ever enters the image or
  the container's filesystem.
- No AWS access keys in `.env` or anywhere in the repo; SES auth is scoped
  to exactly one action (`ses:SendEmail`) via the instance's IAM role.
