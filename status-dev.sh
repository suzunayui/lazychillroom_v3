#!/bin/bash

# ====================================
# LazyChillRoom v3 - Development Status Script
# ====================================

echo "📊 LazyChillRoom v3 開発環境の状態"
echo ""

# サービスの状態を確認
echo "==================== 🐳 コンテナ状態 ===================="
podman-compose ps

echo ""
echo "==================== 🌐 ネットワーク状態 =================="
echo "ネットワーク: lazychillroom_v3_lazychillroom_network"
podman network ls | grep lazychillroom || echo "ネットワークが見つかりません"

echo ""
echo "==================== 💾 ボリューム状態 ===================="
echo "PostgreSQL データ:"
podman volume ls | grep postgres_data || echo "PostgreSQLボリュームが見つかりません"
echo "Redis データ:"
podman volume ls | grep redis_data || echo "Redisボリュームが見つかりません"

echo ""
echo "==================== 🔗 アクセス URL ===================="
echo ""

# 各サービスの状態をチェック
if podman ps | grep -q "lazychillroom_frontend"; then
    echo "✅ フロントエンド:  http://localhost:5173"
else
    echo "❌ フロントエンド:  停止中"
fi

if podman ps | grep -q "lazychillroom_backend"; then
    echo "✅ バックエンド:    http://localhost:3000"
else
    echo "❌ バックエンド:    停止中"
fi

if podman ps | grep -q "lazychillroom_postgres"; then
    echo "✅ PostgreSQL:     localhost:5432"
else
    echo "❌ PostgreSQL:     停止中"
fi

if podman ps | grep -q "lazychillroom_redis"; then
    echo "✅ Redis:          localhost:6379"
else
    echo "❌ Redis:          停止中"
fi

if podman ps | grep -q "lazychillroom_pgadmin"; then
    echo "✅ pgAdmin:        http://localhost:8080"
else
    echo "❌ pgAdmin:        停止中"
fi

if podman ps | grep -q "lazychillroom_redis_commander"; then
    echo "✅ Redis Commander: http://localhost:8081"
else
    echo "❌ Redis Commander: 停止中"
fi

echo ""
echo "==================== 🔧 便利コマンド ===================="
echo ""
echo "📋 ログ確認:"
echo "  podman-compose logs -f backend"
echo "  podman-compose logs -f frontend"
echo "  podman-compose logs -f postgres"
echo ""
echo "🔄 サービス再起動:"
echo "  podman-compose restart [service_name]"
echo ""
echo "🏗️  リビルド:"
echo "  podman-compose build [service_name]"
