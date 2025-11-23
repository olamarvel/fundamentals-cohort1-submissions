import { Model, DataTypes, Optional } from "sequelize";
import {sequelize} from "../config/db"
import { User } from "./User";

import { currency, TransactionStatus, TransactionType } from "../utils/enums";

export interface ITransactionAttributes{
    id: string;
    userId: string;
    accountId: string;
    runningBalance: number;
    reference: string;
    transferGroupRef: string 
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TransactionCreationAttribute = Optional<ITransactionAttributes, "id" | "status" |"transferGroupRef" >

export class Transaction extends Model<ITransactionAttributes, TransactionCreationAttribute> implements ITransactionAttributes
{
    public id!: string;
    public userId!: string;
    public reference!: string;
    public type!: TransactionType;
    public amount!: number;
    public runningBalance!: number;
    public accountId!: string;
    public currency!: string;
    public status!: TransactionStatus;
    public transferGroupRef!: string;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId:{
            type: DataTypes.UUID,
            allowNull: false
        },
        accountId:{
            type: DataTypes.UUID,
            allowNull: false
        },
        reference: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
         transferGroupRef: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(TransactionType)),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        runningBalance: {
            type: DataTypes.DOUBLE(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        currency: {
            type: DataTypes.ENUM(...Object.values(currency)),
            allowNull: false,
            defaultValue: currency.NGN,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TransactionStatus)),
            allowNull: false,
            defaultValue: TransactionStatus.Pending,
        }   
    },
    {
        sequelize,
        tableName: "transactions",
        indexes: [{ fields: ["userId", "reference"] }],
    }
)