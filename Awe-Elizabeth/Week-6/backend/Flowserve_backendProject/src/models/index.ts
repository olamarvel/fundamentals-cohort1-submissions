import { sequelize } from "../config/db";
import { Account } from "./Account";
import { Transaction } from "./Transaction";
import { User } from "./User";

User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transactions",
  onDelete: "CASCADE", 
});

Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Account, {
  foreignKey: "userId",
  as: "accounts",
  onDelete: "CASCADE", 
});
Account.belongsTo(User, {foreignKey: "userId", as: "user" })
Account.hasMany(Transaction, {
    foreignKey: "accountId",
    as: "accounts",
    onDelete: "CASCADE"
})
Transaction.belongsTo(Account, { foreignKey: "accountId", as: "account" });

export { sequelize, User, Transaction, Account };