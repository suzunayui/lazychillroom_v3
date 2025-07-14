const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  console.log('🌱 基本データシードを実行中...');

  // 外部キー制約を一時的に無効にする（PostgreSQL）
  await knex.raw('SET CONSTRAINTS ALL DEFERRED');

  try {
    // 既存データを削除（依存関係を考慮した順序）
    console.log('📋 既存データを削除中...');
    
    const tablesToClear = [
      'message_reads', 'typing_indicators', 'user_blocks', 'message_threads',
      'user_sessions_detailed', 'webhooks', 'voice_states', 'guild_member_presence',
      'user_presence', 'public_files', 'pinned_messages', 'notification_settings',
      'user_settings', 'audit_logs', 'guild_bans', 'invites', 'mentions',
      'channel_permissions', 'message_edit_history', 'user_sessions',
      'file_attachments', 'message_reactions', 'emojis', 'friends',
      'member_roles', 'guild_members', 'messages', 'dm_participants',
      'channels', 'channel_categories', 'roles', 'guilds', 'users'
    ];

    for (const table of tablesToClear) {
      await knex(table).del();
    }

    // 1. ユーザーデータ
    console.log('👥 ユーザーデータを作成中...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await knex('users').insert([
      {
        id: 1,
        username: 'system',
        email: 'system@lazychillroom.com',
        password_hash: hashedPassword,
        avatar_url: null,
        status: 'online'
      },
      {
        id: 2,
        username: 'admin',
        email: 'admin@lazychillroom.com',
        password_hash: hashedPassword,
        avatar_url: 'https://picsum.photos/128/128?random=1',
        status: 'online'
      },
      {
        id: 3,
        username: 'alice',
        email: 'alice@example.com',
        password_hash: hashedPassword,
        avatar_url: 'https://picsum.photos/128/128?random=2',
        status: 'online'
      },
      {
        id: 4,
        username: 'bob',
        email: 'bob@example.com',
        password_hash: hashedPassword,
        avatar_url: 'https://picsum.photos/128/128?random=3',
        status: 'away'
      },
      {
        id: 5,
        username: 'charlie',
        email: 'charlie@example.com',
        password_hash: hashedPassword,
        avatar_url: 'https://picsum.photos/128/128?random=4',
        status: 'busy'
      }
    ]).returning('id');

    // 2. ギルド（サーバー）データ
    console.log('🏰 ギルドデータを作成中...');
    await knex('guilds').insert([
      {
        id: 1,
        name: 'LazyChillRoom',
        description: 'メインサーバー - みんなで楽しくチャットしよう！',
        owner_id: 2,
        icon_url: 'https://picsum.photos/256/256?random=10',
        member_count: 5,
        is_personal_server: false
      },
      {
        id: 2,
        name: 'テスト開発サーバー',
        description: '開発用のテストサーバーです',
        owner_id: 2,
        icon_url: 'https://picsum.photos/256/256?random=11',
        member_count: 2,
        is_personal_server: false
      }
    ]);

    // 3. ロールデータ
    console.log('👑 ロールデータを作成中...');
    await knex('roles').insert([
      {
        id: 1,
        guild_id: 1,
        name: '@everyone',
        color: '#99aab5',
        permissions: 1049600,
        position: 0,
        is_default: true
      },
      {
        id: 2,
        guild_id: 1,
        name: 'Admin',
        color: '#f04747',
        permissions: 2147483647,
        position: 10,
        hoist: true,
        mentionable: true
      },
      {
        id: 3,
        guild_id: 1,
        name: 'Moderator',
        color: '#5865f2',
        permissions: 268697600,
        position: 5,
        hoist: true,
        mentionable: true
      },
      {
        id: 4,
        guild_id: 1,
        name: 'Member',
        color: '#57f287',
        permissions: 1081344,
        position: 1
      }
    ]);

    // 4. チャンネルカテゴリ
    console.log('📁 チャンネルカテゴリを作成中...');
    await knex('channel_categories').insert([
      {
        id: 1,
        guild_id: 1,
        name: 'テキストチャンネル',
        position: 0
      },
      {
        id: 2,
        guild_id: 1,
        name: 'ボイスチャンネル',
        position: 1
      }
    ]);

    // 5. チャンネルデータ
    console.log('💬 チャンネルデータを作成中...');
    await knex('channels').insert([
      {
        id: 1,
        guild_id: 1,
        category_id: 1,
        name: '一般',
        type: 'text',
        topic: 'みんなで雑談しよう！',
        position: 0
      },
      {
        id: 2,
        guild_id: 1,
        category_id: 1,
        name: '質問',
        type: 'text',
        topic: '分からないことがあったら聞いてみよう',
        position: 1
      },
      {
        id: 3,
        guild_id: 1,
        category_id: 1,
        name: '技術',
        type: 'text',
        topic: 'プログラミングや技術の話題',
        position: 2
      },
      {
        id: 4,
        guild_id: 1,
        category_id: 2,
        name: 'General',
        type: 'voice',
        position: 0
      },
      {
        id: 5,
        guild_id: null,
        category_id: null,
        name: null,
        type: 'dm',
        position: 0
      }
    ]);

    console.log('✅ 基本データシード完了');
  } catch (error) {
    console.error('❌ シードエラー:', error);
    throw error;
  }
};
