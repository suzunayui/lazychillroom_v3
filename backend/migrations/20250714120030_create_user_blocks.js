/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_blocks', function(table) {
    table.increments('id').primary();
    table.integer('blocker_id').unsigned().notNullable();
    table.integer('blocked_id').unsigned().notNullable();
    table.text('reason').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 外部キー
    table.foreign('blocker_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('blocked_id').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー
    table.unique(['blocker_id', 'blocked_id']);
    
    // インデックス
    table.index('blocker_id');
    table.index('blocked_id');
    
    // チェック制約（自分自身はブロックできない）
    table.check('blocker_id != blocked_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_blocks');
};
