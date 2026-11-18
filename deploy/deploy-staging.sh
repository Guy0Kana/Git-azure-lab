#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/srv/team-project/staging"
APP_DIR="$REPO_DIR/weather-site"
BRANCH="staging"
PM2_NAME="weather-staging"

cd "$REPO_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

cd "$APP_DIR"
npm ci --omit=dev
PORT=3001 pm2 restart "$PM2_NAME" --update-env || PORT=3001 pm2 start server.js --name "$PM2_NAME"
pm2 save
echo "Staging deploy complete."
