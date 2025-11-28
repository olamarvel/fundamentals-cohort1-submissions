# LegacyBridge Backend

A Node.js integration service that bridges legacy systems with modern APIs, providing data transformation, caching, and reliable communication between old and new systems.

## Features

- **Legacy API Integration**: Consumes data from legacy systems (JSONPlaceholder mock)
- **Data Transformation**: Converts legacy data formats to modern API standards
- **Caching Layer**: In-memory caching with configurable TTL for improved performance
- **Error Handling**: Comprehensive error handling with retry logic and graceful degradation
- **API Versioning**: RESTful API with v2 endpoints for backward compatibility
- **Rate Limiting**: Built-in rate limiting to protect against abuse
- **Health Monitoring**: Health check endpoints for system monitoring
- **TypeScript**: Full TypeScript implementation for type safety

## API Endpoints

### Payments
- `GET /api/v2/payments` - List all payments with pagination and filtering
- `GET /api/v2/payments/:id` - Get specific payment by ID
- `GET /api/v2/payments/stats` - Get payment statistics

### Customers
- `GET /api/v2/customers` - List all customers with pagination and search
- `GET /api/v2/customers/:id` - Get specific customer by ID
- `GET /api/v2/customers/stats` - Get customer statistics

### System
- `GET /api/v2/health` - Health check endpoint
- `GET /` - API information and available endpoints

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Environment Variables

See `.env.example` for all available configuration options.

## Architecture

The service follows a layered architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and external API integration
- **Utils**: Shared utilities (caching, retry logic, transformers)
- **Middleware**: Error handling, validation, and request processing
- **Types**: TypeScript type definitions

## Testing

Run the test suite:
```bash
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

## Deployment

The application is ready for deployment on platforms like Render, Railway, or Heroku. Make sure to set the appropriate environment variables in your deployment platform.
