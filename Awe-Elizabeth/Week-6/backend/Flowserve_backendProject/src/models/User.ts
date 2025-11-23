import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Optional,
} from 'sequelize';

import {sequelize} from '../config/db'
import { userRoles } from '../utils/enums';


export interface IUserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  profilePicture?: string;
  role: userRoles
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string
  transferPin?: string
  bvn?: string
}

export type UserCreationAttribute = Optional<IUserAttributes, "id" | "role">

export class User extends Model<IUserAttributes, UserCreationAttribute> implements IUserAttributes{
    public id!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public passwordHash!: string;
    public phone?: string;
    public role!: userRoles;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
    public transferPin?: string;
    public bvn?: string;
    public profilePicture?: string;
    public refreshToken?: string;
}

User.init(
    {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstName:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull:false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    role: {
        type: DataTypes.ENUM(...Object.values(userRoles)),
        defaultValue: userRoles.User,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    transferPin: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    bvn: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
},
  {
    sequelize,
    tableName: "users",
    indexes: [{ fields: ["email"] }],
  }
)


