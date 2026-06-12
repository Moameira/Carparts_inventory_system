exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.enu('role', ['admin', 'worker']).notNullable().defaultTo('worker');
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('users');
};