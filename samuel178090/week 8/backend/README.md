# DeployHub Backend
Test Credentials (Now in README):
Role	Username	Password	Access Level
Admin:	admin	  admin123	Full platform access
User: 	user	  user123  	Limited user access
Developer:	developer	dev123  	Development features
Live URLs:
Frontend: https://deployhubweb.netlify.app/

Backend: https://deployhub-platformbackend.onrender.com/


A Node.js Express backend with comprehensive CI/CD pipeline and observability features.

## 🚀 Features

- **Express.js API** with modular architecture
- **Winston Logging** with structured logs
- **Prometheus Metrics** for monitoring
- **Health Check Endpoints** (basic, detailed, readiness, liveness)
- **Docker Support** with multi-stage builds
- **GitHub Actions CI/CD** pipeline
- **Error Handling** with proper logging
- **Rate Limiting** and security middleware

## 📊 Observability

### Logging
- Structured JSON logging with Winston
- Log levels: error, warn, info, debug
- File and console outputs
- Request/response logging

### Metrics
- Prometheus metrics endpoint: `/health/metrics`
- HTTP request duration tracking
- Request count by method/route/status
- System metrics (memory, CPU)

### Health Checks
- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed system info
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## 🛠️ Quick Start

### Development
```bash
npm install
npm run dev
```

### Testing
```bash
npm test
npm run test:coverage
```

### Docker
```bash
docker build -t deployhub-backend .
docker run -p 3000:3000 deployhub-backend
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Basic health check |
| `/health/detailed` | GET | Detailed health info |
| `/health/metrics` | GET | Prometheus metrics |
| `/api/status` | GET | Service status |
| `/api/version` | GET | Version information |

## 🔧 Environment Variables

```bash
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
```

## 🚦 CI/CD Pipeline

The GitHub Actions workflow includes:
1. **Lint** - ESLint code quality checks
2. **Test** - Jest unit tests with coverage
3. **Build** - Docker image creation
4. **Deploy** - Automated deployment

## 📈 Monitoring

Access metrics at `/health/metrics` for:
- HTTP request duration
- Request counts by endpoint
- System memory usage
- Application uptime

## 🐳 Docker

The application includes:
- Multi-stage Docker build
- Health checks
- Non-root user security
- Optimized image size

## 📝 Logs

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output for development

This backend provides a solid foundation for reliable, observable microservices.
