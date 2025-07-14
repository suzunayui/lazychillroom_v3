/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_settings', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.enum('theme', ['light', 'dark', 'auto']).defaultTo('dark');
    table.string('language', 10).defaultTo('ja');
    table.string('status_message', 200).nullable();
    table.boolean('show_online_status').defaultTo(true);
    table.boolean('allow_dms').defaultTo(true);
    table.boolean('compact_mode').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // ユニークキー
    table.unique('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_settings');
};
