const bcrypt = require('bcryptjs');
const db = require('../db');

exports.getAllWorkers = async (req, res) => {
  const workers = await db('users')
    .where({ role: 'worker' })
    .select('id', 'name', 'email', 'role', 'created_at')
    .orderBy('created_at', 'desc');
  res.json(workers);
};

exports.createWorker = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const existing = await db('users').where({ email }).first();
  if (existing) return res.status(400).json({ error: 'Email already in use.' });

  const hash = await bcrypt.hash(password, 10);
  const [user] = await db('users').insert({
    name, email, password: hash, role: 'worker',
  }).returning('id', 'name', 'email', 'role', 'created_at');

  res.status(201).json(user);
};

exports.deleteWorker = async (req, res) => {
  const user = await db('users').where({ id: req.params.id, role: 'worker' }).first();
  if (!user) return res.status(404).json({ error: 'Worker not found.' });
  await db('users').where({ id: req.params.id }).delete();
  res.json({ message: 'Worker deleted.' });
};