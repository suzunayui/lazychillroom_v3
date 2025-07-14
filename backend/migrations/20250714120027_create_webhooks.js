/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('webhooks', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('channel_id').unsigned().notNullable();
    table.string('name', 80).notNullable();
    table.string('avatar_url', 255).nullable();
    table.string('token', 68).notNullable().unique();
    table.integer('created_by').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    
    // インデックス
    table.index('channel_id');
    table.index('token');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('webhooks');
};
