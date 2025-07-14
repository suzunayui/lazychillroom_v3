/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('channels', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().nullable();
    table.integer('category_id').unsigned().nullable();
    table.string('name', 100).nullable();
    table.enum('type', ['text', 'voice', 'dm', 'group_dm', 'uploader_public', 'uploader_private']).defaultTo('text');
    table.text('topic').nullable();
    table.integer('position').defaultTo(0);
    table.boolean('nsfw').defaultTo(false);
    table.integer('rate_limit_per_user').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('category_id').references('id').inTable('channel_categories').onDelete('SET NULL');
    
    // インデックス
    table.index(['guild_id', 'position']);
    table.index('category_id');
    table.index('type');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('channels');
};
