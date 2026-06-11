const db = require('../db');

exports.getAllCategories = async (req, res) => {
  const categories = await db('categories').select('*').orderBy('name');
  res.json(categories);
};
