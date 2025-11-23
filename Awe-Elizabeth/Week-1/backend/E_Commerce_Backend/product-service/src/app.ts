import express from "express";
import dotenv from "dotenv"
import productRoutes from "./routes/productRoutes"
import cors from "cors"

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/products", productRoutes )

export default app;