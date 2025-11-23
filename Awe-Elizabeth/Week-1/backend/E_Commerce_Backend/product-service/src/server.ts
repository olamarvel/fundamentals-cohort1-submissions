import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/orderdb";
const RABBITMQ_URL = process.env.RABBITMQ_URL || ""

connectDB(MONGO_URI).then(async () => {
  app.listen(PORT, () => {
    console.log(`Product service listening on ${PORT}`);
  });
});

