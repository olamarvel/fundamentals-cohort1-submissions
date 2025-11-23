import express from 'express';
import { startLegacyMock } from './legacyMock.js';
import { paymentsRouter } from './routes/v2Payment.js';
import { customersRouter } from './routes/v2Customer.js';

const LEGACY_PORT = 4001;
const API_PORT = 4000;

// Start the legacy mock server
startLegacyMock(LEGACY_PORT);

// Base URL for legacy API
const legacyBaseUrl = `http://localhost:${LEGACY_PORT}`;

// Start our Node.js API
const app = express();
app.use(express.json());

// Mount v2 routes
app.use('/v2/payments', paymentsRouter(legacyBaseUrl));
app.use('/v2/customers', customersRouter(legacyBaseUrl));

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(API_PORT, () => {
  console.log(`API server running at http://localhost:${API_PORT}`);
  console.log(`v2/payments -> http://localhost:${API_PORT}/v2/payments`);
  console.log(`v2/customers -> http://localhost:${API_PORT}/v2/customers`);
});
