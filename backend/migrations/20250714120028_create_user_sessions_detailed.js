/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_sessions_detailed', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('session_token', 255).notNullable().unique();
    table.string('device_name', 100).nullable();
    table.string('ip_address', 45).nullable(); // IPv6対応
    table.text('user_agent').nullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_activity').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // インデックス
    table.index('expires_at');
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_sessions_detailed');
};
