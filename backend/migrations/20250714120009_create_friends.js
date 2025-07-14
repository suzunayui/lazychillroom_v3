/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('friends', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('friend_id').unsigned().notNullable();
    table.enum('status', ['pending', 'accepted', 'blocked']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('accepted_at').nullable();
    
    // 外部キー
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('friend_id').references('id').inTable('users').onDelete('CASCADE');
    
    // 複合ユニークキー（同じ関係は一つまで）
    table.unique(['user_id', 'friend_id']);
    
    // インデックス
    table.index('user_id');
    table.index('friend_id');
    table.index('status');
    
    // チェック制約（自分自身をフレンドにできない）
    table.check('user_id != friend_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('friends');
};
