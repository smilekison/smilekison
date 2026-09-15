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

# -s (SPA fallback: rewrite every unmatched path to index.html) is wrong
# here — this is a real multi-page static export, not a single-page app.
# With -s, every project case-study URL silently served the homepage
# instead of 404ing or, correctly, its own page.
exec serve out -l 8443 --ssl-cert="$CERT" --ssl-key="$KEY"
