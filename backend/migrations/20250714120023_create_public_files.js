/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('public_files', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('message_id').unsigned().nullable();
    table.string('original_filename', 255).notNullable();
    table.string('public_filename', 255).notNullable().unique();
    table.bigInteger('file_size').notNullable();
    table.string('mime_type', 100).notNullable();
    table.string('access_url', 500).notNullable();
    table.integer('download_count').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_accessed_at').nullable();
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('message_id').references('id').inTable('messages').onDelete('SET NULL');
    
    // インデックス
    table.index('user_id');
    table.index('public_filename');
    table.index('is_active');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('public_files');
};
