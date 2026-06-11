exports.up = function (knex) {
  return knex.schema.createTable('parts', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('part_number').notNullable().unique();
    table.text('description');
    table.integer('category_id').references('id').inTable('categories').onDelete('SET NULL');
    table.integer('supplier_id').references('id').inTable('suppliers').onDelete('SET NULL');
    table.decimal('price', 10, 2).notNullable().defaultTo(0);
    table.integer('stock_qty').notNullable().defaultTo(0);
    table.integer('reorder_level').notNullable().defaultTo(5);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('parts');
};
