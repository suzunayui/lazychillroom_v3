/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('message_reads', function(table) {
    table.increments('id').primary();
    table.integer('channel_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('last_read_message_id').unsigned().notNullable();
    table.timestamp('read_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('last_read_message_id').references('id').inTable('messages').onDelete('CASCADE');
    
    // 複合ユニークキー（ユーザーはチャンネルごとに一つの既読状態）
    table.unique(['channel_id', 'user_id']);
    
    // インデックス
    table.index('user_id');
    table.index('last_read_message_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('message_reads');
};
