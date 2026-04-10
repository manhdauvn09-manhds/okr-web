#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# QUICK DEPLOY: Run all steps in sequence
# ═══════════════════════════════════════════════════
# Usage: chmod +x deploy-v2/deploy-all.sh && ./deploy-v2/deploy-all.sh
# ═══════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════╗"
echo "║  OKR v2.0 – Full Deploy (All Steps)            ║"
echo "║  Server: 52.62.81.34                           ║"
echo "║  Path:   /f-okr-v2/                            ║"
echo "║  © ManhDS – OKR v1.0                           ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "This will run steps 1-5 sequentially."
echo "V1 at /f-okr/ will NOT be affected."
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash "$SCRIPT_DIR/step1-setup-server.sh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash "$SCRIPT_DIR/step2-patch-source.sh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash "$SCRIPT_DIR/step3-build-run.sh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash "$SCRIPT_DIR/step4-nginx-proxy.sh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash "$SCRIPT_DIR/step5-verify.sh"
