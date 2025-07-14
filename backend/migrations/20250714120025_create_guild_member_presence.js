/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('guild_member_presence', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.enum('status', ['online', 'away', 'busy', 'offline', 'invisible']).defaultTo('offline');
    table.timestamp('last_seen').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['guild_id', 'user_id']);
    
    // インデックス
    table.index('last_seen');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('guild_member_presence');
};
