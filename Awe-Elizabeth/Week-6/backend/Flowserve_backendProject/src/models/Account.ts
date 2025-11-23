import { Model, DataTypes, Optional } from "sequelize";
import {sequelize} from "../config/db"
import { currency } from "../utils/enums";

export interface IAccountAttributes{
    id: string;
    userId: string;
    availableBalance: number;
    bookBalance: number;
    currency: currency
    createdAt?: Date;
    updatedAt?: Date;
}

export type AccountCreationAttribute = Optional<IAccountAttributes, "id">

export class Account extends Model<IAccountAttributes, AccountCreationAttribute> implements IAccountAttributes
{
    public id!: string;
    public userId!: string;
    public availableBalance!: number;
    public bookBalance!: number;
    public currency!: currency;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

Account.init(
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
        availableBalance: {
            type: DataTypes.DOUBLE(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        bookBalance: {
            type: DataTypes.DOUBLE(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        currency: {
            type: DataTypes.ENUM(...Object.values(currency)),
            allowNull: false,
            defaultValue: currency.NGN,
        }, 
    },
    {
        sequelize,
        tableName: "accounts",
        indexes: [{ fields: ["userId"] }],
    }
)