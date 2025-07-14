/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  console.log('💬 メッセージデータシードを実行中...');

  try {
    // メッセージデータ
    console.log('📝 メッセージを作成中...');
    const messages = await knex('messages').insert([
      {
        id: 1,
        channel_id: 1,
        user_id: 1,
        content: 'LazyChillRoomへようこそ！みんなで楽しくチャットしましょう 🎉',
        type: 'system'
      },
      {
        id: 2,
        channel_id: 1,
        user_id: 2,
        content: 'こんにちは！管理者のAdminです。何か質問があればお気軽にどうぞ！',
        type: 'text'
      },
      {
        id: 3,
        channel_id: 1,
        user_id: 3,
        content: 'よろしくお願いします！Aliceです 😊',
        type: 'text'
      },
      {
        id: 4,
        channel_id: 1,
        user_id: 4,
        content: 'こんにちは〜！Bobです。今日は良い天気ですね ☀️',
        type: 'text'
      },
      {
        id: 5,
        channel_id: 1,
        user_id: 3,
        reply_to_id: 4,
        content: 'そうですね！散歩日和です 🚶‍♀️',
        type: 'text'
      },
      {
        id: 6,
        channel_id: 2,
        user_id: 5,
        content: 'Node.jsでWebSocketを使う時のベストプラクティスって何ですか？',
        type: 'text'
      },
      {
        id: 7,
        channel_id: 2,
        user_id: 3,
        reply_to_id: 6,
        content: 'Socket.IOがおすすめです！リアルタイム通信が簡単に実装できますよ 👍',
        type: 'text'
      },
      {
        id: 8,
        channel_id: 3,
        user_id: 2,
        content: '新しいプロジェクトでTypeScript + Express.js + PostgreSQLの構成で開発中です',
        type: 'text'
      },
      {
        id: 9,
        channel_id: 5,
        user_id: 3,
        content: 'DMのテストメッセージです',
        type: 'text'
      },
      {
        id: 10,
        channel_id: 5,
        user_id: 4,
        content: 'DMでの返信です！',
        type: 'text'
      }
    ]).returning('id');

    // 絵文字データ
    console.log('😀 絵文字を作成中...');
    await knex('emojis').insert([
      { id: 1, guild_id: null, name: '👍', emoji_unicode: '👍' },
      { id: 2, guild_id: null, name: '❤️', emoji_unicode: '❤️' },
      { id: 3, guild_id: null, name: '😂', emoji_unicode: '😂' },
      { id: 4, guild_id: null, name: '😮', emoji_unicode: '😮' },
      { id: 5, guild_id: null, name: '😢', emoji_unicode: '😢' },
      { id: 6, guild_id: 1, name: 'custom_emoji', image_url: 'https://picsum.photos/32/32?random=100', created_by: 2 }
    ]);

    // メッセージリアクション
    console.log('👍 リアクションを作成中...');
    await knex('message_reactions').insert([
      { message_id: 2, user_id: 3, emoji_id: 1 },
      { message_id: 2, user_id: 4, emoji_id: 2 },
      { message_id: 3, user_id: 2, emoji_id: 1 },
      { message_id: 3, user_id: 4, emoji_id: 3 },
      { message_id: 7, user_id: 5, emoji_id: 1 },
      { message_id: 8, user_id: 3, emoji_id: 4 }
    ]);

    // メンション
    console.log('📢 メンションを作成中...');
    await knex('mentions').insert([
      { message_id: 6, user_id: 2, type: 'user' },
      { message_id: 6, user_id: 3, type: 'user' }
    ]);

    // ピン留めメッセージ
    console.log('📌 ピン留めメッセージを作成中...');
    await knex('pinned_messages').insert([
      { message_id: 1, channel_id: 1, pinned_by: 2 }
    ]);

    console.log('✅ メッセージデータシード完了');
  } catch (error) {
    console.error('❌ メッセージデータシードエラー:', error);
    throw error;
  }
};
