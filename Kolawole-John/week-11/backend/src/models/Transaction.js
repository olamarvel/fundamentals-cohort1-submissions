const pool = require('../config/database');

class Transaction {
  /**
   * Create a new transaction
   * @param {Object} transactionData - { user_id, amount, currency, type, description, metadata }
   * @returns {Object} Created transaction
   */
  static async create({ user_id, amount, currency = 'USD', type, description, metadata = {} }) {
    const query = `
      INSERT INTO transactions (user_id, amount, currency, type, description, metadata, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'completed')
      RETURNING *
    `;

    const result = await pool.query(query, [
      user_id,
      amount,
      currency,
      type,
      description,
      JSON.stringify(metadata)
    ]);

    return result.rows[0];
  }

  /**
   * Get user's transaction history
   * @param {Number} user_id
   * @param {Object} options - { limit, offset, type }
   * @returns {Array} List of transactions
   */
  static async getUserTransactions(user_id, options = {}) {
    const { limit = 10, offset = 0, type = null } = options;

    let query = `
      SELECT id, amount, currency, type, status, description, created_at
      FROM transactions
      WHERE user_id = $1
    `;

    const params = [user_id];

    // Optional filter by transaction type
    if (type) {
      query += ` AND type = $${params.length + 1}`;
      params.push(type);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get transaction by ID
   * @param {Number} id
   * @param {Number} user_id - For authorization check
   * @returns {Object|null} Transaction details
   */
  static async findById(id, user_id) {
    const query = `
      SELECT * FROM transactions
      WHERE id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [id, user_id]);
    return result.rows[0] || null;
  }

  /**
   * Get user's total balance (simplified for demo)
   * In production, you'd calculate from double-entry ledger
   * @param {Number} user_id
   * @returns {Object} { balance, currency }
   */
  static async getUserBalance(user_id) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END), 0) as balance,
        currency
      FROM transactions
      WHERE user_id = $1 AND status = 'completed'
      GROUP BY currency
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || { balance: 0, currency: 'USD' };
  }

  /**
   * Get transaction statistics
   * @param {Number} user_id
   * @returns {Object} Statistics
   */
  static async getStats(user_id) {
    const query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END) as total_spent,
        SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as total_received,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as transactions_last_30_days
      FROM transactions
      WHERE user_id = $1 AND status = 'completed'
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }
}

module.exports = Transaction;