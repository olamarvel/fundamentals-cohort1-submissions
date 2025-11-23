# DeployHub Backend API

A Node.js + TypeScript backend simulating a **microservice observability platform**.
Provides CRUD for services, health checks, metrics for monitoring, and structured logging. Designed for **CI/CD + Docker deployment**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Setup & Installation](#setup--installation)
- [Running Locally](#running-locally)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Observability](#observability)
- [Deployment](#deployment)

---

## Features

- CRUD endpoints for microservices
- Health check (`/api/health`)
- Prometheus metrics (`/metrics`)
- Structured logging with Winston
- CI/CD ready via GitHub Actions
- Dockerized for consistent deployment
- TypeScript-based

---

## Tech Stack

- Node.js 20
- TypeScript
- Express
- MongoDB (Atlas / local)
- Mongoose
- Winston (logging)
- prom-client (metrics)
- Jest + Supertest (testing)
- Docker + Docker Compose
- GitHub Actions (CI/CD)

---

## Requirements

- Node.js v20+
- npm v9+
- Docker (optional, for containerized run)
- MongoDB instance (local or cloud)

---

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/deployhub-backend.git
cd deployhub-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in project root:

```env
PORT=8080
MONGO_URI=mongodb://<username>:<password>@cluster.mongodb.net/deployhub
```

> Note: For Docker Compose setup, `MONGO_URI` may point to `mongodb://mongodb:27017/deployhub`.

---

## Running Locally

**Development Mode (hot reload):**

```bash
npm run dev
```

**Production Mode (built JS):**

```bash
npm run build
npm start
```

- Health check: `http://localhost:8080/api/health`
- Metrics: `http://localhost:8080/metrics`

---

## Docker Setup

### Using Docker

1. Build the image:

```bash
docker build -t deployhub-backend .
```

2. Run container:

```bash
docker run --env-file .env -p 8080:8080 deployhub-backend
```

### Using Docker Compose (recommended for MongoDB)

```yaml
version: "3.8"
services:
  backend:
    build: .
    ports:
      - "8081:8080"
    env_file: .env
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://mongodb:27017/deployhub
    command: ["npm", "run", "start"]

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run with:

```bash
docker compose up --build
```

---

## Environment Variables

| Variable    | Description                         |
| ----------- | ----------------------------------- |
| `PORT`      | Backend server port (default: 8080) |
| `MONGO_URI` | MongoDB connection URI              |

---

## API Endpoints

| Endpoint              | Method | Description                       |
| --------------------- | ------ | --------------------------------- |
| `/api/services`       | GET    | List all registered microservices |
| `/api/services`       | POST   | Add a new microservice            |
| `/api/services/:name` | PUT    | Update microservice info          |
| `/api/services/:name` | DELETE | Delete a microservice             |
| `/api/health`         | GET    | Backend health status & version   |
| `/metrics`            | GET    | Prometheus-formatted metrics      |

**Example `POST /api/services` body:**

```json
{
  "name": "Auth Service",
  "url": "http://localhost:3000",
  "version": "1.0.0"
}
```

[**API documentation**](https://documenter.getpostman.com/view/49262917/2sB3WvNeDN)

---

## Testing

Run tests locally:

```bash
npm test
```

Tests include:

- Health endpoint test
- CRUD integration tests for services
- Runs on **in-memory MongoDB** to avoid touching production DB

---

## CI/CD

- GitHub Actions workflow handles:

  - Linting (`npm run lint`)
  - Tests (`npm test`)
  - TypeScript build (`npm run build`)
  - Docker build + push
  - Deployment (Render )

**Secrets required:**

- `DOCKER_USERNAME` / `DOCKER_PASSWORD`
- `RENDER_API_KEY`

---

## Observability

- **Structured logging:** via Winston
- **Metrics:** via `/metrics` (Prometheus format)
- **Health:** `/api/health` (uptime, version, status)
- Logs every API request/response
- Metrics include request duration, error counts, and memory/CPU stats

---

## Deployment

- Deployed to Render:

```
Backend URL: https://deployhub-backend-9aas.onrender.com/api
```

- Connect frontend (React-Vite) to this backend for full observability dashboard.
