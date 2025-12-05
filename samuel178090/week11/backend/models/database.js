// Simulated PostgreSQL database operations
// In production, this would use actual pg client

const users = [
  { id: 1, email: 'admin@payverse.com', password: '$2a$10$example', role: 'admin', fullName: 'System Administrator' },
  { id: 2, email: 'user@payverse.com', password: '$2a$10$example', role: 'user', fullName: 'Demo User' }
];

const transactions = [
  { id: 1, userId: 1, amount: 50000, type: 'credit', status: 'completed', createdAt: new Date(), currency: 'NGN' },
  { id: 2, userId: 2, amount: 25000, type: 'debit', status: 'pending', createdAt: new Date(), currency: 'NGN' }
];

const refreshTokens = [];

class Database {
  static findUserByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findUserById(id) {
    return users.find(user => user.id === id);
  }

  static getAllUsers() {
    return users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }));
  }

  static createTransaction(transaction) {
    const newTransaction = {
      id: transactions.length + 1,
      ...transaction,
      currency: 'NGN',
      createdAt: new Date()
    };
    transactions.push(newTransaction);
    return newTransaction;
  }

  static getTransactionsByUserId(userId) {
    return transactions.filter(t => t.userId === userId);
  }

  static getAllTransactions() {
    return transactions;
  }

  static createUser(userData) {
    const newUser = {
      id: users.length + 1,
      email: userData.email,
      password: userData.password, // In production, hash this
      fullName: userData.fullName,
      role: 'user'
    };
    users.push(newUser);
    return newUser;
  }

  static saveRefreshToken(tokenEntry) {
    // tokenEntry: { token, userId, expiresAt }
    refreshTokens.push(tokenEntry);
    return tokenEntry;
  }

  static findRefreshToken(token) {
    return refreshTokens.find(t => t.token === token);
  }

  static revokeRefreshToken(token) {
    const idx = refreshTokens.findIndex(t => t.token === token);
    if (idx >= 0) refreshTokens.splice(idx, 1);
  }
}

module.exports = Database;