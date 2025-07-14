/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('guild_bans', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('banned_by').unsigned().notNullable();
    table.text('reason').nullable();
    table.integer('delete_message_days').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').nullable();
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('banned_by').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['guild_id', 'user_id']);
    
    // インデックス
    table.index('guild_id');
    table.index('user_id');
    table.index('expires_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('guild_bans');
};
