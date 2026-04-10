#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# STEP 1: Setup server – Install Docker & Clone source
# ═══════════════════════════════════════════════════
# Chạy trên server Ubuntu: ./deploy-v2/step1-setup-server.sh
# ═══════════════════════════════════════════════════

REPO_URL="https://github.com/manhdauvn09-manhds/okr-web.git"
INSTALL_DIR="/opt/okr-web-v2"

echo "╔════════════════════════════════════════════╗"
echo "║  STEP 1: Setup Server & Clone Source       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ── 1.1 Check & Install Docker ──
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
    echo "✅ Docker installed."
else
    echo "✅ Docker already installed: $(docker --version)"
fi

# ── 1.2 Check Docker Compose ──
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose plugin not found."
    echo "   Run: sudo apt-get install -y docker-compose-plugin"
    exit 1
fi
echo "✅ Docker Compose: $(docker compose version)"

# ── 1.3 Install Nginx (host-level reverse proxy) ──
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo "✅ Nginx installed."
else
    echo "✅ Nginx already installed: $(nginx -v 2>&1)"
fi

# ── 1.4 Install Git ──
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    sudo apt-get install -y git
fi
echo "✅ Git: $(git --version)"

# ── 1.5 Clone source code ──
if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  Directory $INSTALL_DIR already exists."
    echo "   Pulling latest changes..."
    cd "$INSTALL_DIR"
    git pull origin main
else
    echo "📥 Cloning source code..."
    sudo mkdir -p "$INSTALL_DIR"
    sudo chown "$USER:$USER" "$INSTALL_DIR"
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

echo ""
echo "✅ STEP 1 COMPLETE!"
echo "   Source code: $INSTALL_DIR"
echo ""
echo "👉 Next: ./deploy-v2/step2-patch-source.sh"
