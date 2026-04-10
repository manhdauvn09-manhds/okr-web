#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# FOKR – Docker Deploy Script for Ubuntu
# ═══════════════════════════════════════════════════
# Usage:
#   chmod +x deploy-docker.sh
#   ./deploy-docker.sh          # Build & start all
#   ./deploy-docker.sh stop     # Stop all services
#   ./deploy-docker.sh restart  # Rebuild & restart
#   ./deploy-docker.sh logs     # View logs
#   ./deploy-docker.sh clean    # Stop & remove volumes
# ═══════════════════════════════════════════════════

COMPOSE_FILE="docker-compose.yml"

echo "╔════════════════════════════════════════╗"
echo "║   FOKR – OKR Management System        ║"
echo "║   FPT Software – Docker Deploy         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker "$USER"
    echo "✅ Docker installed. You may need to log out and log back in for group changes to take effect."
    echo "   Then run this script again."
    exit 0
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose plugin is not available."
    echo "   Install it with: sudo apt-get install -y docker-compose-plugin"
    exit 1
fi

ACTION="${1:-up}"

case "$ACTION" in
  up|start)
    echo "🚀 Building and starting FOKR services..."
    docker compose -f "$COMPOSE_FILE" up --build -d
    echo ""
    echo "✅ FOKR is running!"
    echo "   Frontend: http://localhost/f-okr/"
    echo "   Backend:  http://localhost:3000"
    echo "   MySQL:    localhost:3307"
    echo ""
    echo "   View logs: ./deploy-docker.sh logs"
    ;;
  stop)
    echo "🛑 Stopping FOKR services..."
    docker compose -f "$COMPOSE_FILE" down
    echo "✅ All services stopped."
    ;;
  restart)
    echo "🔄 Restarting FOKR services..."
    docker compose -f "$COMPOSE_FILE" down
    docker compose -f "$COMPOSE_FILE" up --build -d
    echo "✅ Restarted."
    ;;
  logs)
    docker compose -f "$COMPOSE_FILE" logs -f
    ;;
  status)
    docker compose -f "$COMPOSE_FILE" ps
    ;;
  clean)
    echo "🧹 Stopping and removing all data (including database)..."
    docker compose -f "$COMPOSE_FILE" down -v --rmi local
    echo "✅ Cleaned."
    ;;
  *)
    echo "Usage: $0 {up|stop|restart|logs|status|clean}"
    exit 1
    ;;
esac
