/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('voice_states', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('guild_id').unsigned().nullable();
    table.integer('channel_id').unsigned().nullable();
    table.string('session_id', 32).notNullable();
    table.boolean('deaf').defaultTo(false);
    table.boolean('mute').defaultTo(false);
    table.boolean('self_deaf').defaultTo(false);
    table.boolean('self_mute').defaultTo(false);
    table.boolean('suppress').defaultTo(false);
    table.timestamp('connected_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('channel_id').references('id').inTable('channels').onDelete('SET NULL');
    
    // ユニークキー（ユーザーは一度に一つのボイスチャンネルのみ）
    table.unique('user_id');
    
    // インデックス
    table.index('channel_id');
    table.index('guild_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('voice_states');
};
