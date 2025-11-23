# deployhub-frontend

This repository contains a TypeScript React (Vite) frontend for the DeployHub Week 8 challenge: a CI/CD + Observability demo that consumes a backend `/api/health` endpoint and displays health, response time, and basic observability information.

What's included

- Vite + React + TypeScript app (in `src/`)
- Simple structured logging utility that emits JSON to the browser console
- Health UI that polls a backend health endpoint (configurable via VITE_BACKEND_URL)
- Dockerfile for containerizing the built frontend
- GitHub Actions workflow (`.github/workflows/ci.yml`) that runs typecheck, lint, tests, and build

Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
VITE_BACKEND_URL=http://localhost:4000 npm run dev
```

3. Build for production

```bash
npm run build
npm run preview
```

How it works

- The app polls `VITE_BACKEND_URL` + `/api/health` every 10s and displays status, version (if present), uptime and last response time.
- Structured logs are emitted to the browser console in JSON format (see `src/logger.ts`).

CI / CD

- There's a GitHub Actions workflow that runs on pushes and PRs to `main`. It executes type checking, lint, tests, and build. Deploy steps can be added (Vercel/Netlify/Render) or you can rely on platform integrations.

Notes and next steps

- Replace the placeholder backend URL with your deployed backend (e.g., Render/Railway) by setting `VITE_BACKEND_URL` in your environment or CI/CD provider.
- Observability improvements: add a real log forwarder or integrate RUM metrics (e.g., OpenTelemetry JS, Sentry, or Logflare) for production telemetry.

License: MIT
