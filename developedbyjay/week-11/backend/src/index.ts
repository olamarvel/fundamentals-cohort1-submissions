import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectMongo } from './config/mongo.ts';
import { connectRedis } from './config/redis.ts';
import routes from './routes/index.ts';
import { errorHandler } from './middleware/error.ts';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

await connectMongo();
await connectRedis();

app.use('/api', routes);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});

// https://docs.google.com/document/d/1CyonVdT3FRmuM2VeSt8HSnVt8HXP9KRbG9jt_ABdnDI/edit?usp=sharing