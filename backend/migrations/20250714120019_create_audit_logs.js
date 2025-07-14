/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.integer('user_id').unsigned().nullable();
    table.integer('target_id').unsigned().nullable();
    table.enum('action_type', [
      'guild_update', 'channel_create', 'channel_update', 'channel_delete',
      'emoji_create', 'emoji_update', 'emoji_delete', 'member_ban', 'member_unban',
      'member_kick', 'member_role_update', 'message_delete', 'message_bulk_delete'
    ]).notNullable();
    table.text('reason').nullable();
    table.json('changes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');
    
    // インデックス
    table.index(['guild_id', 'created_at']);
    table.index('user_id');
    table.index('action_type');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('audit_logs');
};
