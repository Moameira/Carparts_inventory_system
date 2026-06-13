const knex = require('knex');
const config = require('../../knexfile');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const environment = process.env.NODE_ENV || 'development';
console.log('Environment:', environment);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20));

const db = knex(config[environment]);

module.exports = db;