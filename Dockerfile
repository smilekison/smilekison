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

# Install serve and openssl
RUN apk add --no-cache openssl && npm install -g serve

# Generate self-signed certificates for HTTPS
RUN mkdir -p /etc/ssl/certs && \
    openssl req -x509 -newkey rsa:2048 -keyout /etc/ssl/certs/key.pem -out /etc/ssl/certs/cert.pem \
    -days 365 -nodes -subj "/CN=localhost"

# Copy built static files from builder
COPY --from=builder /app/out /app/out

# Expose HTTPS port
EXPOSE 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider https://localhost:443/ || exit 1

# Run serve with HTTPS on port 443
CMD ["serve", "-s", "out", "-l", "443", "--ssl-cert=/etc/ssl/certs/cert.pem", "--ssl-key=/etc/ssl/certs/key.pem"]
