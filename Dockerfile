# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# openssl generates the cert at container startup (see docker-entrypoint.sh),
# never at build time — no private key ever gets baked into an image layer.
RUN apk add --no-cache openssl && npm install -g serve

# Copy built static files from builder
COPY --from=builder /app/out /app/out
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    mkdir -p /app/certs && \
    chown -R node:node /app

# Run as the non-root 'node' user the base image already provides.
USER node

# Internal port is unprivileged (8443) so the process never needs root to
# bind it; map it to host 443 at `docker run` time (see DOCKER.md).
EXPOSE 8443

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider https://localhost:8443/ || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
