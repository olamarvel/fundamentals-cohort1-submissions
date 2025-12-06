const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  type: {
    type: DataTypes.ENUM('transfer', 'payment', 'withdrawal', 'deposit'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'reversed'),
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    { fields: ['senderId'] },
    { fields: ['receiverId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Transaction;
