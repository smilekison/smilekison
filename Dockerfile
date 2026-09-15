# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# npm install is intentional here because the SES dependency was added to
# package.json; it also refreshes package-lock.json during the image build.
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/out /app/out
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY server.mjs ./server.mjs
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    mkdir -p /app/certs && \
    chown -R node:node /app

USER node

EXPOSE 8443

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider https://localhost:8443/ || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
