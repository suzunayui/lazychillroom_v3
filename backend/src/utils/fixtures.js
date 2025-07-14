/**
 * テスト用固定データ
 * 特定のテストシナリオで使用する予測可能なデータ
 */

const bcrypt = require('bcryptjs');

const fixtures = {
  // テスト用ユーザー
  users: [
    {
      id: 1000,
      username: 'test_user_1',
      email: 'test1@example.com',
      password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye1M5I7VWvKC8Z3lH1FgGr1Z7xf8D9z8e', // 'password'
      avatar_url: null,
      status: 'online'
    },
    {
      id: 1001,
      username: 'test_user_2',
      email: 'test2@example.com',
      password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye1M5I7VWvKC8Z3lH1FgGr1Z7xf8D9z8e',
      avatar_url: null,
      status: 'offline'
    }
  ],

  // テスト用ギルド
  guilds: [
    {
      id: 1000,
      name: 'Test Guild',
      description: 'Guild for testing',
      owner_id: 1000,
      member_count: 2,
      is_personal_server: false
    }
  ],

  // テスト用チャンネル
  channels: [
    {
      id: 1000,
      guild_id: 1000,
      category_id: null,
      name: 'test-channel',
      type: 'text',
      topic: 'Channel for testing',
      position: 0
    },
    {
      id: 1001,
      guild_id: null,
      category_id: null,
      name: null,
      type: 'dm',
      position: 0
    }
  ],

  // テスト用メッセージ
  messages: [
    {
      id: 1000,
      channel_id: 1000,
      user_id: 1000,
      content: 'Test message 1',
      type: 'text'
    },
    {
      id: 1001,
      channel_id: 1000,
      user_id: 1001,
      content: 'Test message 2',
      type: 'text',
      reply_to_id: 1000
    }
  ]
};

/**
 * テスト用データをデータベースに挿入
 */
const loadFixtures = async (knex, tables = []) => {
  console.log('🧪 テスト用Fixtureデータを読み込み中...');

  try {
    // 指定されたテーブルまたは全テーブルのFixtureを読み込み
    const tablesToLoad = tables.length > 0 ? tables : Object.keys(fixtures);

    for (const table of tablesToLoad) {
      if (fixtures[table] && fixtures[table].length > 0) {
        await knex(table).insert(fixtures[table]);
        console.log(`✅ ${table}: ${fixtures[table].length}件`);
      }
    }

    console.log('✅ Fixtureデータ読み込み完了');
  } catch (error) {
    console.error('❌ Fixtureデータ読み込みエラー:', error);
    throw error;
  }
};

/**
 * テスト用データをクリーンアップ
 */
const cleanupFixtures = async (knex, tables = []) => {
  console.log('🧹 テスト用Fixtureデータをクリーンアップ中...');

  try {
    const tablesToClean = tables.length > 0 ? tables : Object.keys(fixtures).reverse();

    for (const table of tablesToClean) {
      if (fixtures[table]) {
        const ids = fixtures[table].map(item => item.id);
        await knex(table).whereIn('id', ids).del();
        console.log(`🗑️ ${table}: ${ids.length}件削除`);
      }
    }

    console.log('✅ Fixtureデータクリーンアップ完了');
  } catch (error) {
    console.error('❌ Fixtureデータクリーンアップエラー:', error);
    throw error;
  }
};

module.exports = {
  fixtures,
  loadFixtures,
  cleanupFixtures
};
