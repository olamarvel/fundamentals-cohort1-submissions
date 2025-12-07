import mongoose from "mongoose";

const connectDb = async (connStr: string) => {
    try {
        await mongoose.connect(connStr)
        console.log("mongodb connected")
    } catch (error) {
        console.log(`unable to connect to mongoDB ${connStr}`)
    }
}

export default connectDb