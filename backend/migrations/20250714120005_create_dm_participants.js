/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('dm_participants', function(table) {
    table.increments('id').primary();
    table.integer('channel_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['channel_id', 'user_id']);
    
    // インデックス
    table.index('channel_id');
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('dm_participants');
};
