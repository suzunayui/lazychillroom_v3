const { generateBulkData } = require('../src/utils/dataFactory');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // 開発環境でのみ実行
  if (process.env.NODE_ENV !== 'development') {
    console.log('⚠️ 開発環境以外では大量データは生成されません');
    return;
  }

  console.log('🚀 開発用大量データを生成中...');
  
  // 一時的に無効化 - 基本データのみでテスト
  console.log('⚠️ 開発用大量データ生成は一時的に無効化されています');
  console.log('💡 基本データのみを使用してテストしてください');
  return;

  try {
    await generateBulkData(knex, {
      userCount: 20,
      guildCount: 3,
      channelsPerGuild: 5,
      messagesPerChannel: 10
    });

    console.log('✅ 開発用大量データ生成完了');
  } catch (error) {
    console.error('❌ 開発用データ生成エラー:', error);
    throw error;
  }
};
