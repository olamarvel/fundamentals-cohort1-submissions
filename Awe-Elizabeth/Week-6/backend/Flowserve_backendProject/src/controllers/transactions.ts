import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { generateReference, isNullOrEmpty } from "../utils/utilityFunctions";
import { Account } from "../models/Account";
import { currency, TransactionStatus, TransactionType } from "../utils/enums";
import { sequelize, Transaction } from "../models";
import { where } from "sequelize";

export class TransactionController {
  static async transferMoney(req: Request, res: Response, next: NextFunction) {
    const { senderAccountId, recipientAccountId, amount, currency } = req.body;
    if(!req.user?.id){
        return res.status(401).json({ message: `unauthorized` });
    }
    const userId = req.user.id
    await sequelize.transaction(async (t) => {
        if(isNullOrEmpty(senderAccountId) || isNullOrEmpty(recipientAccountId) || isNullOrEmpty(amount) || isNullOrEmpty(currency)){
        return res.status(400).json({ message: "senderAccountId, recipientAccountId, amount and currency is required" });
    }
    const senderAccount = await Account.findOne({ where: {id: senderAccountId, userId: userId}, transaction: t})
    if(!senderAccount){
        return res.status(400).json({ message: `account number does not exist - ${senderAccountId}` });
    }
    const recipientAccount = await Account.findByPk(recipientAccountId, {transaction: t})
    if(!recipientAccount){
        return res.status(400).json({ message: `account number does not exist - ${recipientAccountId}` });
    }
    if(senderAccount.dataValues.currency !== recipientAccount.dataValues.currency){
        return res.status(400).json({ message: `currency does not match` });
    }
    if(senderAccount.dataValues.availableBalance < amount){
        return res.status(400).json({ message: `insufficient funds` });
    }
  
    await Account.update({
        availableBalance :senderAccount.dataValues.availableBalance - amount,
        bookBalance: senderAccount.dataValues.availableBalance - amount
    },
    {
        where: {id: senderAccount.dataValues.id }
    }) 

    console.log(senderAccount.dataValues.availableBalance)
    var transactionGroupRef = generateReference()
    const senderTransaction = await Transaction.create({
        userId: senderAccount.dataValues.userId,
        reference: generateReference(),
        transferGroupRef: transactionGroupRef,
        amount: amount,
        type: TransactionType.Debit,
        runningBalance: senderAccount.dataValues.availableBalance,
        accountId: senderAccount.dataValues.id,
        currency: currency,
        status: TransactionStatus.Successful
    });

    await Account.update({
        availableBalance :recipientAccount.dataValues.availableBalance + amount,
        bookBalance: recipientAccount.dataValues.availableBalance + amount
    },
    {
        where: {id: recipientAccount.dataValues.id }
    })
    const receipientTransaction = await Transaction.create({
        userId: recipientAccount.dataValues.userId,
        reference: generateReference(),
        transferGroupRef: transactionGroupRef,
        amount: amount,
        type: TransactionType.Credit,
        runningBalance: recipientAccount.dataValues.availableBalance,
        accountId: recipientAccount.dataValues.id,
        currency: currency,
        status: TransactionStatus.Successful
    });

    return res.status(200).json({success: true, message: `success`, result: transactionGroupRef });
    })   
  } 

  static async getUsersTransactions(req: Request, res: Response, next: NextFunction){
    if(!req.user?.id){
        return res.status(401).json({ message: `unauthorized` });
    }
    const transactions = await Transaction.findAll({where: {userId: req.user.id}})

    return res.status(200).json({success: true, message: `success`, result: transactions });
  }

  static async depositMoney(req: Request, res: Response, next: NextFunction) {
    const { accountId,  amount, currency } = req.body;
    if(!req.user?.id){
        return res.status(401).json({ message: `unauthorized` });
    }
    const userId = req.user.id

    await sequelize.transaction(async (t) => {
        if(isNullOrEmpty(accountId) || isNullOrEmpty(amount) || isNullOrEmpty(currency)){
        return res.status(400).json({ message: "accountId, amount, currency is required" });
    }
    const account = await Account.findOne({where: {id: accountId, userId: userId}, transaction: t})
    if(!account){
        return res.status(400).json({ message: `account number does not exist - ${accountId}` });
    }

    if(account.dataValues.currency !== currency){
        return res.status(400).json({ message: `currency does not match` });
    }
    const reference = generateReference()
    await Account.update({
        availableBalance: account.dataValues.availableBalance + amount,
        bookBalance: account.dataValues.bookBalance + amount
    }, { where: {id: account.dataValues.id}})

    const senderTransaction = await Transaction.create({
        userId: account.dataValues.userId,
        reference: reference,
        amount: amount,
        type: TransactionType.Debit,
        runningBalance: account.dataValues.availableBalance,
        accountId: account.dataValues.id,
        currency: currency,
        status: TransactionStatus.Successful
    });

    return res.status(200).json({success: true, message: `success`, result: reference });
    })   
  } 

  static async withdrawMoney(req: Request, res: Response, next: NextFunction) {
    const { accountId,  amount, currency } = req.body;
    if(!req.user?.id){
        return res.status(401).json({ message: `unauthorized` });
    }
    const userId = req.user.id

    await sequelize.transaction(async (t) => {
        if(isNullOrEmpty(accountId) || isNullOrEmpty(amount) || isNullOrEmpty(currency)){
        return res.status(400).json({ message: "accountId, amount, currency is required" });
    }
    const account = await Account.findOne({raw: true, where: {id: accountId, userId: userId}, transaction: t})
    if(!account){
        return res.status(400).json({ message: `account number does not exist - ${accountId}` });
    }

    if(account.currency !== currency){
        return res.status(400).json({ message: `currency does not match` });
    }

    if(amount > account.availableBalance){
        return res.status(400).json({ message: `you have insufficient funds for this transaction` });
    }

    const reference = generateReference()
      await Account.update({
        availableBalance: account.availableBalance- amount,
        bookBalance: account.bookBalance - amount
    }, { where: {id: account.id}})

    const senderTransaction = await Transaction.create({
        userId: account.userId,
        reference: reference,
        amount: amount,
        type: TransactionType.Debit,
        runningBalance: account.availableBalance,
        accountId: account.id,
        currency: currency,
        status: TransactionStatus.Successful
    });

    return res.status(200).json({success: true, message: `success`, result: reference });
    })   
  } 
}
