const { Transaction, User } = require('../models');
const { sequelize } = require('../database/connection');
const { transactionSchema, depositSchema } = require('../validators/schemas');

class TransactionController {
  // Create a new transaction (transfer/payment)
  async createTransaction(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { error, value } = transactionSchema.validate(req.body);
      
      if (error) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(d => d.message)
        });
      }

      const { receiverEmail, amount, type, description } = value;
      const senderId = req.user.id;

      // Find receiver
      const receiver = await User.findOne({ 
        where: { email: receiverEmail },
        transaction: t,
        lock: true
      });

      if (!receiver) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Receiver not found'
        });
      }

      if (receiver.id === senderId) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Cannot transfer to yourself'
        });
      }

      // Get sender with lock
      const sender = await User.findByPk(senderId, {
        transaction: t,
        lock: true
      });

      // Check sender balance
      if (parseFloat(sender.accountBalance) < parseFloat(amount)) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Create transaction
      const transaction = await Transaction.create({
        senderId,
        receiverId: receiver.id,
        amount,
        type: type || 'transfer',
        description,
        status: 'processing'
      }, { transaction: t });

      // Update balances
      sender.accountBalance = parseFloat(sender.accountBalance) - parseFloat(amount);
      receiver.accountBalance = parseFloat(receiver.accountBalance) + parseFloat(amount);

      await sender.save({ transaction: t });
      await receiver.save({ transaction: t });

      // Update transaction status
      transaction.status = 'completed';
      transaction.processedAt = new Date();
      await transaction.save({ transaction: t });

      await t.commit();

      // Fetch complete transaction with associations
      const completeTransaction = await Transaction.findByPk(transaction.id, {
        include: [
          { model: User, as: 'sender', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: User, as: 'receiver', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Transaction completed successfully',
        data: {
          transaction: completeTransaction
        }
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // Deposit funds
  async deposit(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { error, value } = depositSchema.validate(req.body);
      
      if (error) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(d => d.message)
        });
      }

      const { amount } = value;
      const userId = req.user.id;

      // Get user with lock
      const user = await User.findByPk(userId, {
        transaction: t,
        lock: true
      });

      // Create deposit transaction (system account as sender)
      const transaction = await Transaction.create({
        senderId: userId, // In real system, this would be a system account
        receiverId: userId,
        amount,
        type: 'deposit',
        description: 'Account deposit',
        status: 'processing'
      }, { transaction: t });

      // Update balance
      user.accountBalance = parseFloat(user.accountBalance) + parseFloat(amount);
      await user.save({ transaction: t });

      // Update transaction status
      transaction.status = 'completed';
      transaction.processedAt = new Date();
      await transaction.save({ transaction: t });

      await t.commit();

      res.status(201).json({
        success: true,
        message: 'Deposit successful',
        data: {
          transaction,
          newBalance: user.accountBalance
        }
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // Get user's transaction history
  async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, type } = req.query;

      const offset = (page - 1) * limit;

      // Build where clause
      const where = {
        [sequelize.Sequelize.Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      };

      if (status) where.status = status;
      if (type) where.type = type;

      const { count, rows: transactions } = await Transaction.findAndCountAll({
        where,
        include: [
          { model: User, as: 'sender', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: User, as: 'receiver', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        data: {
          transactions,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get transaction by ID
  async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transaction = await Transaction.findOne({
        where: {
          id,
          [sequelize.Sequelize.Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: [
          { model: User, as: 'sender', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: User, as: 'receiver', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ]
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();
