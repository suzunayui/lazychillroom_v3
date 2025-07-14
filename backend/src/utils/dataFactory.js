const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

/**
 * ユーザーファクトリー
 */
const createUser = async (overrides = {}) => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password_hash: hashedPassword,
    avatar_url: faker.image.avatarGitHub(),
    status: faker.helpers.arrayElement(['online', 'away', 'busy', 'offline']),
    ...overrides
  };
};

/**
 * ギルドファクトリー
 */
const createGuild = (owner_id, overrides = {}) => {
  return {
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    owner_id,
    icon_url: faker.image.urlLoremFlickr({ width: 256, height: 256 }),
    member_count: faker.number.int({ min: 1, max: 100 }),
    is_personal_server: false,
    ...overrides
  };
};

/**
 * チャンネルファクトリー
 */
const createChannel = (guild_id, category_id = null, overrides = {}) => {
  const type = faker.helpers.arrayElement(['text', 'voice']);
  
  return {
    guild_id,
    category_id,
    name: type === 'text' ? faker.word.noun() : faker.word.adjective(),
    type,
    topic: type === 'text' ? faker.lorem.sentence() : null,
    position: faker.number.int({ min: 0, max: 10 }),
    nsfw: faker.datatype.boolean({ probability: 0.1 }),
    rate_limit_per_user: faker.helpers.arrayElement([0, 5, 10, 30, 60]),
    ...overrides
  };
};

/**
 * メッセージファクトリー
 */
const createMessage = (channel_id, user_id, overrides = {}) => {
  const type = faker.helpers.arrayElement(['text', 'text', 'text', 'image', 'file']); // text を多めに
  
  let content = faker.lorem.sentence();
  let file_url = null;
  let file_name = null;
  let file_size = null;

  if (type === 'image') {
    file_url = faker.image.urlLoremFlickr();
    file_name = `image_${faker.string.alphanumeric(8)}.jpg`;
    file_size = faker.number.int({ min: 50000, max: 2000000 });
    content = `画像を共有しました: ${file_name}`;
  } else if (type === 'file') {
    file_url = `https://example.com/files/${faker.string.alphanumeric(16)}`;
    file_name = `document_${faker.string.alphanumeric(8)}.pdf`;
    file_size = faker.number.int({ min: 100000, max: 5000000 });
    content = `ファイルを共有しました: ${file_name}`;
  }

  return {
    channel_id,
    user_id,
    content,
    type,
    file_url,
    file_name,
    file_size,
    reply_to_id: null,
    edited_at: null,
    ...overrides
  };
};

/**
 * 大量データ生成ファクトリー
 */
const generateBulkData = async (knex, options = {}) => {
  const {
    userCount = 50,
    guildCount = 5,
    channelsPerGuild = 10,
    messagesPerChannel = 20
  } = options;

  console.log('🏭 ファクトリーで大量データを生成中...');

  try {
    // 既存のファクトリー生成データを削除（基本データは保持）
    await knex.raw('DELETE FROM messages WHERE user_id > 10');
    await knex.raw('DELETE FROM channels WHERE guild_id IN (SELECT id FROM guilds WHERE id > 3)');
    await knex.raw('DELETE FROM channel_categories WHERE guild_id IN (SELECT id FROM guilds WHERE id > 3)');
    await knex.raw('DELETE FROM guild_members WHERE guild_id IN (SELECT id FROM guilds WHERE id > 3)');
    await knex.raw('DELETE FROM guilds WHERE id > 3');
    await knex.raw('DELETE FROM users WHERE id > 10');

    // 既存ユーザーの最大IDを取得
    const maxUserResult = await knex('users').max('id as max_id').first();
    const startUserId = (maxUserResult.max_id || 0) + 1;

    // ユーザー生成
    console.log(`👥 ${userCount}人のユーザーを生成中...`);
    const users = [];
    for (let i = 0; i < userCount; i++) {
      const user = await createUser();
      users.push(user);
    }
    const insertedUsers = await knex('users').insert(users).returning('id');

    // 既存ギルドの最大IDを取得
    const maxGuildResult = await knex('guilds').max('id as max_id').first();
    const startGuildId = (maxGuildResult.max_id || 0) + 1;

    // ギルド生成
    console.log(`🏰 ${guildCount}個のギルドを生成中...`);
    const guilds = [];
    for (let i = 0; i < guildCount; i++) {
      const ownerId = faker.helpers.arrayElement(insertedUsers).id;
      guilds.push(createGuild(ownerId));
    }
    const insertedGuilds = await knex('guilds').insert(guilds).returning('id');

    // 各ギルドにチャンネル生成
    console.log(`💬 ギルドあたり${channelsPerGuild}個のチャンネルを生成中...`);
    for (const guild of insertedGuilds) {
      // カテゴリ作成
      const categories = await knex('channel_categories').insert([
        { guild_id: guild.id, name: 'テキスト', position: 0 },
        { guild_id: guild.id, name: 'ボイス', position: 1 }
      ]).returning('id');

      // チャンネル作成
      const channels = [];
      for (let i = 0; i < channelsPerGuild; i++) {
        const categoryId = faker.helpers.arrayElement(categories).id;
        channels.push(createChannel(guild.id, categoryId));
      }
      const insertedChannels = await knex('channels').insert(channels).returning('id');

      // 各チャンネルにメッセージ生成
      for (const channel of insertedChannels) {
        const messages = [];
        for (let i = 0; i < messagesPerChannel; i++) {
          const userId = faker.helpers.arrayElement(insertedUsers).id;
          messages.push(createMessage(channel.id, userId));
        }
        await knex('messages').insert(messages);
      }
    }

    console.log('✅ ファクトリーデータ生成完了');
    console.log(`📊 生成されたデータ:`);
    console.log(`   - ユーザー: ${userCount}人`);
    console.log(`   - ギルド: ${guildCount}個`);
    console.log(`   - チャンネル: ${guildCount * channelsPerGuild}個`);
    console.log(`   - メッセージ: ${guildCount * channelsPerGuild * messagesPerChannel}件`);

  } catch (error) {
    console.error('❌ ファクトリーデータ生成エラー:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  createGuild,
  createChannel,
  createMessage,
  generateBulkData
};
