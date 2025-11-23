

# DeployHub — PulseTrack: Health Monitoring Backend

Short version: this repo is DeployHub, a backend that now includes the PulseTrack health monitoring features plus extra observability and CI/CD goodness. Health and metrics endpoints are implemented, Prometheus is wired up, tests and CI are configured, and Docker-based deployment is supported.

---

## Table of contents

* [Project Overview](#project-overview)
* [New features in this branch](#new-features-in-this-branch)
* [Health check - implementation details](#health-check---implementation-details)
* [Metrics - Prometheus](#metrics---prometheus)
* [Technology stack](#technology-stack)
* [Database schema design](#database-schema-design)
* [API documentation](#api-documentation)
* [Testing strategy](#testing-strategy)
* [Quick dev commands](#quick-dev-commands)
* [Setup and installation](#setup-and-installation)
* [CI/CD and deployment](#cicd-and-deployment)
* [Usage](#usage)

---

## Project overview

DeployHub is the backend service in this project. It also serves the PulseTrack project build previously responsibilities: user auth, activities, doctors, appointments, and health monitoring. This branch focuses on observability, reliability, and developer workflows while keeping the PulseTrack features intact.

Backend (this service): [https://deployhub-iudq.onrender.com](https://deployhub-iudq.onrender.com)

---

## New features in this branch

This backend version includes the observability and logging features required by the task, plus the existing PulseTrack API functionality.

* Health check endpoint: `GET /health`
* Prometheus metrics endpoint: `GET /metrics` (using `prom-client`)
* Default Prometheus metrics collected (process, heap, event loop lag)
* Custom metrics for API latency and request counters
* CI pipeline that runs tests and builds Docker images
* Dockerfile for containerized deployment

---

## Health check - implementation details

**Route**

```
GET /health-check
```

**Response example**

```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2025-11-14T10:00:00.000Z",
  "version": "1.0.0",
}
```


---

## Metrics - Prometheus

This backend exposes Prometheus metrics on `/metrics` using the `prom-client` package.

Setup:

* Install the package:

```bash
npm install prom-client
```

* What we collect:

  * Default process metrics: memory, CPU, event loop lag, heap usage
  * Custom counters: total requests, error counts
  * Custom histograms: API latency for main routes

**Metrics endpoint**

```
GET /metrics
```

The `/metrics` endpoint returns the text exposition format that Prometheus scrapes. Example usage in Prometheus scrape config:

```yaml
scrape_configs:
  - job_name: 'deployhub'
    static_configs:
      - targets: ['deployhub-iudq.onrender.com:80']
```

---

## Technology stack

Backend

* Node.js, Express
* MongoDB with Mongoose
* Authentication: JSON Web Tokens (access + refresh)
* Observability: prom-client for Prometheus
* Validation: express-validator
* Env management: dotenv

Frontend (separate repo)

* React, vite
* TypeScript
* Tailwind CSS
* Axios for API calls
* Swiper.js for carousels

---

## Database schema design

Core models and relationships:

* User

  * `activities: [ObjectId]` ref: 'Activity'
  * `appointments: [ObjectId]` ref: 'Appointment'
* Activity

  * `user: ObjectId` ref: 'User'
* Doctor

  * Standalone entity, associated to appointments
* Appointment

  * `user: ObjectId` ref: 'User'
  * `doctor: ObjectId` ref: 'Doctor'

Appointments link users and doctors, enabling queries like: which doctors has a user interacted with, and which users are associated with a doctor.

---

## API documentation

A Postman collection with the API requests is included in the backend repo as `postman_collection.json`. There is also live Postman documentation:

* Postman doc: [https://documenter.getpostman.com/view/49353777/2sB3Wjz43p](https://documenter.getpostman.com/view/49353777/2sB3Wjz43p)

How to use:

1. Import `postman_collection.json` into Postman, or open the live doc link.
2. Create a Postman environment and set `baseUrl` to your backend URL, e.g. `http://localhost:5000` or `https://deployhub-iudq.onrender.com`.
3. Run the "Login User" request to capture JWTs and use protected routes.

Key endpoints (not exhaustive)

* `POST /auth/register` - register user
* `POST /auth/login` - login
* `POST /auth/refresh` - refresh access token
* `GET /activities` - list activities (protected)
* `POST /activities` - create activity (protected)
* `GET /doctors` - list doctors
* `POST /doctors` - add doctor (protected)
* `GET /appointments` - list appointments (protected)
* `POST /appointments` - schedule appointment (protected)
* `GET /health-check` - health check
* `GET /metrics` - Prometheus metrics

---

## Testing strategy

We follow a layered test strategy described below. CI runs tests on every push and PR.

1. Unit tests

   * Fast, isolated tests of utilities and controllers
   * Jest, with dependencies mocked where appropriate
2. Integration tests

   * Tests that exercise router -> controller -> model flows
   * Jest + Supertest
   * Use a dedicated test DB: `mongodb://127.0.0.1:27017/pulse_test`
   * Reset DB between tests
3. E2E workflow tests

   * Simulate a user flow: register, login, create appointment, fetch appointment
4. Coverage

   * `npm run test:coverage` produces a `coverage/` folder and HTML report
   * Target: 80% coverage as a minimum goal, but focus on confidence and critical path coverage

CI details:

* GitHub Actions pipeline is present in `.github/workflows/ci-cd.yml`
* Steps: setup Node, start MongoDB service, install deps, run tests

---

## Quick dev commands

* `npm run dev` - start dev server (nodemon or equivalent)
* `npm run test` - run tests
* `npm run test:coverage` - run tests and generate coverage
* `npm run lint` - run linter
* `npm run start` - start production server

---

## Setup and installation

### Backend

Prerequisites

* Node.js v18 or later recommended
* MongoDB (local or Atlas)

Steps

```bash
cd deployhub-backend
npm install
```

Create `.env` with at least:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
```

Start dev server

```bash
npm run dev
```

API should be available at `http://localhost:5000` by default.

### Frontend

Frontend is a separate repo. To run locally:

```bash
git clone
cd deployhub-frontend
npm install
```

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend

```bash
npm run dev
```

Frontend should be available at `http://localhost:3000`.

---

## CI/CD and deployment

This project uses GitHub Actions and Docker.

* CI workflow runs on push and PR, runs test suite, and builds artifacts.
* Dockerfile is included for container builds.
* Actions push Docker images to your registry as part of deploy steps if configured.
* The project is already deployed at: [https://deployhub-iudq.onrender.com](https://deployhub-iudq.onrender.com)

If you want to deploy to another environment, update the GitHub Actions workflow and set repository secrets for your container registry credentials and environment variables.

---

## Usage

1. Ensure backend and (optionally) frontend are running.
2. Register a user via API or frontend.
3. Login and exercise Activities, Doctors, and Appointment endpoints.
4. Check `/health` for quick liveness/readiness.
5. Point Prometheus to `/metrics` to start scraping metrics.
6. Use Postman collection for testing and exploring endpoints.
