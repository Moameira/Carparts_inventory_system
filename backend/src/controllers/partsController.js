const db = require('../db');

exports.getAllParts = async (req, res) => {
  const { search, category_id } = req.query;

  let query = db('parts')
    .join('categories', 'parts.category_id', 'categories.id')
    .select(
      'parts.*',
      'categories.name as category_name'
    )
    .orderBy('parts.name');

  if (search) {
    query = query.whereILike('parts.name', `%${search}%`)
                 .orWhereILike('parts.part_number', `%${search}%`);
  }

  if (category_id) {
    query = query.where('parts.category_id', category_id);
  }

  const parts = await query;
  res.json(parts);
};

exports.getPartById = async (req, res) => {
  const part = await db('parts')
    .join('categories', 'parts.category_id', 'categories.id')
    .select('parts.*', 'categories.name as category_name')
    .where('parts.id', req.params.id)
    .first();

  if (!part) return res.status(404).json({ error: 'Part not found.' });
  res.json(part);
};

exports.getLowStockParts = async (req, res) => {
  const parts = await db('parts')
    .join('categories', 'parts.category_id', 'categories.id')
    .select('parts.*', 'categories.name as category_name')
    .whereRaw('parts.stock_qty <= parts.reorder_level')
    .orderBy('parts.stock_qty');

  res.json(parts);
};

exports.createPart = async (req, res) => {
  const { name, part_number, description, category_id, supplier_id, price, stock_qty, reorder_level } = req.body;

  if (!name || !part_number || !price) {
    return res.status(400).json({ error: 'Name, part number and price are required.' });
  }

  const [part] = await db('parts').insert({
    name, part_number, description,
    category_id, supplier_id,
    price, stock_qty: stock_qty || 0,
    reorder_level: reorder_level || 5,
  }).returning('*');

  res.status(201).json(part);
};

exports.updatePart = async (req, res) => {
  const { name, part_number, description, category_id, supplier_id, price, stock_qty, reorder_level } = req.body;

  const [part] = await db('parts')
    .where('id', req.params.id)
    .update({ name, part_number, description, category_id, supplier_id, price, stock_qty, reorder_level, updated_at: new Date() })
    .returning('*');

  if (!part) return res.status(404).json({ error: 'Part not found.' });
  res.json(part);
};

exports.deletePart = async (req, res) => {
  const deleted = await db('parts').where('id', req.params.id).delete();
  if (!deleted) return res.status(404).json({ error: 'Part not found.' });
  res.json({ message: 'Part deleted successfully.' });
};