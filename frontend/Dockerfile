# ====================================
# LazyChillRoom v3 - Frontend Dockerfile (Production)
# ====================================

FROM docker.io/node:22-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール
RUN apk add --no-cache git

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# SvelteKitの準備とビルド
RUN npm run prepare && npm run build

# 本番用イメージ（軽量なNginx）
FROM docker.io/nginx:alpine AS production

# Nginxの設定をコピー
COPY nginx.conf /etc/nginx/nginx.conf

# ビルドされたファイルをコピー
COPY --from=builder /app/build /usr/share/nginx/html

# 非特権ユーザーでNginxを実行
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# 必要なディレクトリを作成
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# 非特権ユーザーに切り替え
USER nginx

# ポートを公開
EXPOSE 8080

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
