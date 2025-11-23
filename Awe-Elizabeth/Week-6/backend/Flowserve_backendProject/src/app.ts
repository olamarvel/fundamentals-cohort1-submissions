import express, { Request, Response } from 'express';
import authRoutes from './routes/auth'
import transactionsRoutes from './routes/transactions'

import cors from 'cors'
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));


//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionsRoutes);


app.get("/", (req: Request, res: Response) => {
    try{
        res.status(200).json({message: "connected"})
    }catch(error)
    {
        console.error(error)
        res.status(500).send("server error")
    }
    
})

app.use(errorHandler)
export default app