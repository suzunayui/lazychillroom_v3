# LazyChillRoom v3 - チャットアプリケーション

## 🚀 プロジェクト概要

リアルタイムチャット機能を持つモダンな Web アプリケーション

### ✨ 主要機能

- 🔐 **ユーザー認証** - JWT ベースの安全な認証システム
- 💬 **リアルタイムチャット** - Socket.IO による即座のメッセージング
- 🏠 **チャットルーム** - 複数ルームでの並行チャット
- 📁 **ファイル共有** - 画像・ドキュメントの簡単共有
- 📱 **レスポンシブデザイン** - モバイル・デスクトップ対応
- 🌙 **ダークモード** - 目に優しいテーマ切り替え

## 🛠️ 技術スタック

### バックエンド
- **Node.js v22 LTS** - サーバーサイド JavaScript 実行環境
- **Express.js** - 軽量 Web アプリケーションフレームワーク
- **Socket.IO** - リアルタイム双方向通信
- **PostgreSQL v15** - リレーショナルデータベース
- **Redis v7** - セッション管理・キャッシュ

### フロントエンド
- **Svelte** - 軽量・高速 JavaScript フレームワーク
- **TypeScript** - 型安全な JavaScript 拡張
- **TailwindCSS** - ユーティリティファースト CSS
- **Vite** - 高速ビルドツール

### 開発・運用環境
- **WSL2 + Ubuntu 24.04** - Linux 開発環境
- **Podman** - コンテナ化ツール
- **VS Code** - 統合開発環境

## 📁 プロジェクト構造

```
lazychillroom_v3/
├── docs/                    # 📚 ドキュメント
│   ├── SETUP.md            # 開発環境セットアップ
│   └── PODMAN.md           # コンテナ環境ガイド
├── backend/                 # 🖥️ バックエンド
│   ├── src/
│   │   ├── controllers/    # API コントローラー
│   │   ├── models/         # データモデル
│   │   ├── routes/         # ルーティング
│   │   ├── middleware/     # ミドルウェア
│   │   ├── services/       # ビジネスロジック
│   │   ├── utils/          # ユーティリティ
│   │   └── config/         # 設定ファイル
│   ├── tests/              # テストファイル
│   ├── package.json
│   └── Dockerfile
├── frontend/               # 🎨 フロントエンド
│   ├── src/
│   │   ├── components/     # Svelte コンポーネント
│   │   ├── stores/         # 状態管理
│   │   ├── services/       # API サービス
│   │   ├── utils/          # ユーティリティ
│   │   └── types/          # TypeScript 型定義
│   ├── tests/              # テストファイル
│   ├── package.json
│   └── Dockerfile
├── podman-compose.yml      # 🐳 コンテナ設定
└── README.md
```

## 🚀 クイックスタート

### 前提条件
- WSL2 + Ubuntu 24.04
- Node.js v22 LTS
- PostgreSQL v15
- Redis v7

### 1. プロジェクトのクローン
```bash
git clone https://github.com/suzunayui/lazychillroom_v3.git
cd lazychillroom_v3
```

### 2. 依存関係のインストール
```bash
# バックエンド
cd backend && npm install

# フロントエンド  
cd ../frontend && npm install
```

### 3. 環境変数の設定
```bash
# バックエンド
cp backend/.env.example backend/.env
# フロントエンド
cp frontend/.env.example frontend/.env
```

### 4. データベースのセットアップ
```bash
# PostgreSQL にユーザーとデータベースを作成
sudo -u postgres psql
CREATE USER lazychillroom_user WITH PASSWORD 'secure_password';
CREATE DATABASE lazychillroom_dev OWNER lazychillroom_user;
GRANT ALL PRIVILEGES ON DATABASE lazychillroom_dev TO lazychillroom_user;
\q
```

### 5. 開発サーバーの起動
```bash
# ターミナル1: バックエンド
cd backend && npm run dev

# ターミナル2: フロントエンド
cd frontend && npm run dev
```

🎉 **完了！** ブラウザで http://localhost:3000 にアクセス

## 📖 詳細ドキュメント

