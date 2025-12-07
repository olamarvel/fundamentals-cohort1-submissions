const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   * @param {Object} userData - { email, password, full_name }
   * @returns {Object} Created user (without password)
   */
  static async create({ email, password, full_name }) {
    // Hash password with salt rounds of 10 (industry standard)
    const password_hash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password, full_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, full_name, created_at
    `;

    const result = await pool.query(query, [email, password_hash, full_name]);
    return result.rows[0];
  }

  /**
   * Find user by email
   * @param {String} email
   * @returns {Object|null} User object with password_hash
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   * @param {Number} id
   * @returns {Object|null} User object (without password)
   */
  static async findById(id) {
    const query = `
      SELECT id, email, full_name, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Verify password
   * @param {String} plainPassword
   * @param {String} hashedPassword
   * @returns {Boolean}
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Check if email already exists
   * @param {String} email
   * @returns {Boolean}
   */
  static async emailExists(email) {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }
}

module.exports = User;