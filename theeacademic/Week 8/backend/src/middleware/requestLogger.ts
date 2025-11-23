import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger.js'
import { httpRequestCounter, httpRequestDuration } from '../utils/metrics.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    const { method, originalUrl, ip } = req
    const { statusCode } = res

    logger.info('HTTP request', {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}s`,
      ip
    })

    // Update Prometheus metrics
    httpRequestCounter.inc({
      method,
      route: originalUrl,
      status_code: statusCode.toString()
    })

    httpRequestDuration.observe(
      {
        method,
        route: originalUrl,
        status_code: statusCode.toString()
      },
      duration
    )
  })

  next()
}
