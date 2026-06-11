exports.up = function (knex) {
  return knex.schema.createTable('suppliers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email');
    table.string('phone');
    table.text('address');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('suppliers');
};