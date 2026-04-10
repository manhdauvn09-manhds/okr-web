# 🚀 Hướng dẫn Deploy OKR v2.0 song song với v1.0

## Tổng quan kiến trúc

```
Server 52.62.81.34 (Ubuntu AWS)
│
├── /f-okr/        ← OKR v1 (cũ) – đang chạy – KHÔNG ĐỤNG VÀO
│   ├── Frontend container: okr_frontend (port 80)
│   ├── Backend container:  okr_backend  (port 3000)
│   └── MySQL container:    okr_mysql    (port 3307)
│
├── /f-okr-v2/     ← OKR v2 (mới) – sẽ deploy
│   ├── Frontend container: okr_v2_frontend (port 8080)
│   ├── Backend container:  okr_v2_backend  (port 3001)
│   └── MySQL container:    okr_v2_mysql    (port 3308)
│
└── Nginx host (reverse proxy) → port 80
    ├── /f-okr/    → proxy_pass okr_frontend:80 (v1)
    └── /f-okr-v2/ → proxy_pass okr_v2_frontend:8080 (v2)
```

**Kết quả cuối cùng:**
- V1 cũ: `http://52.62.81.34/f-okr/` (KHÔNG thay đổi)
- V2 mới: `http://52.62.81.34/f-okr-v2/`

---

## Thực hiện theo 5 bước

| Bước | Script | Mô tả |
|------|--------|-------|
| 1 | `step1-setup-server.sh` | Cài Docker, tạo folder, clone source |
| 2 | `step2-patch-source.sh` | Sửa base path `/f-okr/` → `/f-okr-v2/`, đổi port |
| 3 | `step3-build-run.sh` | Docker build & start containers |
| 4 | `step4-nginx-proxy.sh` | Cấu hình Nginx host làm reverse proxy |
| 5 | `step5-verify.sh` | Kiểm tra tất cả services đang chạy |

### Cách chạy:
```bash
# SSH vào server
ssh -i your-key.pem ubuntu@52.62.81.34

# Upload folder deploy-v2/ lên server (hoặc clone từ git)
# Rồi chạy từng bước:
chmod +x deploy-v2/*.sh
./deploy-v2/step1-setup-server.sh
./deploy-v2/step2-patch-source.sh
./deploy-v2/step3-build-run.sh
./deploy-v2/step4-nginx-proxy.sh
./deploy-v2/step5-verify.sh
```

---

## Rollback / Gỡ v2
```bash
cd /opt/okr-web-v2
docker compose -f docker-compose-v2.yml down -v
sudo rm -rf /opt/okr-web-v2
sudo rm /etc/nginx/sites-enabled/okr-proxy
sudo nginx -t && sudo systemctl reload nginx
```
