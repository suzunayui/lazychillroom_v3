/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('channel_categories', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.string('name', 100).notNullable();
    table.integer('position').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    
    // インデックス
    table.index(['guild_id', 'position']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('channel_categories');
};
