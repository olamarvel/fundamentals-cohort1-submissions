# LegacyBridge Backend

Modern integration layer bridging an old PHP monolith with clean, performant Node.js microservices.

## Features

- Real legacy simulation (slow, not mordern endpoints)
- Smart data transformation
- In-memory caching
- Retry logic + timeout handling
- API versioning (`/api/v2`)
- High test coverage + resilience testing

## Architecture Flow

Client => /api/v2/\* => LegacyService => axios-retry => Legacy Mock (port 4000) => JSON files
↑ ↓
Cache (node-cache) ← on failure → serve stale

## Endpoints

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/health`           | Health check              |
| GET    | `/api/v2/customers` | Transformed customer data |
| GET    | `/api/v2/payments`  | Payments                  |

## Setup

```bash
# 1. Start legacy mock (old PHP system)
npm run legacy


# 2. In another terminal - start bridge
npm run dev
```

## Scripts

- `npm run legacy` → starts mock legacy server
- `npm run dev` → hot-reload bridge
- `npm test` -- --coverage → run tests

## Deployed URL

### Final Step: Deploy Backend (Takes 5 mins)

Go to [https://railway.app](https://railway.app) or [render.com](https://render.com)

1. New Service → GitHub → legacybridge-backend
2. Add Environment Variable:
   - Key: `LEGACY_API_BASE_URL`
   - Value: `http://localhost:4000` → NO! We need to deploy the legacy mock too?

**Better idea**: Combine both into one service for deployment!

Update `legacy-mock-server.ts` → change port to dynamic:

```ts
const PORT = process.env.PORT || 4000;
Then in Railway/Render:

Deploy the repo
Set PORT=3000
Your main app runs on 3000
Legacy mock is available internally (but we’ll change base URL)

Best fix: Change .env in production to point to same server
```
