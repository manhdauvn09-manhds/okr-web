#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# STEP 2: Patch source – Change base path & ports
#   /f-okr/ → /f-okr-v2/
#   Backend port 3000 → 3001
#   MySQL port 3307 → 3308
#   Container names: okr_* → okr_v2_*
# ═══════════════════════════════════════════════════

INSTALL_DIR="/opt/okr-web-v2"

echo "╔════════════════════════════════════════════╗"
echo "║  STEP 2: Patch Source for V2               ║"
echo "╚════════════════════════════════════════════╝"
echo ""

cd "$INSTALL_DIR"

# ── 2.1 Patch vite.config.ts: base → /f-okr-v2/ ──
echo "🔧 Patching frontend/vite.config.ts..."
sed -i "s|base: '/f-okr/'|base: '/f-okr-v2/'|g" frontend/vite.config.ts
echo "   ✅ base: '/f-okr-v2/'"

# ── 2.2 Patch frontend nginx.conf ──
echo "🔧 Patching frontend/nginx.conf..."
cat > frontend/nginx.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # SPA routing – all /f-okr-v2/* paths serve index.html
    location /f-okr-v2/ {
        alias /usr/share/nginx/html/f-okr-v2/;
        try_files $uri $uri/ /f-okr-v2/index.html;
    }

    # Redirect root to /f-okr-v2/
    location = / {
        return 301 /f-okr-v2/;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
NGINX_EOF
echo "   ✅ nginx.conf updated for /f-okr-v2/"

# ── 2.3 Patch frontend Dockerfile: copy to /f-okr-v2 ──
echo "🔧 Patching frontend/Dockerfile..."
sed -i "s|/usr/share/nginx/html/f-okr|/usr/share/nginx/html/f-okr-v2|g" frontend/Dockerfile
echo "   ✅ Dockerfile: COPY to /f-okr-v2"

# ── 2.4 Patch App.tsx: BrowserRouter basename ──
echo "🔧 Patching frontend/src/App.tsx..."
sed -i "s|basename=\"/f-okr\"|basename=\"/f-okr-v2\"|g" frontend/src/App.tsx
sed -i "s|basename='/f-okr'|basename='/f-okr-v2'|g" frontend/src/App.tsx
echo "   ✅ BrowserRouter basename='/f-okr-v2'"

# ── 2.5 Patch api.ts: backend URL for production ──
echo "🔧 Patching frontend/src/lib/api.ts..."
# The API base URL will use env variable; set default to v2 backend port
sed -i "s|http://localhost:3000|http://52.62.81.34:3001|g" frontend/src/lib/api.ts
echo "   ✅ API base URL → http://52.62.81.34:3001"

# ── 2.6 Create docker-compose-v2.yml with different ports & names ──
echo "🔧 Creating docker-compose-v2.yml..."
cat > docker-compose-v2.yml << 'COMPOSE_EOF'
services:
  mysql:
    image: mysql:8.0
    container_name: okr_v2_mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: okr_v2_db
      MYSQL_USER: okr_v2_user
      MYSQL_PASSWORD: okr_v2_password
    command: --default-authentication-plugin=mysql_native_password
    ports:
      - "3308:3306"
    volumes:
      - mysql_v2_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: okr_v2_backend
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      mysql:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: okr_v2_frontend
    restart: unless-stopped
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  mysql_v2_data:
    driver: local
COMPOSE_EOF
echo "   ✅ docker-compose-v2.yml created"
echo "      MySQL:    port 3308 (container: okr_v2_mysql)"
echo "      Backend:  port 3001 (container: okr_v2_backend)"
echo "      Frontend: port 8080 (container: okr_v2_frontend)"

echo ""
echo "✅ STEP 2 COMPLETE! All source patched for /f-okr-v2/"
echo ""
echo "👉 Next: ./deploy-v2/step3-build-run.sh"
