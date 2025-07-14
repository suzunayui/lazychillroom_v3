// src/scripts/init-db.js
require('dotenv').config();
const { testConnection, runMigrations, runSeeds, closeConnection } = require('../config/database');

async function initializeDatabase() {
  console.log('🚀 データベース初期化を開始...');
  console.log('');

  try {
    // 1. データベース接続テスト
    console.log('1️⃣ データベース接続をテスト中...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('データベースに接続できません');
    }
    console.log('');

    // 2. マイグレーション実行
    console.log('2️⃣ マイグレーションを実行中...');
    const migrationSuccess = await runMigrations();
    if (!migrationSuccess) {
      throw new Error('マイグレーションに失敗しました');
    }
    console.log('');

    // 3. シードデータ投入
    console.log('3️⃣ シードデータを投入中...');
    const seedSuccess = await runSeeds();
    if (!seedSuccess) {
      throw new Error('シードデータの投入に失敗しました');
    }
    console.log('');

    console.log('✅ データベース初期化が完了しました！');
    console.log('');
    console.log('🎯 次のステップ:');
    console.log('  1. npm run dev でサーバーを起動');
    console.log('  2. http://localhost:5000/health で動作確認');
    console.log('  3. フロントエンドの設定');

  } catch (error) {
    console.error('❌ データベース初期化エラー:', error.message);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
