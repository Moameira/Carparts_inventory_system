const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllCategories } = require('../controllers/categoriesController');

router.get('/', auth, getAllCategories);

module.exports = router;