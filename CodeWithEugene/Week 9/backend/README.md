# LegacyBridge Backend

A Node.js (Express) integration service that bridges legacy systems with modern APIs. This service consumes data from legacy APIs, transforms it into a modern format, and exposes it through versioned RESTful endpoints.

## 🚀 Features

- **Legacy API Integration**: Consumes data from JSONPlaceholder (simulating legacy PHP system)
- **Data Transformation**: Transforms legacy data structures into modern, user-friendly formats
- **API Versioning**: Supports multiple API versions (v1, v2) with middleware validation
- **Caching**: In-memory caching using node-cache for improved performance
- **Retry Logic**: Exponential backoff retry mechanism for resilient API calls
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **TypeScript**: Fully typed codebase for better maintainability
- **Testing**: Unit and integration tests with Jest

## 📋 Prerequisites

- Node.js >= 18.17.0
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legacybridge-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   LEGACY_API_BASE_URL=https://jsonplaceholder.typicode.com
   CACHE_TTL=300
   MAX_RETRIES=3
   RETRY_DELAY_MS=1000
   API_TIMEOUT_MS=5000
   ```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### V2 Endpoints

#### Customers
- `GET /api/v2/customers` - Get all customers
- `GET /api/v2/customers/:id` - Get customer by ID

#### Payments
- `GET /api/v2/payments` - Get all payments
- `GET /api/v2/payments?status=completed` - Filter payments by status
- `GET /api/v2/payments/:id` - Get payment by ID
- `GET /api/v2/customers/:customerId/payments` - Get payments for a customer

### API Versioning

Specify the API version using:
- Header: `api-version: v2`
- Query parameter: `?version=v2`

## 📊 API Flow Diagram

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       │ (with api-version header)
       ▼
┌─────────────────────────────────┐
│   LegacyBridge Backend          │
│   (Express + TypeScript)       │
└──────┬──────────────────────────┘
       │
       ├──► Versioning Middleware
       │    (validates API version)
       │
       ├──► Route Handler
       │    (/v2/customers, /v2/payments)
       │
       ├──► Cache Check
       │    (in-memory cache)
       │
       │    ┌─────────────┐
       │    │   Cache    │
       │    │   Hit?     │
       │    └─────┬───────┘
       │          │
       │    Yes   │   No
       │    │     │     │
       │    │     │     ▼
       │    │     │  ┌──────────────────────┐
       │    │     │  │ Legacy API Service   │
       │    │     │  │ (with retry logic)   │
       │    │     │  └──────┬───────────────┘
       │    │     │         │
       │    │     │         │ HTTP Request
       │    │     │         │ (with timeout)
       │    │     │         ▼
       │    │     │  ┌──────────────────────┐
       │    │     │  │  Legacy API          │
       │    │     │  │  (JSONPlaceholder)   │
       │    │     │  └──────┬───────────────┘
       │    │     │         │
       │    │     │         │ Response
       │    │     │         │ (or retry on error)
       │    │     │         ▼
       │    │     │  ┌──────────────────────┐
       │    │     │  │ Transformation       │
       │    │     │  │ Service              │
       │    │     │  │ (legacy → modern)    │
       │    │     │  └──────┬───────────────┘
       │    │     │         │
       │    │     │         │ Store in cache
       │    │     │         ▼
       │    │     └─────────┘
       │    │
       │    └──► Response
       │         (transformed data)
       │
       ▼
┌─────────────┐
│   Client    │
│  (Frontend) │
└─────────────┘
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment configuration
│   ├── controllers/
│   │   └── v2.controller.ts       # V2 API controllers
│   ├── middleware/
│   │   ├── error-handler.middleware.ts
│   │   └── versioning.middleware.ts
│   ├── routes/
│   │   ├── v2.routes.ts           # V2 API routes
│   │   └── index.ts                # Route aggregator
│   ├── services/
│   │   ├── cache.service.ts       # Caching service
│   │   ├── legacy-api.service.ts  # Legacy API integration
│   │   └── transformation.service.ts # Data transformation
│   └── server.ts                   # Express app entry point
├── tests/
│   ├── cache.service.test.ts
│   ├── integration.test.ts
│   ├── legacy-api.service.test.ts
│   └── transformation.service.test.ts
├── .env.example
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Data Transformation

### Legacy User → Modern Customer

**Legacy Format:**
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001"
  },
  "phone": "555-1234",
  "company": {
    "name": "Acme Corp"
  }
}
```

**Modern Format (v2):**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "contactInfo": {
    "phone": "555-1234",
    "address": "123 Main St, New York, 10001"
  },
  "company": "Acme Corp",
  "registrationDate": "2024-01-01T00:00:00Z",
  "status": "active"
}
```

## 🛡️ Error Handling

The service implements comprehensive error handling:

- **400 Bad Request**: Invalid input parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors
- **502 Bad Gateway**: Legacy API errors

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "timestamp": "2024-01-01T00:00:00Z",
    "path": "/api/v2/customers/999"
  }
}
```

## 📦 Postman Collection

Import the `LegacyBridge-API.postman_collection.json` file into Postman to test all endpoints.

## 🚢 Deployment

### Environment Variables for Production

```env
PORT=3000
NODE_ENV=production
LEGACY_API_BASE_URL=https://jsonplaceholder.typicode.com
CACHE_TTL=600
MAX_RETRIES=3
RETRY_DELAY_MS=1000
API_TIMEOUT_MS=5000
```

### Deployment Platforms

- **Render**: Connect your GitHub repository and deploy
- **Railway**: Push to Railway for automatic deployment
- **Heroku**: Use the Node.js buildpack

### Build for Production

```bash
npm run build
npm start
```

## 📈 Performance Considerations

- **Caching**: Responses are cached for 5 minutes (configurable)
- **Retry Logic**: Failed requests are retried up to 3 times with exponential backoff
- **Timeout**: API requests timeout after 5 seconds to prevent hanging

## 🔒 Security

- **Helmet**: Security headers middleware
- **CORS**: Configurable CORS policy
- **Input Validation**: All inputs are validated before processing

## 📝 License

MIT

## 👥 Contributors

LegacyBridge Team


