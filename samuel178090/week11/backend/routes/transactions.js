const express = require('express');
const { createTransaction, getTransactions, getAllTransactions } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/all', getAllTransactions);

module.exports = router;