# Build stage — only exists to produce out/, discarded after
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Runtime stage — no TLS, no certs, no openssl: nginx on the host owns HTTPS
# and reverse-proxies here over loopback. server.mjs's only runtime
# dependency is the SES client; everything else (Next, React, Tailwind) was
# build-time only and never makes it into this image.
FROM node:20-alpine
WORKDIR /app
RUN npm install --no-save @aws-sdk/client-ses

COPY --from=builder /app/out ./out
COPY server.mjs ./server.mjs
RUN chown -R node:node /app

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["node", "server.mjs"]
