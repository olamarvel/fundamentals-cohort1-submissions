# DeployHub Backend

> A production-ready Node.js backend service with CI/CD automation, comprehensive observability, and Docker containerization.

[![CI/CD Pipeline](https://github.com/maryokafor28/deployhub-backend/actions/workflows/deploy.yml/badge.svg)](https://github.com/maryokafor28/deployhub-backend/actions)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7)](https://deployhub-backend-s6p2.onrender.com)

## Live Deployment

**Backend API:** [https://deployhub-backend-s6p2.onrender.com](https://deployhub-backend-s6p2.onrender.com)

**Health Check:** [https://deployhub-backend-s6p2.onrender.com/api/health](https://deployhub-backend-s6p2.onrender.com/api/health)

**Metrics:** [https://deployhub-backend-s6p2.onrender.com/metrics](https://deployhub-backend-s6p2.onrender.com/metrics)

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Docker Setup](#-docker-setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Observability](#-observability)
- [Environment Variables](#-environment-variables)

## Features

- ✅ **RESTful API** with Express.js
- ✅ **Structured Logging** with Pino
- ✅ **Metrics Collection** with Prometheus
- ✅ **Health Check Endpoint** for monitoring
- ✅ **Docker Containerization** with multi-stage builds
- ✅ **CI/CD Pipeline** with GitHub Actions
- ✅ **Unit & Integration Tests** with Jest
- ✅ **Error Handling** with custom middleware
- ✅ **Security Headers** with Helmet
- ✅ **CORS** configuration
- ✅ **Production-Ready** deployment on Render

## Tech Stack

| Category             | Technology               |
| -------------------- | ------------------------ |
| **Runtime**          | Node.js 20               |
| **Framework**        | Express.js 5             |
| **Language**         | TypeScript               |
| **Logging**          | Pino                     |
| **Metrics**          | Prometheus (prom-client) |
| **Testing**          | Jest + Supertest         |
| **Containerization** | Docker (Multi-stage)     |
| **CI/CD**            | GitHub Actions           |
| **Deployment**       | Render                   |
| **Security**         | Helmet, CORS             |

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Docker (optional, for containerization)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/maryokafor28/deployhub-backend.git
   cd deployhub-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   ```env
   NODE_ENV=development
   PORT=4000
   LOG_LEVEL=info
   ```

5. **Run in development mode**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Docker Setup

### Build Docker Image

```bash
docker build -t deployhub-backend .
```

### Run Docker Container

```bash
docker run -p 4001:4000 \
  -e NODE_ENV="production" \
  -e PORT="4000" \
  --name deployhub-api \
  deployhub-backend
```

### Docker Compose (Optional)

```yaml
version: "3.8"
services:
  backend:
    build: .
    ports:
      - "4001:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
```

Run with: `docker-compose up`

## API Documentation

### Base URL

```
Production: https://deployhub-backend-s6p2.onrender.com
Local: http://localhost:4000
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Structure

- **Unit Tests:** Testing individual functions and modules
- **Integration Tests:** Testing API endpoints end-to-end

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline automatically:

1. ✅ **Lints** code on every push/PR
2. ✅ **Runs tests** with coverage reporting
3. ✅ **Builds** TypeScript to JavaScript
4. ✅ **Builds** Docker image
5. ✅ **Deploys** to Render on push to `main`

### Workflow File

Located at `.github/workflows/ci.yml`

### Triggers

- Push to `main` branch
- Pull requests to `main` branch

### View Pipeline Status

Check the [Actions tab](https://github.com/maryokafor28/deployhub-backend/actions) in the repository.

## Observability

### 1. Structured Logging (Pino)

**Features:**

- JSON-formatted logs
- Different log levels (debug, info, warn, error)
- Request/response logging
- Performance optimized

````

### 2. Metrics (Prometheus)

**Tracked Metrics:**
- HTTP request duration (histogram)
- HTTP request count by status code
- Active connections
- Process uptime
- Memory usage
- CPU usage

**Access Metrics:**
```bash
curl https://deployhub-backend-s6p2.onrender.com/metrics
````

### 3. Health Monitoring

The `/api/health` endpoint provides:

- Service status
- Uptime
- Timestamp
- Environment info

**Usage in monitoring tools:**

```bash
# Automated health checks
*/5 * * * * curl -f https://deployhub-backend-s6p2.onrender.com/api/health || alert
```

## Deployment

### Render Configuration

**Build Command:**

```bash
npm install --include=dev && npm run build
```

**Start Command:**

```bash
npm start
```

**Environment Variables:**

```
NODE_ENV=production
PORT=4000
LOG_LEVEL=info
```
