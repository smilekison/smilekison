# Docker Setup for smilekisan.com

## Quick Start

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up -d
```

This will:
- Build the portfolio from source
- Generate self-signed HTTPS certificates
- Start the service on port 443 (HTTPS)
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
  -p 443:443 \
  --restart unless-stopped \
  smile-portfolio
```

## What's Included

- **Multi-stage build**: Minimal final image (Node 18 Alpine)
- **HTTPS by default**: Self-signed certificates generated at runtime
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

The Dockerfile automatically generates self-signed certificates at build time:
- **Certificate**: `/etc/ssl/certs/cert.pem`
- **Key**: `/etc/ssl/certs/key.pem`
- **Valid for**: 365 days

For production with a real domain, replace these with certificates from Let's Encrypt or your CA.

## Port Mapping

- Container: `443` (HTTPS inside)
- Host: `443` (map to any port with `-p <host>:443`)

Example: Run on port 8443 instead of 443
```bash
docker run -d \
  --name smile-portfolio \
  -p 8443:443 \
  --restart unless-stopped \
  smile-portfolio
```
Then access at `https://localhost:8443`

## Environment

The container runs with `NODE_ENV=production` and serves the optimized static export from `out/`.
