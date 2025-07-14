# セットアップガイド

LazyChillRoom v3の開発環境セットアップ手順です。

## 🖥️ 開発環境

### 必要な環境
- **OS**: WSL2 + Ubuntu 24.04 (Windows) / macOS / Linux
- **Node.js**: v22 LTS
- **PostgreSQL**: v15+
- **Redis**: v7+

## 🚀 クイックスタート

### 1. 基本ツールのインストール

#### WSL2セットアップ (Windows)
```powershell
# PowerShell（管理者権限）
wsl --install -d Ubuntu-24.04
wsl --set-default-version 2
```

#### Node.js (推奨: nvm使用)
```bash
# Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/latest/install.sh | bash
source ~/.bashrc

# Node.js v22 LTS
nvm install 22
nvm use 22
```

### 2. データベースセットアップ

#### PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# サービス開始
sudo systemctl start postgresql
sudo systemctl enable postgresql

# ユーザー・DB作成
sudo -u postgres createuser --interactive your_username
sudo -u postgres createdb lazychillroom_dev
sudo -u postgres createdb lazychillroom_test
```

#### Redis
```bash
# Ubuntu/Debian
sudo apt install redis-server

# サービス開始
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. プロジェクトセットアップ

```bash
# リポジトリクローン
git clone https://github.com/suzunayui/lazychillroom_v3.git
cd lazychillroom_v3

# バックエンド
cd backend
cp .env.example .env
# .envファイルを編集（DB接続情報など）
npm install
npm run migrate
npm run seed

# フロントエンド
cd ../frontend
npm install

# 開発サーバー起動
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

## 🐳 コンテナ環境 (Podman)

### Podmanセットアップ
```bash
# Ubuntu 24.04
sudo apt update
sudo apt install podman

# 設定
echo 'unqualified-search-registries = ["docker.io"]' | sudo tee -a /etc/containers/registries.conf
```

### 開発環境起動
```bash
# データベース＆Redis起動
podman-compose up -d db redis

# アプリケーション開発モード
cd backend && npm run dev
cd frontend && npm run dev
```

## 🛠️ 開発ツール

### VS Code 拡張機能
```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode-remote.remote-wsl"
  ]
}
```

### Git設定
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 🔧 トラブルシューティング

### よくある問題

#### PostgreSQL接続エラー
```bash
# サービス状態確認
sudo systemctl status postgresql

# ログ確認
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### Podman権限エラー
```bash
# rootless設定
podman system migrate
systemctl --user enable podman.socket
```

#### Node.js バージョン問題
```bash
# 現在のバージョン確認
node --version
npm --version

# nvmでバージョン切り替え
nvm list
nvm use 22
```

## 📚 関連リンク

- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)
- [Redis ドキュメント](https://redis.io/documentation)
- [Svelte ドキュメント](https://svelte.dev/docs)
- [TailwindCSS ドキュメント](https://tailwindcss.com/docs)

---

**最終更新**: 2025年1月14日
