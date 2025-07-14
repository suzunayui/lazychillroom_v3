# Podman コンテナ環境ガイド

## Podman の概要

Podman を使用することで、コンテナベースの統一された開発・デプロイ環境を構築できます。Docker と互換性がありながら、デーモンレスで軽量に動作します。

## 開発ワークフロー

### 1. ローカル開発（推奨）

```bash
# WSL環境で直接開発
cd ~/projects/lazychillroom_v3

# バックエンド起動
cd backend && npm run dev

# フロントエンド起動（別ターミナル）
cd frontend && npm run dev
```

### 2. コンテナ開発

```bash
# Podman Composeで全サービス起動
podman-compose up -d

# 開発サーバー確認
podman-compose ps

# ログ確認
podman-compose logs backend
podman-compose logs frontend
```

## Podman Compose ファイル例

### podman-compose.yml（開発環境）

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/lazychillroom
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: lazychillroom
      POSTGRES_USER: lazychillroom_user
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

### podman-compose.prod.yml（本番環境）

```yaml
version: "3.8"

services:
  backend:
    image: lazychillroom-backend:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  frontend:
    image: lazychillroom-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

## Podman 設定（開発・デプロイ共通）

### 1. ルートレス設定

```bash
# ユーザー名前空間設定
echo "$USER:100000:65536" | sudo tee -a /etc/subuid
echo "$USER:100000:65536" | sudo tee -a /etc/subgid

# Podman設定確認
podman info
```

### 2. コンテナネットワーク

```bash
# アプリケーション用ネットワーク作成
podman network create lazychillroom-network

# ネットワーク確認
podman network ls
```

### 3. 開発環境用コマンド

```bash
# 開発サーバー起動
podman-compose up -d

# ログ確認
podman-compose logs -f

# 停止
podman-compose down
```

### 4. 本番環境用コマンド

```bash
# プロダクション用イメージビルド
podman build -t lazychillroom-backend:latest ./backend
podman build -t lazychillroom-frontend:latest ./frontend

# 本番環境デプロイ
podman-compose -f podman-compose.prod.yml up -d
```

## トラブルシューティング

### Podman 関連

```bash
# Podmanサービス確認
systemctl --user status podman.socket

# コンテナ一覧確認
podman ps -a

# イメージ一覧確認
podman images

# ログ確認
podman logs <container_name>

# コンテナクリーンアップ
podman system prune
```

### ポート競合

```bash
# 使用中のポート確認
ss -tulpn | grep :3000

# Podmanコンテナのポート確認
podman port <container_name>
```

## Podman のメリット

1. **軽量**: デーモンレスで動作、リソース消費が少ない
2. **セキュリティ**: ルートレスコンテナでセキュアな実行
3. **Docker 互換**: 既存の Dockerfile や Compose ファイルが利用可能
4. **開発・本番統一**: 同じツールで開発からデプロイまで
5. **WSL 統合**: WSL 環境でスムーズに動作

## Docker との比較

| 項目 | Podman | Docker |
|------|--------|--------|
| デーモン | 不要 | 必要 |
| ルート権限 | 不要 | 必要（通常） |
| セキュリティ | 高い | 中程度 |
| リソース消費 | 少ない | 多い |
| 互換性 | Docker CLI互換 | - |

## コンテナ最適化のベストプラクティス

### Dockerfile 最適化

```dockerfile
# マルチステージビルドの使用
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### イメージサイズ削減

- Alpine Linux ベースイメージを使用
- 不要なパッケージを削除
- マルチステージビルドでビルド依存関係を分離
- .dockerignore でビルドコンテキストを最小化
