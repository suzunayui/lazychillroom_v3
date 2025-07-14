/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pinned_messages', function(table) {
    table.increments('id').primary();
    table.integer('message_id').unsigned().notNullable();
    table.integer('channel_id').unsigned().notNullable();
    table.integer('pinned_by').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('message_id').references('id').inTable('messages').onDelete('CASCADE');
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    table.foreign('pinned_by').references('id').inTable('users').onDelete('CASCADE');
    
    // ユニークキー（同じメッセージは一度だけピン留め可能）
    table.unique('message_id');
    
    // インデックス
    table.index('message_id');
    table.index('channel_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('pinned_messages');
};
