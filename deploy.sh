#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# OKR Web – Docker Deploy Script
# © ManhDS – OKR v1.0
# ═══════════════════════════════════════════════════
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh              # Build & start all
#   ./deploy.sh stop         # Stop all
#   ./deploy.sh restart      # Rebuild & restart
#   ./deploy.sh logs         # View logs
#   ./deploy.sh status       # Check status
#   ./deploy.sh clean        # Stop & remove all data
# ═══════════════════════════════════════════════════

echo "╔════════════════════════════════════════╗"
echo "║   OKR Web – Deploy Script              ║"
echo "║   © ManhDS – v1.0                      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# ── Install Docker if needed ──
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
        | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
        docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker "$USER"
    echo "✅ Docker installed. Log out & back in, then run this script again."
    exit 0
fi

ACTION="${1:-up}"

case "$ACTION" in
  up|start)
    echo "🚀 Building and starting OKR services..."
    docker compose up --build -d
    echo ""
    echo "⏳ Waiting for services..."
    sleep 8
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "✅ OKR is running!"
    SERVER_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "localhost")
    echo "   🌐 http://${SERVER_IP}/f-okr/"
    echo "   📡 Backend: http://${SERVER_IP}:3000"
    ;;
  stop)
    echo "🛑 Stopping OKR services..."
    docker compose down
    echo "✅ Stopped."
    ;;
  restart)
    echo "🔄 Rebuilding & restarting..."
    docker compose down
    docker compose up --build -d
    sleep 8
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo "✅ Restarted!"
    ;;
  logs)
    docker compose logs -f --tail 50
    ;;
  status)
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    curl -s -o /dev/null -w "Frontend: HTTP %{http_code}\n" http://localhost/f-okr/ 2>/dev/null || echo "Frontend: not reachable"
    curl -s -o /dev/null -w "Backend:  HTTP %{http_code}\n" http://localhost:3000/ 2>/dev/null || echo "Backend: not reachable"
    ;;
  clean)
    echo "🧹 Stopping & cleaning everything..."
    docker compose down -v
    docker system prune -a -f
    docker builder prune -a -f
    echo "✅ Cleaned."
    ;;
  *)
    echo "Usage: $0 {up|stop|restart|logs|status|clean}"
    ;;
esac
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
