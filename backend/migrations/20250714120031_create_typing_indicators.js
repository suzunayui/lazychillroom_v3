/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('typing_indicators', function(table) {
    table.increments('id').primary();
    table.integer('channel_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    
    // 外部キー
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー（ユーザーは同じチャンネルで一つの入力状態のみ）
    table.unique(['channel_id', 'user_id']);
    
    // インデックス
    table.index('expires_at');
    table.index('channel_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('typing_indicators');
};
