import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

connectDB();

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on http://localhost:${PORT}`);
});
