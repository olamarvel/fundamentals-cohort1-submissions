import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(process.env.PSQ!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {require: true, rejectUnauthorized: false}
  }  
})