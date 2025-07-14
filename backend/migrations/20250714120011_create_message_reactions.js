/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('message_reactions', function(table) {
    table.increments('id').primary();
    table.integer('message_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('emoji_id').unsigned().nullable();
    table.string('unicode_emoji', 10).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('message_id').references('id').inTable('messages').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('emoji_id').references('id').inTable('emojis').onDelete('CASCADE');
    
    // 複合ユニークキー（同じユーザーが同じメッセージに同じ絵文字で複数回リアクションできない）
    table.unique(['message_id', 'user_id', 'emoji_id', 'unicode_emoji']);
    
    // インデックス
    table.index('message_id');
    table.index('user_id');
    table.index('emoji_id');
    
    // チェック制約（emoji_idかunicode_emojiのどちらか一つは必須）
    table.check('(emoji_id IS NOT NULL AND unicode_emoji IS NULL) OR (emoji_id IS NULL AND unicode_emoji IS NOT NULL)');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('message_reactions');
};
