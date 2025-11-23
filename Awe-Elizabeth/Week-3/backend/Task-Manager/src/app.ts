import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import authRoutes from './routes/AuthRoutes'
import taskRoutes from './routes/TasksRoutes'


import { errorHandler } from './middleware/errorHandlerMiddleware';


const app  = express();


//midleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser())
app.use(helmet())

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);


app.use(errorHandler)
export default app;