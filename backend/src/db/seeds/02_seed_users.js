const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('users').del();

  const adminHash = await bcrypt.hash('password123', 10);
  const workerHash = await bcrypt.hash('worker123', 10);

  await knex('users').insert([
    {
      name: 'Admin Owner',
      email: 'admin@demo.com',
      password: adminHash,
      role: 'admin',
    },
    {
      name: 'Warehouse Worker',
      email: 'worker@demo.com',
      password: workerHash,
      role: 'worker',
    },
  ]);
};