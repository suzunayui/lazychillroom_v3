// src/config/database.js
const knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Knexインスタンスの作成
const db = knex(config);

/**
 * データベース接続をテストする関数
 */
async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ データベース接続成功');
    return true;
  } catch (error) {
    console.error('❌ データベース接続エラー:', error.message);
    return false;
  }
}

/**
 * データベース接続を閉じる関数
 */
async function closeConnection() {
  await db.destroy();
  console.log('🔌 データベース接続を閉じました');
}

/**
 * マイグレーションを実行する関数
 */
async function runMigrations() {
  try {
    await db.migrate.latest();
    console.log('📊 マイグレーション完了');
    return true;
  } catch (error) {
    console.error('❌ マイグレーションエラー:', error.message);
    return false;
  }
}

/**
 * シードデータを投入する関数
 */
async function runSeeds() {
  try {
    await db.seed.run();
    console.log('🌱 シードデータ投入完了');
    return true;
  } catch (error) {
    console.error('❌ シードデータエラー:', error.message);
    return false;
  }
}

module.exports = {
  db,
  testConnection,
  closeConnection,
  runMigrations,
  runSeeds
};
