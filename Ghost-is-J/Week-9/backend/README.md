legacybridge-backend (starter)


This repository is a starter scaffold for the Week 9 challenge: "Integrating Legacy Systems". It implements a Node.js + TypeScript integration service that consumes a mock legacy API, transforms data, caches results, and exposes versioned endpoints (`/v2/*`).


## What this scaffold includes


- TypeScript + Express server
- Legacy client using `axios` + `axios-retry` with timeouts and retries
- Transform layer to map legacy payloads to modern shapes
- Simple in-memory cache (swap for Redis by adding implementation)
- Example unit tests (transform) and integration tests (with `nock`)
- Postman collection skeleton


## Quick start (local)


1. Copy files into a new folder and run:


```bash
cp .env.example .env
npm install
npm run dev
```


2. By default the server runs on `http://localhost:3000`. Set `LEGACY_API_URL` to a mock server (example: run a simple Express mock on port 4000 or use JSONPlaceholder with adapted endpoints).


3. Run tests:


```bash
npm test
```


## Notes and next steps


- To enable Redis-based caching, replace `src/services/cache.ts` with an implementation that uses `ioredis` and set `USE_REDIS=true` and `REDIS_URL`.
- Add Postman examples with sample responses and publish documentation.
- Add CI (GitHub Actions) to run tests and produce coverage report.
- Consider adding request validation, rate limiting, and observability (metrics/logging).