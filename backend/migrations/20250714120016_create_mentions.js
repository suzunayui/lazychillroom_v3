/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('mentions', function(table) {
    table.increments('id').primary();
    table.integer('message_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.enum('type', ['user', 'role', 'everyone', 'here']).defaultTo('user');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('message_id').references('id').inTable('messages').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // インデックス
    table.index(['user_id', 'created_at']);
    table.index('message_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('mentions');
};
