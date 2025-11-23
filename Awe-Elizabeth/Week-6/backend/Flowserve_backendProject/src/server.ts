import app from "./app"
import dotenv from "dotenv"
import {sequelize} from "./config/db"
dotenv.config();


const PORT = process.env.PORT

sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));

