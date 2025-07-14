/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('emojis', function(table) {
    table.increments('id').primary();
    table.integer('guild_id').unsigned().nullable();
    table.string('name', 50).notNullable();
    table.string('image_url', 255).notNullable();
    table.boolean('is_animated').defaultTo(false);
    table.boolean('is_managed').defaultTo(false);
    table.boolean('require_colons').defaultTo(true);
    table.integer('created_by').unsigned().nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.foreign('created_by').references('id').inTable('users').onDelete('SET NULL');
    
    // ユニークキー（ギルド内で同じ名前の絵文字は不可）
    table.unique(['guild_id', 'name']);
    
    // インデックス
    table.index('guild_id');
    table.index('name');
    table.index('is_animated');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('emojis');
};
