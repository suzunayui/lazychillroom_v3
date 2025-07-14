/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('channel_permissions', function(table) {
    table.increments('id').primary();
    table.integer('channel_id').unsigned().notNullable();
    table.enum('target_type', ['role', 'user']).notNullable();
    table.integer('target_id').unsigned().notNullable();
    table.bigInteger('allow_permissions').unsigned().defaultTo(0);
    table.bigInteger('deny_permissions').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['channel_id', 'target_type', 'target_id']);
    
    // インデックス
    table.index('channel_id');
    table.index(['target_type', 'target_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('channel_permissions');
};
