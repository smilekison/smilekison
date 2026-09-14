# Docker Setup for smilekisan.com

## Quick Start

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up -d
```

This will:
- Build the portfolio from source
- Generate self-signed HTTPS certificates at container startup
- Start the service, reachable on host port 443 (HTTPS)
- Automatically restart unless manually stopped
- Run health checks every 30s

### Option 2: Docker CLI

**Build the image:**
```bash
docker build -t smile-portfolio .
```

**Run with auto-restart:**
```bash
docker run -d \
  --name smile-portfolio \
  -p 443:8443 \
  --restart unless-stopped \
  smile-portfolio
```

## What's Included

- **Multi-stage build**: Minimal final image (Node 20 Alpine)
- **HTTPS by default**: Self-signed certificate generated when the container
  starts, not baked into the image (see Security notes below)
- **Non-root**: The app runs as the `node` user, not root
- **Automatic restart**: Policy `unless-stopped` — container restarts on failure, survives reboot, only stops on manual `docker stop`
- **Health checks**: Verifies HTTPS endpoint every 30s
- **Static export**: Serves the prebuilt Next.js static output

## Managing the Container

**View logs:**
```bash
docker logs -f smile-portfolio
```

**Stop the container:**
```bash
docker stop smile-portfolio
```

**Restart after manual stop:**
```bash
docker start smile-portfolio
```

**Remove everything:**
```bash
docker-compose down
# or
docker stop smile-portfolio
docker rm smile-portfolio
docker image rm smile-portfolio
```

## SSL Certificates

`docker-entrypoint.sh` generates a self-signed certificate the first time the
container starts, into the container's own writable filesystem:
- **Certificate**: `/app/certs/cert.pem`
- **Key**: `/app/certs/key.pem`
- **Valid for**: 365 days

The key is never written during `docker build`, so it never lands in an image
layer — anyone who pulls or inspects the image gets no key material. Each
container gets its own freshly generated cert unless you mount your own.

**For production with a real domain**, mount certificates from Let's Encrypt
or your CA over the same path — the entrypoint skips generation when a cert
already exists at that path:
```bash
docker run -d \
  --name smile-portfolio \
  -p 443:8443 \
  -v /path/to/cert.pem:/app/certs/cert.pem:ro \
  -v /path/to/key.pem:/app/certs/key.pem:ro \
  --restart unless-stopped \
  smile-portfolio
```
Or uncomment the `volumes:` block in `docker-compose.yml`.

## Port Mapping

- Container: `8443` (unprivileged — lets the process run as a non-root user)
- Host: `443` (or any port you choose)

```bash
docker run -d \
  --name smile-portfolio \
  -p 443:8443 \
  --restart unless-stopped \
  smile-portfolio
```
Access at `https://localhost` (or `https://localhost:<host-port>` if you mapped a different one).

## Security notes

- **No baked-in private key** — certs are generated at container start into
  ephemeral storage, not during `docker build`. Nothing sensitive is
  committed to an image layer.
- **Runs as non-root** — the final `USER node` means a compromised process
  doesn't get root inside the container.
- **Self-signed certs are for local/preview use.** Browsers will warn about
  them. Use real certificates (mounted as above) for anything public-facing.

## Environment

The container runs with `NODE_ENV=production` and serves the optimized static export from `out/`.
