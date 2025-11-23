# LegacyBridge Backend

A Node.js Express API that serves as a bridge between modern clients and legacy payment/customer systems. It provides two API versions: v1 (direct passthrough) and v2 (with transformation and caching).

## Features

- **Dual API Versions**: v1 for raw legacy data, v2 for transformed and cached data
- **Data Transformation**: Converts legacy format to modern API standards
- **Caching Layer**: In-memory caching with configurable TTL to reduce legacy system load
- **Retry Logic**: Automatic retry on failed requests to legacy systems
- **Mock Legacy Server**: Built-in mock server for development and testing
- **CORS Enabled**: Ready for cross-origin requests from frontend clients

## Architecture

### API Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│     Express Server (Port 4000)      │
│  ┌───────────────────────────────┐  │
│  │      CORS Middleware          │  │
│  └───────────────┬───────────────┘  │
│                  │                   │
│  ┌───────────────▼───────────────┐  │
│  │      Route Handler            │  │
│  │   /v1/* or /v2/*              │  │
│  └───────────────┬───────────────┘  │
│                  │                   │
└──────────────────┼───────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐          ┌─────────┐
   │   v1    │          │   v2    │
   │ Routes  │          │ Routes  │
   └────┬────┘          └────┬────┘
        │                    │
        │                    │ Check Cache
        │                    ▼
        │             ┌──────────────┐
        │             │ Cache Layer  │
        │             │ (NodeCache)  │
        │             └──────┬───────┘
        │                    │
        │              Cache Miss
        │                    │
        └────────────┬───────┘
                     │
                     ▼
          ┌──────────────────┐
          │  Legacy Client   │
          │  (with p-retry)  │
          └─────────┬────────┘
                    │
                    │ HTTP Request
                    ▼
          ┌──────────────────┐
          │  Legacy API      │
          │  (Port 4001)     │
          │  - /payments     │
          │  - /customers    │
          └─────────┬────────┘
                    │
                    │ Raw Data
                    ▼
          ┌──────────────────┐
          │  Transform       │
          │  Service (v2)    │
          └─────────┬────────┘
                    │
                    │ Transformed Data
                    ▼
          ┌──────────────────┐
          │  Set Cache (v2)  │
          └─────────┬────────┘
                    │
                    │ JSON Response
                    ▼
          ┌──────────────────┐
          │     Client       │
          └──────────────────┘
```

## API Endpoints

### v1 API (Direct Passthrough)

#### GET `/v1/payments`

Returns raw payment data directly from the legacy system.

**Response:**

```json
[
  {
    "id": "p_100",
    "amt": 12345,
    "currency": "NGN",
    "status_code": 1,
    "payer": {
      "name": "Tunde",
      "account_id": "a_1"
    },
    "created_at": "2024-11-01T12:00:00Z"
  }
]
```

#### GET `/v1/customers`

Returns raw customer data directly from the legacy system.

**Response:**

```json
[
  {
    "cust_id": "c_1",
    "fullname": "Tunde A",
    "email": "tunde@example.com",
    "meta": {
      "signup": "2015"
    }
  }
]
```

### v2 API (Transformed + Cached)

#### GET `/v2/payments`

Returns transformed payment data with caching.

**Response:**

```json
{
  "fromCache": false,
  "data": [
    {
      "id": "p_100",
      "amount": 123.45,
      "currency": "NGN",
      "status": "SUCCESS",
      "payerName": "Tunde",
      "payerAccountId": "a_1",
      "createdAt": "2024-11-01T12:00:00Z"
    }
  ]
}
```

**Transformations:**

- `amt` → `amount` (converted from kobo to naira by dividing by 100)
- `status_code` → `status` (1 = SUCCESS, 2 = PENDING, other = FAILED)
- `payer` object flattened to `payerName` and `payerAccountId`
- `created_at` → `createdAt`

#### GET `/v2/customers`

Returns transformed customer data with caching.

**Response:**

```json
{
  "fromCache": false,
  "data": [
    {
      "id": "c_1",
      "name": "Tunde A",
      "email": "tunde@example.com",
      "joined": "2015"
    }
  ]
}
```

**Transformations:**

- `cust_id` → `id`
- `fullname` → `name`
- `meta.signup` → `joined`

## Setup Guide

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v10 or higher)

### Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pnpm install
```

### Configuration

The application uses environment variables for configuration. Create a `.env` file in the backend directory (optional):

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Legacy API Configuration
LEGACY_BASE=http://localhost:4001

# Cache Configuration
CACHE_TTL=60
```

**Environment Variables:**

| Variable      | Description                   | Default                 |
| ------------- | ----------------------------- | ----------------------- |
| `PORT`        | Port for the Express server   | `4000`                  |
| `NODE_ENV`    | Environment mode              | `development`           |
| `LEGACY_BASE` | Base URL for legacy API       | `http://localhost:4001` |
| `CACHE_TTL`   | Cache time-to-live in seconds | `60`                    |

### Running the Application

#### Development Mode

Start the server with hot-reload:

```bash
pnpm dev
```

This will:

- Start the Express server on port 4000
- Start the mock legacy API on port 4001 (in non-production mode)
- Enable automatic restart on file changes

#### Production Mode

```bash
NODE_ENV=production pnpm dev
```

Note: The mock legacy server will not start in production mode.

### Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main application entry point
│   ├── routes/
│   │   ├── v1/
│   │   │   └── index.ts       # v1 API routes (passthrough)
│   │   └── v2/
│   │       └── index.ts       # v2 API routes (transform + cache)
│   ├── services/
│   │   ├── cache.ts           # Caching service (NodeCache)
│   │   ├── legacy-client.ts   # Legacy API client with retry logic
│   │   └── transform.ts       # Data transformation functions
│   └── mock/
│       └── legacy-mock.ts     # Mock legacy API server
├── package.json
└── pnpm-lock.yaml
```

## Core Services

### Cache Service (`cache.ts`)

In-memory caching using `node-cache` with configurable TTL.

**Functions:**

- `getCached<T>(key: string)` - Retrieve cached data
- `setCached<T>(key, value)` - Store data in cache
- `delCached(key)` - Delete specific cache entry
- `flushCache()` - Clear all cache
- `cacheStats()` - Get cache statistics

### Legacy Client (`legacy-client.ts`)

HTTP client for legacy API with automatic retry logic using `p-retry`.

**Configuration:**

- 2 retry attempts on failure
- 4-second timeout per request
- Exponential backoff between retries

### Transform Service (`transform.ts`)

Functions to convert legacy data formats to modern API standards:

- `transformPayment(legacy)` - Transforms payment objects
- `transformCustomer(legacy)` - Transforms customer objects

## Error Handling

All endpoints implement proper error handling:

- **502 Bad Gateway**: Returned when the legacy service is unavailable or fails after retries
- **Error Logging**: All errors are logged to console with context
- **Graceful Degradation**: v1 and v2 APIs fail independently

## Development Features

### Mock Legacy Server

A built-in Express server that mimics the legacy API behavior for development:

- Runs on port 4001
- Provides sample payment and customer data
- Automatically starts in non-production environments

**Mock Endpoints:**

- `GET /legacy/payments` - Returns sample payment data
- `GET /legacy/customers` - Returns sample customer data

## Dependencies

### Production

- `express` - Web framework
- `cors` - CORS middleware
- `axios` - HTTP client
- `node-cache` - In-memory caching
- `p-retry` - Retry logic for failed requests
- `helmet` - Security headers

### Development

- `tsx` - TypeScript execution with hot-reload
- `typescript` - TypeScript compiler
- `@types/*` - Type definitions

## Testing the API

### Using curl

Test v1 payments:

```bash
curl http://localhost:4000/v1/payments
```

Test v2 payments (first request):

```bash
curl http://localhost:4000/v2/payments
```

Test v2 payments (cached):

```bash
curl http://localhost:4000/v2/payments
```

### Using a REST Client

Import into Postman, Insomnia, or similar:

**Base URL:** `http://localhost:4000`

**Endpoints:**

- GET `/v1/payments`
- GET `/v1/customers`
- GET `/v2/payments`
- GET `/v2/customers`

## Performance Considerations

- **Caching**: v2 endpoints cache responses for 60 seconds (configurable)
- **Retry Logic**: Failed requests retry twice with exponential backoff
- **Timeout**: 4-second timeout prevents hanging requests
- **Memory Usage**: NodeCache stores data in-memory; monitor usage in production

## Security

- CORS enabled for all origins (configure for production)
- Consider adding authentication middleware for production
- Use environment variables for sensitive configuration
- Consider rate limiting for production deployments
