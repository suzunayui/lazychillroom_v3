/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('message_threads', function(table) {
    table.increments('id').primary();
    table.integer('parent_message_id').unsigned().notNullable();
    table.integer('channel_id').unsigned().notNullable();
    table.string('title', 100).nullable();
    table.boolean('is_archived').defaultTo(false);
    table.timestamp('last_message_at').defaultTo(knex.fn.now());
    table.integer('message_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('parent_message_id').references('id').inTable('messages').onDelete('CASCADE');
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    
    // ユニークキー（親メッセージに対して一つのスレッド）
    table.unique('parent_message_id');
    
    // インデックス
    table.index('channel_id');
    table.index('last_message_at');
    table.index('is_archived');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('message_threads');
};