| ドキュメント | 説明 | 構成 |
|-------------|------|------|
| [SETUP.md](docs/SETUP.md) | 開発環境セットアップガイド | 単一ファイル |
| [PODMAN.md](docs/PODMAN.md) | コンテナ環境の構築・運用 | 単一ファイル |
| [DATABASE.md](docs/DATABASE.md) | データベース設計・マイグレーション | [4分割構成](docs/database/) |
| [SECURITY.md](docs/SECURITY.md) | セキュリティ要件・対策 | 単一ファイル |
| [ERROR_HANDLING.md](docs/ERROR_HANDLING.md) | エラーハンドリング・ログ戦略 | [4分割構成](docs/error_handling/) |
| [TESTING.md](docs/TESTING.md) | テスト戦略・実装ガイド | [5分割構成](docs/testing/) |

### 📁 分割ドキュメント構成

#### データベース関連 (4ファイル)
- `database/DATABASE_OVERVIEW.md` - 設計概要・ER図
- `database/DATABASE_TABLES.md` - テーブル設計詳細  
- `database/DATABASE_MIGRATIONS.md` - マイグレーション戦略
- `database/DATABASE_FUNCTIONS.md` - 関数・トリガー・ビュー

#### エラーハンドリング関連 (4ファイル) 
- `error_handling/ERROR_HANDLING_OVERVIEW.md` - 基本方針・概要
- `error_handling/ERROR_HANDLING_BACKEND.md` - バックエンド詳細
- `error_handling/ERROR_HANDLING_FRONTEND.md` - フロントエンド詳細
- `error_handling/LOGGING_STRATEGY.md` - ログ戦略・監視

#### テスト関連 (5ファイル)
- `testing/TESTING_OVERVIEW.md` - テスト戦略概要
- `testing/TESTING_BACKEND.md` - バックエンドテスト
- `testing/TESTING_FRONTEND.md` - フロントエンドテスト  
- `testing/TESTING_E2E.md` - E2E・統合テスト
- `testing/TESTING_CI_CD.md` - CI/CD・自動化

## 📋 開発フェーズ

- [x] **Phase 1**: 基盤構築（プロジェクト初期化、環境設定）
- [ ] **Phase 2**: 認証システム（JWT認証、ユーザー管理）
- [ ] **Phase 3**: チャット機能（リアルタイム通信、UI実装）
- [ ] **Phase 4**: 高度な機能（ファイル共有、検索、通知）
- [ ] **Phase 5**: デプロイ・運用（コンテナ化、監視）

## 🎯 機能要件

### 基本機能 ✅
- [ ] ユーザー登録・ログイン
- [ ] チャットルーム作成・参加
- [ ] リアルタイムメッセージ送受信
- [ ] メッセージ履歴表示
- [ ] オンラインユーザー表示

### 拡張機能 🚀
- [ ] プライベートメッセージ
- [ ] ファイル共有
- [ ] 絵文字・スタンプ
- [ ] メッセージ検索
- [ ] プッシュ通知
- [ ] ダークモード
- [ ] モバイル対応

## 🔒 セキュリティ対策

- 🛡️ **認証**: JWT + リフレッシュトークン
- 🔐 **通信**: HTTPS/WSS 暗号化
- 🚫 **攻撃対策**: XSS, CSRF, SQLインジェクション
- ⚡ **レート制限**: API・WebSocket 制限
- 📊 **監視**: アクセスログ・セキュリティログ

## ⚡ パフォーマンス目標

| 項目 | 目標値 |
|------|--------|
| 同時接続ユーザー数 | 1,000人以上 |
| メッセージ送信遅延 | 100ms以下 |
| ページ読み込み時間 | 3秒以下 |
| データベースレスポンス | 50ms以下 |

## 🧪 テスト戦略

- **単体テスト**: Jest (目標カバレッジ90%)
- **統合テスト**: Supertest (目標カバレッジ70%)
- **E2Eテスト**: Playwright (主要フロー100%)
- **パフォーマンステスト**: K6

## 🤝 コントリビューション

1. フォークしてください
2. フィーチャーブランチを作成してください (`git checkout -b feature/amazing-feature`)
3. 変更をコミットしてください (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュしてください (`git push origin feature/amazing-feature`)
5. プルリクエストを開いてください

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 📞 サポート

- 🐛 **バグ報告**: [Issues](https://github.com/suzunayui/lazychillroom_v3/issues)
- 💡 **機能要望**: [Discussions](https://github.com/suzunayui/lazychillroom_v3/discussions)
- 📧 **その他**: [メール](mailto:support@lazychillroom.com)

---

**作成日**: 2025年7月13日  
**最終更新**: 2025年7月14日  
**バージョン**: 2.0
```
