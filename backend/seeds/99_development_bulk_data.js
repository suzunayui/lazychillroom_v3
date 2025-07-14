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

  try {
    await generateBulkData(knex, {
      userCount: 100,
      guildCount: 10,
      channelsPerGuild: 15,
      messagesPerChannel: 50
    });

    console.log('✅ 開発用大量データ生成完了');
  } catch (error) {
    console.error('❌ 開発用データ生成エラー:', error);
    throw error;
  }
};
