import express from 'express';
import promClient from "prom-client";
import helmet from 'helmet';
import expressPino from 'express-pino-logger';

import logger from './logger.js';
import healthRouter from './routes/health.js';
import metricsRegister, {
  httpRequestDurationSeconds,
  requestCounter,
  errorCounter,
  uptimeGauge
} from './metrics.js';
import {errorHandler} from './middleware/errorHandler.js';

const app = express();

// Security
app.use(helmet());
app.use(express.json());

// Logging
app.use(expressPino({ logger }));

// PROMETHEUS DEFAULT METRICS
promClient.collectDefaultMetrics();

// UPTIME METRIC
setInterval(() => {
  uptimeGauge.set(process.uptime());
}, 1000);

// METRICS MIDDLEWARE
app.use((req, res, next) => {
  requestCounter.inc({method: req.method});

  const end = httpRequestDurationSeconds.startTimer();

  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });

    // Count errors
    if (res.statusCode >= 500) {
      errorCounter.inc({route: req.path});
    }
  });

  next();
});

// Routes
app.use('/api/health', healthRouter);

// metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', metricsRegister.contentType);
  res.send(await metricsRegister.metrics());
});

// Error handler
app.use(errorHandler);

export default app;
