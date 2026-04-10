#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# STEP 4: Configure host Nginx as reverse proxy
#   - /f-okr/    → V1 frontend (port 80 container)
#   - /f-okr-v2/ → V2 frontend (port 8080)
#   - /api/v2/   → V2 backend  (port 3001)
# ═══════════════════════════════════════════════════

echo "╔════════════════════════════════════════════╗"
echo "║  STEP 4: Nginx Reverse Proxy Config        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ── 4.1 Detect current V1 setup ──
# V1's frontend container (okr_frontend) listens on host port 80.
# But host Nginx also needs port 80.
# Two possible scenarios:
#   A) V1 frontend directly on port 80 (no host nginx) ← most likely
#   B) Host nginx already running as proxy

# Check if host nginx is running vs container nginx on port 80
V1_FRONTEND_PORT=$(docker port okr_frontend 80 2>/dev/null | head -1 | cut -d: -f2 || echo "")

echo "🔍 Detecting current V1 setup..."
if [ -n "$V1_FRONTEND_PORT" ]; then
    echo "   V1 frontend container (okr_frontend) mapped to host port: $V1_FRONTEND_PORT"
else
    echo "   ⚠️  V1 frontend container 'okr_frontend' not found or not running."
    echo "   Will configure nginx assuming V1 is on port 80."
    V1_FRONTEND_PORT="80"
fi

# ── 4.2 If V1 is on port 80, we need to remap it ──
if [ "$V1_FRONTEND_PORT" = "80" ]; then
    echo ""
    echo "⚠️  V1 frontend is on port 80 – same as host Nginx."
    echo "   We need to remap V1 frontend to port 8081 first."
    echo ""

    # Check if V1 has a docker-compose file
    V1_DIR=""
    for dir in /opt/okr-web /home/ubuntu/okr-web /root/okr-web; do
        if [ -f "$dir/docker-compose.yml" ]; then
            V1_DIR="$dir"
            break
        fi
    done

    if [ -n "$V1_DIR" ]; then
        echo "   Found V1 at: $V1_DIR"
        echo "   Updating V1 frontend port: 80 → 8081..."

        cd "$V1_DIR"
        # Backup original
        cp docker-compose.yml docker-compose.yml.bak

        # Change frontend port mapping from "80:80" to "8081:80"
        sed -i 's/"80:80"/"8081:80"/g' docker-compose.yml

        # Restart V1 with new port
        echo "   Restarting V1 containers..."
        docker compose -f docker-compose.yml up -d frontend
        sleep 3
        V1_FRONTEND_PORT="8081"
        echo "   ✅ V1 frontend remapped to port $V1_FRONTEND_PORT"
    else
        echo ""
        echo "   ❌ Cannot find V1 docker-compose.yml automatically."
        echo "   Please manually change V1 frontend port from 80 to 8081:"
        echo "   1. Find V1's docker-compose.yml"
        echo "   2. Change '80:80' to '8081:80' in the frontend service"
        echo "   3. Run: docker compose up -d frontend"
        echo "   4. Then re-run this script."
        echo ""
        read -p "   Enter V1 frontend host port (default 8081): " V1_FRONTEND_PORT
        V1_FRONTEND_PORT="${V1_FRONTEND_PORT:-8081}"
    fi
fi

cd /opt/okr-web-v2

# ── 4.3 Create Nginx site config ──
echo ""
echo "🔧 Creating Nginx config..."

sudo tee /etc/nginx/sites-available/okr-proxy > /dev/null << NGINX_CONF
# ═══════════════════════════════════════════════════
# OKR Reverse Proxy – V1 + V2 on same server
# ═══════════════════════════════════════════════════
server {
    listen 80 default_server;
    server_name 52.62.81.34;

    # ── V1: OKR old version ──
    location /f-okr/ {
        proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}/f-okr/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # V1 catch-all for routes without /f-okr/ prefix
    # (vì V1 cũ có bug route: /okr-all, /team-report, etc.)
    location /okr-all    { proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}; proxy_set_header Host \$host; }
    location /team-report { proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}; proxy_set_header Host \$host; }
    location /create     { proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}; proxy_set_header Host \$host; }
    location /objectives { proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}; proxy_set_header Host \$host; }
    location /members    { proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}; proxy_set_header Host \$host; }
    location /delegation { proxy_pass http://127.0.0.1:${V1_FRONTEND_PORT}; proxy_set_header Host \$host; }

    # ── V2: OKR new version ──
    location /f-okr-v2/ {
        proxy_pass http://127.0.0.1:8080/f-okr-v2/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ── V2 Backend API (for frontend to call) ──
    location /api/v2/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ── V1 Backend API ──
    location /api/v1/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # ── Default: redirect to V1 ──
    location = / {
        return 301 /f-okr/;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
NGINX_CONF

echo "   ✅ Config written to /etc/nginx/sites-available/okr-proxy"

# ── 4.4 Enable site & remove default ──
sudo ln -sf /etc/nginx/sites-available/okr-proxy /etc/nginx/sites-enabled/okr-proxy
sudo rm -f /etc/nginx/sites-enabled/default

# ── 4.5 Test & Reload ──
echo "🧪 Testing Nginx config..."
if sudo nginx -t; then
    echo "✅ Nginx config valid!"
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded."
else
    echo "❌ Nginx config has errors. Please fix manually."
    exit 1
fi

echo ""
echo "✅ STEP 4 COMPLETE!"
echo ""
echo "   V1 (old): http://52.62.81.34/f-okr/"
echo "   V2 (new): http://52.62.81.34/f-okr-v2/"
echo "   V2 API:   http://52.62.81.34/api/v2/"
echo ""
echo "👉 Next: ./deploy-v2/step5-verify.sh"
