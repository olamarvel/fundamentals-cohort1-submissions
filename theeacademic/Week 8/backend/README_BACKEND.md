# deployhub-backend

This repository contains a TypeScript Express backend for the DeployHub Week 8 challenge: a CI/CD + Observability demo featuring structured logging (Winston), Prometheus metrics, health checks, and modular routing.

## What's included

- **Express + TypeScript** backend (in `src/`)
- **Winston** for structured JSON logging
- **Prometheus client** for metrics collection (default + custom HTTP metrics)
- **Health endpoint** (`/api/health`) returning status, version, and uptime
- **Metrics endpoint** (`/api/metrics`) exposing Prometheus-compatible metrics
- **Middleware** for request logging and error handling
- **Dockerfile** for containerization
- **GitHub Actions workflow** (`.github/workflows/ci.yml`) for CI/CD automation

## Quick start (local)

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env` file** (copy from `.env.example`)

```bash
cp .env.example .env
```

3. **Run dev server**

```bash
npm run dev
```

Server will start on `http://localhost:4000`.

4. **Build for production**

```bash
npm run build
npm start
```

## API Endpoints

### `GET /`
Root endpoint with API info and available endpoints.

### `GET /api/health`
Health check endpoint returning:
```json
{
  "status": "ok",
  "version": "0.1.0",
  "uptime": 123,
  "timestamp": "2025-11-13T12:00:00.000Z"
}
```

### `GET /api/metrics`
Prometheus metrics endpoint exposing:
- Default Node.js metrics (CPU, memory, event loop, etc.)
- Custom HTTP request metrics (counter and duration histogram)

## Observability

### Structured Logging
All logs are emitted in JSON format via Winston, making them easily ingestible by log aggregation tools (e.g., ELK, Grafana Loki, Datadog).

### Metrics Collection
Prometheus client collects:
- **Default metrics**: CPU usage, memory, garbage collection, event loop lag
- **Custom metrics**:
  - `http_requests_total`: Counter for total HTTP requests by method, route, and status
  - `http_request_duration_seconds`: Histogram for request duration

Use the `/api/metrics` endpoint with Prometheus or Grafana to visualize app health.

## CI/CD

The `.github/workflows/ci.yml` workflow runs on every push and pull request to `main`:
1. Install dependencies
2. Run TypeScript type checking
3. Run ESLint
4. Run tests (if any)
5. Build the app
6. Upload build artifacts

## Deployment

### Option 1: Render / Railway
1. Connect your GitHub repository
2. Set environment variables (`PORT`, `APP_VERSION`, etc.)
3. Deploy automatically on push to `main`

### Option 2: Docker
```bash
docker build -t deployhub-backend .
docker run -p 4000:4000 -e PORT=4000 deployhub-backend
```

## Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Scripts

- `npm run dev` – Start dev server with hot reload (tsx watch)
- `npm run build` – Compile TypeScript to `dist/`
- `npm start` – Run compiled app from `dist/`
- `npm run lint` – Lint code with ESLint
- `npm run typecheck` – Type check without emitting files
- `npm test` – Run tests with Vitest

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `LOG_LEVEL` | `info` | Winston log level |
| `APP_VERSION` | `0.1.0` | App version (returned in health check) |

## Next Steps

- Add integration tests for routes
- Set up Grafana dashboards for metrics visualization
- Integrate distributed tracing (e.g., OpenTelemetry)
- Add rate limiting and security middleware (helmet, express-rate-limit)
- Create Postman collection for API documentation

## License

MIT
