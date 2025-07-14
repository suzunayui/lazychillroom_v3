/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('invites', function(table) {
    table.increments('id').primary();
    table.string('code', 10).notNullable().unique();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('channel_id').unsigned().nullable();
    table.integer('inviter_id').unsigned().notNullable();
    table.integer('max_uses').defaultTo(0);
    table.integer('uses').defaultTo(0);
    table.integer('max_age').defaultTo(0);
    table.boolean('temporary').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').nullable();
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('channel_id').references('id').inTable('channels').onDelete('SET NULL');
    table.foreign('inviter_id').references('id').inTable('users').onDelete('CASCADE');
    
    // インデックス
    table.index('code');
    table.index('guild_id');
    table.index('expires_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('invites');
};
