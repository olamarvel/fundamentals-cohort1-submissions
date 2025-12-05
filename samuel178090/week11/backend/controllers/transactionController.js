const Database = require('../models/database');

const createTransaction = async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    const userId = req.user.userId;

    if (!amount || !type) {
      return res.status(400).json({ error: 'Amount and type required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const transaction = Database.createTransaction({
      userId,
      amount: parseFloat(amount),
      type,
      description: description || '',
      status: 'pending'
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Transaction creation failed' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = Database.getTransactionsByUserId(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const transactions = Database.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all transactions' });
  }
};

module.exports = { createTransaction, getTransactions, getAllTransactions };