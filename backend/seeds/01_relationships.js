/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  console.log('🤝 関係データシードを実行中...');

  try {
    // ギルドメンバーシップ
    console.log('👥 ギルドメンバーシップを作成中...');
    await knex('guild_members').insert([
      { id: 1, guild_id: 1, user_id: 1, nickname: null },
      { id: 2, guild_id: 1, user_id: 2, nickname: 'Administrator' },
      { id: 3, guild_id: 1, user_id: 3, nickname: null },
      { id: 4, guild_id: 1, user_id: 4, nickname: 'ボブちゃん' },
      { id: 5, guild_id: 1, user_id: 5, nickname: null },
      { id: 6, guild_id: 2, user_id: 2, nickname: null },
      { id: 7, guild_id: 2, user_id: 3, nickname: 'Developer' }
    ]);

    // メンバーロール割り当て
    console.log('👑 ロール割り当てを作成中...');
    await knex('member_roles').insert([
      // 全員に@everyoneロール
      { guild_id: 1, user_id: 1, role_id: 1 },
      { guild_id: 1, user_id: 2, role_id: 1 },
      { guild_id: 1, user_id: 3, role_id: 1 },
      { guild_id: 1, user_id: 4, role_id: 1 },
      { guild_id: 1, user_id: 5, role_id: 1 },
      // 管理者ロール
      { guild_id: 1, user_id: 2, role_id: 2 },
      // モデレーターロール
      { guild_id: 1, user_id: 3, role_id: 3 },
      // メンバーロール
      { guild_id: 1, user_id: 4, role_id: 4 },
      { guild_id: 1, user_id: 5, role_id: 4 }
    ]);

    // フレンド関係
    console.log('👫 フレンド関係を作成中...');
    await knex('friends').insert([
      { user_id: 2, friend_id: 3, status: 'accepted' },
      { user_id: 3, friend_id: 2, status: 'accepted' },
      { user_id: 3, friend_id: 4, status: 'accepted' },
      { user_id: 4, friend_id: 3, status: 'accepted' },
      { user_id: 4, friend_id: 5, status: 'pending' },
      { user_id: 5, friend_id: 4, status: 'pending' }
    ]);

    // DMチャンネル参加者
    console.log('💬 DM参加者を作成中...');
    await knex('dm_participants').insert([
      { channel_id: 5, user_id: 3 },
      { channel_id: 5, user_id: 4 }
    ]);

    console.log('✅ 関係データシード完了');
  } catch (error) {
    console.error('❌ 関係データシードエラー:', error);
    throw error;
  }
};
