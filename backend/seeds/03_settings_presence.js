/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  console.log('⚙️ 設定・プレゼンスデータシードを実行中...');

  try {
    // ユーザー設定
    console.log('👤 ユーザー設定を作成中...');
    await knex('user_settings').insert([
      {
        user_id: 1,
        theme: 'dark',
        language: 'ja',
        status_message: 'システムユーザー',
        show_online_status: true,
        allow_dms: false,
        compact_mode: false
      },
      {
        user_id: 2,
        theme: 'dark',
        language: 'ja',
        status_message: '管理者です',
        show_online_status: true,
        allow_dms: true,
        compact_mode: false
      },
      {
        user_id: 3,
        theme: 'light',
        language: 'ja',
        status_message: 'よろしくお願いします！',
        show_online_status: true,
        allow_dms: true,
        compact_mode: true
      },
      {
        user_id: 4,
        theme: 'auto',
        language: 'ja',
        status_message: '今日も良い一日を 🌟',
        show_online_status: true,
        allow_dms: true,
        compact_mode: false
      },
      {
        user_id: 5,
        theme: 'dark',
        language: 'en',
        status_message: 'Learning Node.js!',
        show_online_status: false,
        allow_dms: true,
        compact_mode: true
      }
    ]);

    // 通知設定
    console.log('🔔 通知設定を作成中...');
    await knex('notification_settings').insert([
      { user_id: 1, guild_id: 1, notification_type: 'mentions', sound_enabled: false, push_enabled: false },
      { user_id: 2, guild_id: 1, notification_type: 'all', sound_enabled: true, push_enabled: true },
      { user_id: 3, guild_id: 1, notification_type: 'all', sound_enabled: true, push_enabled: true },
      { user_id: 4, guild_id: 1, notification_type: 'mentions', sound_enabled: false, push_enabled: true },
      { user_id: 5, guild_id: 1, notification_type: 'all', sound_enabled: true, push_enabled: false }
    ]);

    // ユーザープレゼンス
    console.log('👁️ ユーザープレゼンスを作成中...');
    await knex('user_presence').insert([
      { user_id: 1, status: 'online' },
      { user_id: 2, status: 'online' },
      { user_id: 3, status: 'online' },
      { user_id: 4, status: 'away' },
      { user_id: 5, status: 'busy' }
    ]);

    // ギルドメンバープレゼンス
    console.log('🏰 ギルドメンバープレゼンスを作成中...');
    await knex('guild_member_presence').insert([
      { guild_id: 1, user_id: 1, status: 'online' },
      { guild_id: 1, user_id: 2, status: 'online' },
      { guild_id: 1, user_id: 3, status: 'online' },
      { guild_id: 1, user_id: 4, status: 'away' },
      { guild_id: 1, user_id: 5, status: 'busy' },
      { guild_id: 2, user_id: 2, status: 'online' },
      { guild_id: 2, user_id: 3, status: 'online' }
    ]);

    // 招待リンク
    console.log('🔗 招待リンクを作成中...');
    await knex('invites').insert([
      {
        code: 'welcome123',
        guild_id: 1,
        channel_id: 1,
        inviter_id: 2,
        max_uses: 0,
        uses: 3,
        max_age: 0,
        temporary: false
      },
      {
        code: 'testdev01',
        guild_id: 2,
        channel_id: null,
        inviter_id: 2,
        max_uses: 10,
        uses: 1,
        max_age: 604800, // 1週間
        temporary: false
      }
    ]);

    // 既読管理
    console.log('👀 既読データを作成中...');
    await knex('message_reads').insert([
      { channel_id: 1, user_id: 2, last_read_message_id: 5 },
      { channel_id: 1, user_id: 3, last_read_message_id: 5 },
      { channel_id: 1, user_id: 4, last_read_message_id: 4 },
      { channel_id: 2, user_id: 3, last_read_message_id: 7 },
      { channel_id: 2, user_id: 5, last_read_message_id: 6 },
      { channel_id: 5, user_id: 3, last_read_message_id: 10 },
      { channel_id: 5, user_id: 4, last_read_message_id: 10 }
    ]);

    console.log('✅ 設定・プレゼンスデータシード完了');
  } catch (error) {
    console.error('❌ 設定・プレゼンスデータシードエラー:', error);
    throw error;
  }
};
