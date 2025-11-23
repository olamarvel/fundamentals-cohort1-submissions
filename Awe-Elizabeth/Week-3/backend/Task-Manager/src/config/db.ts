import mongoose from "mongoose";

export const connectDB =async (uri: string) => {
    try {
       const conn = await  mongoose.connect(uri, {

    })
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("error connectiing to database: "+ error)
        process.exit(1);
    }
   
}