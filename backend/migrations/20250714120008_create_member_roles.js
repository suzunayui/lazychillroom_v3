/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('member_roles', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('role_id').unsigned().notNullable();
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['guild_id', 'user_id', 'role_id']);
    
    // インデックス
    table.index(['guild_id', 'user_id']);
    table.index('role_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('member_roles');
};
