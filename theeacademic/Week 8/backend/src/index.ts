import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import logger from './utils/logger.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler } from './middleware/errorHandler.js'
import healthRouter from './routes/health.js'
import metricsRouter from './routes/metrics.js'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Routes
app.use('/api', healthRouter)
app.use('/api', metricsRouter)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DeployHub Backend API',
    version: process.env.APP_VERSION || '0.1.0',
    endpoints: {
      health: '/api/health',
      metrics: '/api/metrics'
    }
  })
})

// Error handler (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  })
})
