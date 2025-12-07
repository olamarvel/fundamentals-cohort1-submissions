const Transaction = require('../models/Transaction');
const User = require('../models/User');
const ResponseHelper = require('../utils/responseHelper');

class TransactionController {
  /**
   * Create a new transaction (payment/deposit)
   * POST /api/transactions
   */
  static async createTransaction(req, res, next) {
    try {
      const { amount, type, description, currency } = req.body;
      const user_id = req.user.id;

      // Validate amount
      if (amount <= 0) {
        return ResponseHelper.error(res, 'Amount must be greater than 0', 400);
      }

      // Validate transaction type
      const validTypes = ['payment', 'deposit', 'transfer', 'refund'];
      if (!validTypes.includes(type)) {
        return ResponseHelper.error(res, 'Invalid transaction type', 400);
      }

      // Create transaction
      const transaction = await Transaction.create({
        user_id,
        amount,
        currency: currency || 'USD',
        type,
        description,
        metadata: {
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        }
      });

      return ResponseHelper.success(res, {
        transaction
      }, 'Transaction created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's transaction history
   * GET /api/transactions
   */
  static async getTransactions(req, res, next) {
    try {
      const user_id = req.user.id;
      const { limit = 10, offset = 0, type } = req.query;

      // Validate pagination
      const parsedLimit = Math.min(parseInt(limit) || 10, 100); // Max 100 per request
      const parsedOffset = parseInt(offset) || 0;

      const transactions = await Transaction.getUserTransactions(user_id, {
        limit: parsedLimit,
        offset: parsedOffset,
        type
      });

      return ResponseHelper.success(res, {
        transactions,
        pagination: {
          limit: parsedLimit,
          offset: parsedOffset,
          total: transactions.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific transaction details
   * GET /api/transactions/:id
   */
  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const transaction = await Transaction.findById(id, user_id);

      if (!transaction) {
        return ResponseHelper.error(res, 'Transaction not found', 404);
      }

      return ResponseHelper.success(res, { transaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's balance and statistics
   * GET /api/transactions/stats
   */
  static async getStats(req, res, next) {
    try {
      const user_id = req.user.id;

      const balance = await Transaction.getUserBalance(user_id);
      const stats = await Transaction.getStats(user_id);

      return ResponseHelper.success(res, {
        balance: parseFloat(balance.balance),
        currency: balance.currency,
        stats: {
          total_transactions: parseInt(stats.total_transactions),
          total_spent: parseFloat(stats.total_spent || 0),
          total_received: parseFloat(stats.total_received || 0),
          transactions_last_30_days: parseInt(stats.transactions_last_30_days)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;