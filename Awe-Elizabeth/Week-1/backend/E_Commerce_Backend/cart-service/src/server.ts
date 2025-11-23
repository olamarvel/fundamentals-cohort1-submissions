import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";
import {connectRabbitMQ, consumeQueue } from "./events/connect"
import {handleUserCreated}  from "./events/userCreatedConsumer"

dotenv.config();

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/orderdb";
const RABBITMQ_URL = process.env.RABBITMQ_URL || ""

connectDB(MONGO_URI).then(async () => {
  //event connection
  await connectRabbitMQ(RABBITMQ_URL, ["user_events", "cart_events"])

   // Consume USER_CREATED
    await consumeQueue("user_events", (msg) => {
      if (msg.event === "USER_CREATED") {
        handleUserCreated(msg);
      }
    });
  app.listen(PORT, () => {
    console.log(`🚀 Cart service listening on ${PORT}`);
  });
});

