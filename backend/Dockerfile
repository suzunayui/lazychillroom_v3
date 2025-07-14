# ====================================
# LazyChillRoom v3 - Backend Dockerfile (Production)
# ====================================

FROM docker.io/node:22-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール
RUN apk add --no-cache \
    python3 \
    make \
    g++

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 本番用依存関係のみインストール
RUN npm ci --only=production && npm cache clean --force

# ソースコードをコピー
COPY . .

# 本番用イメージ
FROM docker.io/node:22-alpine AS production

# 作業ディレクトリを設定
WORKDIR /app

# curlをインストール（ヘルスチェック用）
RUN apk add --no-cache curl

# 非特権ユーザーを作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# ビルダーから必要なファイルをコピー
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# アップロードディレクトリを作成
RUN mkdir -p uploads && chown nodejs:nodejs uploads

# 非特権ユーザーに切り替え
USER nodejs

# ポートを公開
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# 本番サーバーを起動
CMD ["npm", "start"]
