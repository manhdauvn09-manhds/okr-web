#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# STEP 3: Docker Build & Run all V2 containers
# ═══════════════════════════════════════════════════

INSTALL_DIR="/opt/okr-web-v2"
COMPOSE_FILE="docker-compose-v2.yml"

echo "╔════════════════════════════════════════════╗"
echo "║  STEP 3: Docker Build & Start V2           ║"
echo "╚════════════════════════════════════════════╝"
echo ""

cd "$INSTALL_DIR"

# ── 3.1 Build & Start ──
echo "🔨 Building Docker images (this may take 2-5 minutes)..."
docker compose -f "$COMPOSE_FILE" build --no-cache

echo ""
echo "🚀 Starting containers..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# ── 3.2 Check container status ──
echo ""
echo "📋 Container status:"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo "✅ STEP 3 COMPLETE!"
echo ""
echo "   V2 Frontend: http://localhost:8080/f-okr-v2/"
echo "   V2 Backend:  http://localhost:3001"
echo "   V2 MySQL:    localhost:3308"
echo ""
echo "👉 Next: ./deploy-v2/step4-nginx-proxy.sh"
