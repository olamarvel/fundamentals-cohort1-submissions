import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware';
import { versioningMiddleware, validateVersion } from './middleware/versioning.middleware';

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(versioningMiddleware);
app.use(validateVersion);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 LegacyBridge Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Legacy API: ${config.legacyApiBaseUrl}`);
  console.log(`💾 Cache TTL: ${config.cacheTtl}s`);
});

export default app;


