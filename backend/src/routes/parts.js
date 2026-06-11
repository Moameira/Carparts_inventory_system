const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllParts,
  getPartById,
  getLowStockParts,
  createPart,
  updatePart,
  deletePart,
} = require('../controllers/partsController');

router.get('/low-stock', auth, getLowStockParts);
router.get('/', auth, getAllParts);
router.get('/:id', auth, getPartById);
router.post('/', auth, createPart);
router.put('/:id', auth, updatePart);
router.delete('/:id', auth, deletePart);

module.exports = router;