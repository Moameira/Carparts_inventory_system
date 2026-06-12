const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  getAllParts, getPartById, getLowStockParts,
  createPart, updatePart, updateStock, deletePart,
} = require('../controllers/partsController');

router.get('/low-stock', auth, getLowStockParts);
router.get('/', auth, getAllParts);
router.get('/:id', auth, getPartById);
router.post('/', auth, adminOnly, createPart);
router.put('/:id', auth, adminOnly, updatePart);
router.patch('/:id/stock', auth, updateStock);
router.delete('/:id', auth, adminOnly, deletePart);

module.exports = router;