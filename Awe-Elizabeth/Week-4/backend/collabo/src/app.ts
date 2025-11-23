import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import authRoutes from './routes/AuthRoutes'
import postRoutes from './routes/postRoutes'
import commentRoutes from './routes/commentRoutes'
import userRoutes from './routes/userRoutes';


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
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);



app.use(errorHandler)
export default app;