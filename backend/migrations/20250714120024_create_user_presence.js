/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_presence', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.enum('status', ['online', 'away', 'busy', 'offline', 'invisible']).defaultTo('offline');
    table.timestamp('last_seen').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // ユニークキー
    table.unique('user_id');
    
    // インデックス
    table.index('last_seen');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_presence');
};
