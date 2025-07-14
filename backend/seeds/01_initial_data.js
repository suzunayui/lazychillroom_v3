const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // 既存データを削除
  await knex('files').del();
  await knex('messages').del();
  await knex('room_members').del();
  await knex('rooms').del();
  await knex('sessions').del();
  await knex('users').del();

  // パスワードハッシュを生成
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ユーザーデータを挿入
  const users = await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      email: 'admin@lazychillroom.com',
      password_hash: hashedPassword,
      display_name: '管理者',
      bio: 'LazyChillRoom の管理者です',
      status: 'online',
      is_active: true,
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      id: 2,
      username: 'alice',
      email: 'alice@example.com',
      password_hash: hashedPassword,
      display_name: 'Alice Johnson',
      bio: 'フロントエンドデベロッパー',
      status: 'online',
      is_active: true,
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      id: 3,
      username: 'bob',
      email: 'bob@example.com',
      password_hash: hashedPassword,
      display_name: 'Bob Smith',
      bio: 'バックエンドエンジニア',
      status: 'away',
      is_active: true,
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      id: 4,
      username: 'charlie',
      email: 'charlie@example.com',
      password_hash: hashedPassword,
      display_name: 'Charlie Brown',
      bio: 'DevOpsエンジニア',
      status: 'offline',
      is_active: true,
      email_verified: true,
      email_verified_at: knex.fn.now()
    }
  ]).returning('*');

  // ルームデータを挿入
  const rooms = await knex('rooms').insert([
    {
      id: 1,
      name: '一般チャット',
      slug: 'general',
      description: '雑談用のメインチャットルームです',
      type: 'public',
      created_by: 1,
      max_members: 100,
      is_active: true
    },
    {
      id: 2,
      name: '開発相談',
      slug: 'development',
      description: 'プログラミングや開発に関する相談ルーム',
      type: 'public',
      created_by: 1,
      max_members: 50,
      is_active: true
    },
    {
      id: 3,
      name: '管理者専用',
      slug: 'admin-only',
      description: '管理者限定のプライベートルーム',
      type: 'private',
      created_by: 1,
      max_members: 10,
      is_active: true
    }
  ]).returning('*');

  // ルームメンバーを挿入
  await knex('room_members').insert([
    // 一般チャット
    { room_id: 1, user_id: 1, role: 'owner' },
    { room_id: 1, user_id: 2, role: 'member' },
    { room_id: 1, user_id: 3, role: 'member' },
    { room_id: 1, user_id: 4, role: 'member' },
    
    // 開発相談
    { room_id: 2, user_id: 1, role: 'owner' },
    { room_id: 2, user_id: 2, role: 'admin' },
    { room_id: 2, user_id: 3, role: 'member' },
    
    // 管理者専用
    { room_id: 3, user_id: 1, role: 'owner' }
  ]);

  // サンプルメッセージを挿入
  await knex('messages').insert([
    {
      room_id: 1,
      user_id: 1,
      content: 'LazyChillRoom v3 へようこそ！🎉',
      type: 'text'
    },
    {
      room_id: 1,
      user_id: 2,
      content: 'こんにちは！新しいチャットアプリですね 😊',
      type: 'text'
    },
    {
      room_id: 1,
      user_id: 3,
      content: 'Socket.IO でリアルタイム通信ができるんですね！',
      type: 'text'
    },
    {
      room_id: 2,
      user_id: 2,
      content: 'Node.js と PostgreSQL の組み合わせについて質問があります',
      type: 'text'
    },
    {
      room_id: 2,
      user_id: 1,
      content: 'どんな質問でしょうか？お気軽にどうぞ！',
      type: 'text'
    }
  ]);

  console.log('🌱 シードデータの投入が完了しました');
};
