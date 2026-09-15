#!/bin/sh
set -e

CERT_DIR="/app/certs"
CERT="$CERT_DIR/cert.pem"
KEY="$CERT_DIR/key.pem"

# Generate a self-signed cert into the container's writable, ephemeral
# filesystem — never at build time, so no private key ever lands in an
# image layer. Skipped if real certs were mounted over $CERT_DIR (see
# DOCKER.md for the production/Let's Encrypt setup).
if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
  openssl req -x509 -newkey rsa:2048 -keyout "$KEY" -out "$CERT" \
    -days 365 -nodes -subj "/CN=localhost"
fi

# server.js serves the static export (correctly — a real multi-page site,
# not an SPA fallback) and additionally handles POST /api/contact via SES.
# SES_FROM / SES_TO / AWS_REGION are read from the environment at `docker
# run` time; see DOCKER.md for the SES setup this depends on.
exec node /app/server.js
