/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_sessions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('session_token', 255).notNullable().unique();
    table.string('refresh_token', 255).notNullable().unique();
    table.string('device_info', 255).nullable();
    table.string('ip_address', 45).nullable(); // IPv6対応
    table.string('user_agent', 500).nullable();
    table.timestamp('last_activity').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // インデックス
    table.index('user_id');
    table.index('session_token');
    table.index('refresh_token');
    table.index('expires_at');
    table.index('last_activity');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_sessions');
};
