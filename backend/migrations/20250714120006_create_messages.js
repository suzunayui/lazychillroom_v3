/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id').primary();
    table.integer('channel_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.text('content').notNullable();
    table.enum('type', ['text', 'image', 'file', 'system']).defaultTo('text');
    table.string('file_url', 255).nullable();
    table.string('file_name', 255).nullable();
    table.integer('file_size').nullable();
    table.integer('reply_to_id').unsigned().nullable();
    table.timestamp('edited_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('reply_to_id').references('id').inTable('messages').onDelete('SET NULL');
    
    // インデックス
    table.index(['channel_id', 'created_at']);
    table.index('user_id');
    table.index('reply_to_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
