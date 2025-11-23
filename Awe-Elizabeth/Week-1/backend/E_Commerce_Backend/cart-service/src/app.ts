import express from "express";
import cartRoutes from "./routes/cartRoutes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/cart", cartRoutes);

export default app;
