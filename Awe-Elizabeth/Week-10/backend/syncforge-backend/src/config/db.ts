import mongoose from "mongoose";
import logger from '../utils/logger'

export const connectDB = async(connString: string) => {
    try {
        await mongoose.connect(connString)
        logger.info("MongoDB connected")
    } catch (error) {
        logger.error(`unable to connect to mongoDB:  ${error}`)
    }
}