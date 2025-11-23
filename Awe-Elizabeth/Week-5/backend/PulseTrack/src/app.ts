import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import authRoutes from './routes/AuthRoutes'
import activityRoutes from './routes/activityRoutes'
import appoinmentRoutes from './routes/appointmentRoutes'
import mealRoutes from './routes/mealRoutes'
import userRoutes from './routes/userRoutes';
import foodRoutes from './routes/foodRoutes';
import { errorHandler } from './middleware/errorHandlerMiddleware';


const app  = express();


//midleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser())
//app.use(helmet())

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/appointments", appoinmentRoutes);
app.use("/api/v1/meals", mealRoutes);
app.use("/api/v1/foods", foodRoutes);

app.use(errorHandler)
export default app;