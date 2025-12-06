const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/auth');

// All transaction routes require authentication
router.use(authMiddleware);

// Create transaction (transfer/payment)
router.post('/', transactionController.createTransaction);

// Deposit funds
router.post('/deposit', transactionController.deposit);

// Get transaction history
router.get('/', transactionController.getTransactionHistory);

// Get specific transaction
router.get('/:id', transactionController.getTransactionById);

module.exports = router;
