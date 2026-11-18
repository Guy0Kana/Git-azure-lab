#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/srv/team-project/live"
APP_DIR="$REPO_DIR/weather-site"
BRANCH="main"
PM2_NAME="weather"

cd "$REPO_DIR"
echo "[$(date)] Pulling latest changes..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

cd "$APP_DIR"
echo "[$(date)] Installing dependencies..."
npm ci --omit=dev

echo "[$(date)] Restarting app..."
pm2 restart "$PM2_NAME" --update-env
pm2 save

echo "[$(date)] Deploy complete."
