#!/bin/bash

# ====================================
# LazyChillRoom v3 - Development Stop Script
# ====================================

set -e

echo "🛑 LazyChillRoom v3 開発環境を停止しています..."
echo ""

# Podman Compose でサービスを停止
podman-compose down

echo ""
echo "✅ すべてのサービスが停止しました。"
echo ""
echo "💡 データは保持されています（ボリューム削除されていません）"
echo ""
echo "🗄️  データも削除したい場合: podman-compose down -v"
echo "🐳 イメージも削除したい場合: podman-compose down --rmi all"
