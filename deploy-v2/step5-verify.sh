#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# STEP 5: Verify all services are running
# ═══════════════════════════════════════════════════

echo "╔════════════════════════════════════════════╗"
echo "║  STEP 5: Verification                      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

PASS=0
FAIL=0

check() {
    local label="$1"
    local url="$2"
    local expect="${3:-200}"

    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null || echo "000")
    if [ "$STATUS" = "$expect" ] || [ "$STATUS" = "301" ] || [ "$STATUS" = "302" ]; then
        echo "   ✅ $label → HTTP $STATUS"
        PASS=$((PASS + 1))
    else
        echo "   ❌ $label → HTTP $STATUS (expected $expect)"
        FAIL=$((FAIL + 1))
    fi
}

# ── 5.1 Check Docker containers ──
echo "📋 Docker containers:"
echo ""
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "okr_|NAMES"
echo ""

# ── 5.2 Check URLs ──
echo "🌐 URL checks:"
check "V1 Frontend (/f-okr/)"      "http://52.62.81.34/f-okr/"
check "V2 Frontend (/f-okr-v2/)"   "http://52.62.81.34/f-okr-v2/"
check "V2 Backend (API health)"    "http://52.62.81.34:3001"
check "V1 Backend (API health)"    "http://52.62.81.34:3000"
echo ""

# ── 5.3 Check Nginx ──
echo "🔧 Nginx status:"
if systemctl is-active --quiet nginx; then
    echo "   ✅ Nginx is running"
    PASS=$((PASS + 1))
else
    echo "   ❌ Nginx is NOT running"
    FAIL=$((FAIL + 1))
fi
echo ""

# ── 5.4 Summary ──
echo "════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "════════════════════════════════════════════"

if [ "$FAIL" -eq 0 ]; then
    echo ""
    echo "🎉 ALL CHECKS PASSED!"
    echo ""
    echo "   V1 (cũ): http://52.62.81.34/f-okr/"
    echo "   V2 (mới): http://52.62.81.34/f-okr-v2/"
    echo ""
    echo "   Quản lý V2:"
    echo "   - Xem logs:    cd /opt/okr-web-v2 && docker compose -f docker-compose-v2.yml logs -f"
    echo "   - Stop:        cd /opt/okr-web-v2 && docker compose -f docker-compose-v2.yml down"
    echo "   - Restart:     cd /opt/okr-web-v2 && docker compose -f docker-compose-v2.yml up -d"
    echo "   - Rebuild:     cd /opt/okr-web-v2 && docker compose -f docker-compose-v2.yml up --build -d"
else
    echo ""
    echo "⚠️  Some checks failed. Debug:"
    echo "   - Docker logs: docker logs okr_v2_frontend"
    echo "   - Docker logs: docker logs okr_v2_backend"
    echo "   - Nginx logs:  sudo tail -20 /var/log/nginx/error.log"
    echo "   - Nginx test:  sudo nginx -t"
fi
