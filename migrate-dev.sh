#!/bin/bash

# ====================================
# LazyChillRoom v3 - Database Migration Script
# ====================================

set -e

echo "🗄️  LazyChillRoom v3 データベース初期化中..."
echo ""

# バックエンドコンテナが起動しているかチェック
if ! podman ps | grep -q "lazychillroom_backend"; then
    echo "❌ バックエンドコンテナが起動していません。"
    echo "💡 先に ./start-dev.sh を実行してください。"
    exit 1
fi

# PostgreSQLが起動しているかチェック
if ! podman ps | grep -q "lazychillroom_postgres"; then
    echo "❌ PostgreSQLコンテナが起動していません。"
    echo "💡 先に ./start-dev.sh を実行してください。"
    exit 1
fi

echo "⏳ PostgreSQLの準備完了を待機中..."
sleep 3

echo ""
echo "🔄 マイグレーション実行中..."
podman-compose exec backend npm run db:migrate

echo ""
echo "🌱 基本データをシード中..."
podman-compose exec backend npm run db:seed

echo ""
echo "✅ データベース初期化が完了しました！"
echo ""
echo "🔍 pgAdminで確認: http://localhost:8080"
echo "   📧 Email:    admin@lazychillroom.com"
echo "   🔒 Password: admin_password"
echo ""
echo "🔗 サーバー接続設定:"
echo "   🏷️  Name:     LazyChillRoom DB"
echo "   🖥️  Host:     postgres"
echo "   🔌 Port:     5432"
echo "   🗄️  Database: lazychillroom_dev"
echo "   👤 Username: lazychillroom_user"
echo "   🔒 Password: secure_password"
