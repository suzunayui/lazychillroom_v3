/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('file_attachments', function(table) {
    table.increments('id').primary();
    table.integer('message_id').unsigned().notNullable();
    table.string('filename', 255).notNullable();
    table.string('original_filename', 255).notNullable();
    table.string('content_type', 100).notNullable();
    table.bigInteger('file_size').unsigned().notNullable();
    table.string('file_url', 255).notNullable();
    table.string('thumbnail_url', 255).nullable();
    table.integer('width').nullable();
    table.integer('height').nullable();
    table.boolean('is_spoiler').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('message_id').references('id').inTable('messages').onDelete('CASCADE');
    
    // インデックス
    table.index('message_id');
    table.index('content_type');
    table.index('file_size');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('file_attachments');
};
