import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client'

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register })

// Custom metrics
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
})

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
})

export { register }
