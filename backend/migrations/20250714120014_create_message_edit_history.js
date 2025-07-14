/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('message_edit_history', function(table) {
    table.increments('id').primary();
    table.integer('message_id').unsigned().notNullable();
    table.text('old_content').notNullable();
    table.text('new_content').notNullable();
    table.timestamp('edited_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('message_id').references('id').inTable('messages').onDelete('CASCADE');
    
    // インデックス
    table.index(['message_id', 'edited_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('message_edit_history');
};
