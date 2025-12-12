import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notification_system';
export default async function connectDb() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    
    }
}