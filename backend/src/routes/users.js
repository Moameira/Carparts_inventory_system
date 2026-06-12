const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const usersController = require('../controllers/usersController');

router.get('/', auth, adminOnly, usersController.getAllWorkers);
router.post('/', auth, adminOnly, usersController.createWorker);
router.delete('/:id', auth, adminOnly, usersController.deleteWorker);

module.exports = router;