#!/bin/bash
# deploy.sh — Chạy một lần từ Ubuntu server để pull code và build toàn bộ
# Usage: bash deploy.sh

set -e
APP_DIR="/opt/f-okr"
NGINX_ROOT="/var/www/f-okr"
NODE_VERSION="20"

echo "=== 1. Cài công cụ cần thiết ==="
sudo apt-get update -y
sudo apt-get install -y nginx git curl

# Cài Node.js 20
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Cài PM2
if ! command -v pm2 &>/dev/null; then
  sudo npm install -g pm2
fi

echo "=== 2. Clone / pull code ==="
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull
else
  sudo git clone https://github.com/TEN_BAN/okr-web.git "$APP_DIR"
  cd "$APP_DIR"
fi
sudo chown -R $USER:$USER "$APP_DIR"

echo "=== 3. Build Backend (NestJS) ==="
cd "$APP_DIR/backend"
npm ci
npm run build

echo "=== 4. Build Frontend (React/Vite) — base path /f-okr/ ==="
cd "$APP_DIR/frontend"
npm ci
VITE_BASE_PATH=/f-okr/ VITE_API_URL=http://localhost:3000 npm run build

echo "=== 5. Copy frontend dist → Nginx web root ==="
sudo mkdir -p "$NGINX_ROOT"
sudo cp -r "$APP_DIR/frontend/dist/." "$NGINX_ROOT/"

echo "=== 6. Cấu hình Nginx ==="
sudo tee /etc/nginx/sites-available/f-okr <<'NGINXEOF'
server {
    listen 80;
    server_name _;

    # ── Frontend: subfolder /f-okr/ ──
    location /f-okr/ {
        alias /var/www/f-okr/;
        try_files $uri $uri/ /f-okr/index.html;
    }

    # ── Backend API: proxy /api/ → NestJS :3000 ──
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/f-okr /etc/nginx/sites-enabled/f-okr
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "=== 7. Khởi động Backend với PM2 ==="
cd "$APP_DIR/backend"
pm2 stop f-okr-api 2>/dev/null || true
pm2 start dist/main.js --name f-okr-api --env production
pm2 save
pm2 startup systemd -u $USER --hp $HOME | tail -1 | sudo bash

echo ""
echo "✅ Deploy hoàn tất!"
echo "   Frontend: http://$(curl -s ifconfig.me)/f-okr/"
echo "   API     : http://$(curl -s ifconfig.me)/api/"
