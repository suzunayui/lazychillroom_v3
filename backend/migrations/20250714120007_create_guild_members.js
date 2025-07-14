/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('guild_members', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.string('nickname', 100).nullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.boolean('is_owner').defaultTo(false);
    table.boolean('is_banned').defaultTo(false);
    table.timestamp('ban_expires_at').nullable();
    table.text('ban_reason').nullable();
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['guild_id', 'user_id']);
    
    // インデックス
    table.index('guild_id');
    table.index('user_id');
    table.index('is_owner');
    table.index('is_banned');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('guild_members');
};
