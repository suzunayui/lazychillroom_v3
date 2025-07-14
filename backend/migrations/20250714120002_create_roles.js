/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('roles', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().notNullable();
    table.string('name', 100).notNullable();
    table.string('color', 7).defaultTo('#99aab5');
    table.bigInteger('permissions').unsigned().defaultTo(0);
    table.integer('position').defaultTo(0);
    table.boolean('hoist').defaultTo(false);
    table.boolean('mentionable').defaultTo(false);
    table.boolean('is_default').defaultTo(false);
    table.boolean('is_managed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    
    // インデックス
    table.index(['guild_id', 'position']);
    table.index('is_default');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('roles');
};
