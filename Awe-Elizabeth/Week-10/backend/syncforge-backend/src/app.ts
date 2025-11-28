import express from 'express'
import cors from 'cors'
import postRoutes from './routes/post.routes';

const app = express()

app.use(express.json())

app.use("/api/v1/posts", postRoutes);



export default app
