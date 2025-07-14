/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('guilds', function(table) {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.string('icon_url', 255).nullable();
    table.string('banner_url', 255).nullable();
    table.integer('owner_id').unsigned().notNullable();
    table.enum('verification_level', ['none', 'low', 'medium', 'high', 'very_high']).defaultTo('none');
    table.enum('explicit_content_filter', ['disabled', 'members_without_roles', 'all_members']).defaultTo('disabled');
    table.integer('member_count').defaultTo(0);
    table.boolean('is_personal_server').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('owner_id').references('id').inTable('users').onDelete('CASCADE');
    
    // インデックス
    table.index('owner_id');
    table.index('is_personal_server');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('guilds');
};
