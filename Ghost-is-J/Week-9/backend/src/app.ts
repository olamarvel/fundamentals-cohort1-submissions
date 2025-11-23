import express from 'express';
import payments from './routes/v2/payments';
import customers from './routes/v2/customers';
import 'express-async-errors';


const app = express();
app.use(express.json());


app.use('/v2/payments', payments);
app.use('/v2/customers', customers);


app.get('/health', (_, res) => res.json({ status: 'ok' }));


app.use((err: any, _req: any, res: any, _next: any) => {
console.error(err?.stack || err);
const status = err?.status || 500;
res.status(status).json({error: err?.message || 'Internal Server Error' });});


export default app;