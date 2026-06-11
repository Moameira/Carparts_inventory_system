exports.up = function (knex) {
  return knex.schema.createTable('stock_transactions', (table) => {
    table.increments('id').primary();
    table.integer('part_id').notNullable().references('id').inTable('parts').onDelete('CASCADE');
    table.enu('type', ['IN', 'OUT']).notNullable();
    table.integer('quantity').notNullable();
    table.text('note');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stock_transactions');
};