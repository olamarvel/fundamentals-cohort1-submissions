import express from "express";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import connectDB from "../src/config/db"
import cors from "cors";


dotenv.config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/v1/auth", authRoutes);

export default app;
