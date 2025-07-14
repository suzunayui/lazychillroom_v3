/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('notification_settings', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('guild_id').unsigned().nullable();
    table.integer('channel_id').unsigned().nullable();
    table.enum('notification_type', ['all', 'mentions', 'none']).defaultTo('all');
    table.boolean('sound_enabled').defaultTo(true);
    table.boolean('push_enabled').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('channel_id').references('id').inTable('channels').onDelete('CASCADE');
    
    // インデックス
    table.index('guild_id');
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('notification_settings');
};
