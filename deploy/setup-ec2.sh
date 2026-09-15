#!/usr/bin/env bash
# One-shot setup for a fresh Ubuntu 24.04 EC2 instance: Docker, nginx,
# certbot, the app container, and a real Let's Encrypt certificate.
#
# Run this ON the EC2 instance (not locally), as a user with sudo, after:
#   1. An Elastic IP is associated with the instance
#   2. smilekisan.com and www.smilekisan.com A records point at that IP
#   3. Security group allows inbound 80 and 443 from 0.0.0.0/0
#   4. An IAM role with ses:SendEmail is attached to the instance
#      (EC2 console -> instance -> Actions -> Security -> Modify IAM role)
#
# Usage: DOMAIN=smilekisan.com EMAIL=you@example.com ./deploy/setup-ec2.sh
set -euo pipefail

DOMAIN="${DOMAIN:-smilekisan.com}"
EMAIL="${EMAIL:?Set EMAIL=you@example.com for Let's Encrypt renewal notices}"
REPO_DIR="${REPO_DIR:-$HOME/smilekison}"

echo "==> Updating system packages"
sudo apt update && sudo apt upgrade -y

echo "==> Installing Docker"
if ! command -v docker &>/dev/null; then
  sudo apt install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update
  sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker "$USER"
  echo "    Added $USER to the docker group — log out/in (or run 'newgrp docker') for this to take effect without sudo."
fi

echo "==> Installing nginx and certbot"
sudo apt install -y nginx certbot python3-certbot-nginx

echo "==> Opening port 80 briefly for the ACME HTTP challenge"
sudo mkdir -p /var/www/certbot

echo "==> Installing the nginx site config (HTTP-only for now; certbot upgrades it to HTTPS)"
sudo tee /etc/nginx/sites-available/"$DOMAIN" > /dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Provisioning...';
        add_header Content-Type text/plain;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/"$DOMAIN" /etc/nginx/sites-enabled/"$DOMAIN"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "==> Requesting the Let's Encrypt certificate"
sudo certbot --nginx -d "$DOMAIN" -d www."$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

echo "==> Installing the real reverse-proxy config (replaces certbot's auto-edit with the maintained one)"
sudo cp "$REPO_DIR/nginx/smilekisan.conf" /etc/nginx/sites-available/"$DOMAIN"
sudo nginx -t && sudo systemctl reload nginx

echo "==> Auto-renewal (certbot's systemd timer is installed automatically; this just reloads nginx after renewal)"
echo '#!/bin/sh
systemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh > /dev/null
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

echo "==> Building and starting the app container"
cd "$REPO_DIR"
# Kept at /opt/.env, outside the repo directory, so it's never at risk from
# a git operation on this checkout — see docker-compose.yml's env_file.
if [ ! -f /opt/.env ]; then
  sudo tee /opt/.env > /dev/null <<ENV
AWS_REGION=us-east-1
SES_FROM_EMAIL=contact@$DOMAIN
SES_TO_EMAIL=smilekisan.dev@gmail.com
ENV
  # Owned by you, not root — so `docker compose` works without sudo once
  # your docker-group membership is active (after the re-login this script
  # asks for), matching the sudo-free examples in DOCKER.md.
  sudo chown "$USER":"$USER" /opt/.env
  sudo chmod 600 /opt/.env
  echo "    Wrote /opt/.env with defaults — edit SES_FROM_EMAIL/SES_TO_EMAIL if needed."
  echo "    Deliberately NOT setting AWS_ACCESS_KEY_ID/SECRET: the SDK picks up"
  echo "    credentials from the instance's IAM role automatically."
fi

sudo docker compose up -d --build

echo ""
echo "==> Done. Verify:"
echo "    curl -I https://$DOMAIN/"
echo "    docker compose logs -f portfolio"
