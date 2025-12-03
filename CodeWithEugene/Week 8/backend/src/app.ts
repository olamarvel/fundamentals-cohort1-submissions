import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import requestContext from './middleware/requestContext';
import { requestLogger, errorLogger } from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';
import logger from './config/logger';
import { register, metricsMiddleware, setAppVersion } from './metrics/metrics';
import packageJson from '../package.json';

setAppVersion(packageJson.version);

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use(metricsMiddleware.requestCounters);

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.use('/api', routes);

app.get('/metrics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to scrape metrics: %s', err.message);
    next(error);
  }
});

app.use(errorLogger);
app.use(errorHandler);

export default app;









