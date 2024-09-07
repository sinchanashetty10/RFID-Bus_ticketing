// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction routes
router.post('/:userId/record', transactionController.recordTransaction);

module.exports = router;
