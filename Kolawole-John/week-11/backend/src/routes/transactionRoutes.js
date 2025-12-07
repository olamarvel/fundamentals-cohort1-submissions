const express = require('express');
const { body, query, param } = require('express-validator');
const TransactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All transaction routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
router.post(
  '/',
  [
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
    body('type')
      .isIn(['payment', 'deposit', 'transfer', 'refund'])
      .withMessage('Invalid transaction type'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('currency')
      .optional()
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be 3 characters (e.g., USD)'),
    validateRequest
  ],
  TransactionController.createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    Get user's transaction history
 * @access  Private
 */
router.get(
  '/',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a positive number'),
    query('type')
      .optional()
      .isIn(['payment', 'deposit', 'transfer', 'refund'])
      .withMessage('Invalid transaction type filter'),
    validateRequest
  ],
  TransactionController.getTransactions
);

/**
 * @route   GET /api/transactions/stats
 * @desc    Get user's transaction statistics
 * @access  Private
 */
router.get('/stats', TransactionController.getStats);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get specific transaction details
 * @access  Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Transaction ID must be a number'),
    validateRequest
  ],
  TransactionController.getTransactionById
);

module.exports = router;