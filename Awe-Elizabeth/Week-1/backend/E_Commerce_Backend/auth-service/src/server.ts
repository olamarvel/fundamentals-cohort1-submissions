import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";
import {connectRabbitMQ, consumeQueue} from "./events/connection"
import { handleCartCreated } from "./events/cartCreatedConsumer";
dotenv.config();

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/orderdb";
const RABBITMQ_URL = process.env.RABBITMQ_URL || ""

connectDB(MONGO_URI).then(async () => {
  //event connection
  await connectRabbitMQ(RABBITMQ_URL, ["user_events", "cart_events"])
    await consumeQueue("cart_events", (msg) => {
      if (msg.event === "CART_CREATED") {
        handleCartCreated(msg);
      }
    });
  app.listen(PORT, () => {
    console.log(`🚀 Auth service listening on ${PORT}`);
  });
});

