#!/bin/sh
set -e

CERT_DIR="/app/certs"
CERT="$CERT_DIR/cert.pem"
KEY="$CERT_DIR/key.pem"

# Generate a self-signed cert into the container's writable, ephemeral
# filesystem — never at build time. Real certificates can be mounted over
# /app/certs for production.
if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
  openssl req -x509 -newkey rsa:2048 -keyout "$KEY" -out "$CERT" \
    -days 365 -nodes -subj "/CN=localhost"
fi

exec node /app/server.mjs
