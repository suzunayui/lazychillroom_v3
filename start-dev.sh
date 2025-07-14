#!/bin/bash

# ====================================
# LazyChillRoom v3 - Development Start Script
# ====================================

set -e

echo "🚀 LazyChillRoom v3 開発環境を起動しています..."
echo ""

# Podman Compose でサービスを起動
podman-compose up -d

echo ""
echo "⏳ サービスの起動を待機中..."
sleep 5

echo ""
echo "✅ LazyChillRoom v3 が起動しました！"
echo ""
echo "==================== 📱 アクセス URL ===================="
echo ""
echo "🌐 フロントエンド (Svelte):     http://localhost:5173"
echo "🔧 バックエンド API:            http://localhost:3000"
echo "🗄️  pgAdmin (DB管理):           http://localhost:8080"
echo "📊 Redis Commander:            http://localhost:8081"
echo ""
echo "======================= 🔑 認証情報 ======================="
echo ""
echo "pgAdmin:"
echo "  📧 Email:    admin@lazychillroom.com"
echo "  🔒 Password: admin_password"
echo ""
echo "PostgreSQL:"
echo "  🏷️  Database: lazychillroom_dev"
echo "  👤 User:     lazychillroom_user"
echo "  🔒 Password: secure_password"
echo ""
echo "Redis:"
echo "  🔒 Password: redis_password"
echo ""
echo "========================================================"
echo ""
echo "💡 サービス状況を確認: ./status-dev.sh"
echo "🛑 サービス停止:       ./stop-dev.sh"
echo "🗄️  DB初期化:          ./migrate-dev.sh"
echo ""
echo "📝 ログ確認: podman-compose logs -f [service_name]"
echo "   例: podman-compose logs -f backend"
echo ""
echo "Ctrl+クリックでブラウザを開けます ⬆️"
