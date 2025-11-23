// src/legacy-mock.ts
import express from 'express';

export function startLegacyMock(port = 4001) {
  const app = express();
  app.use(express.json());

  // Fake legacy payments
  app.get('/legacy/payments', (_, res) => {
    res.json([
      { id: 1, acct_no: 'ACC-001', amount_cents: 125000, status_code: 1, created_at: '2024-10-01T08:00:00Z' },
      { id: 2, acct_no: 'ACC-002', amount_cents: 4500, status_code: 2, created_at: '2024-10-02T12:00:00Z' }
    ]);
  });

  // Fake legacy customers
  app.get('/legacy/customers', (_, res) => {
    res.json([
      { cid: 'C001', name: 'Alice Johnson', phone: '080111222', created_on: '2023-05-01' },
      { cid: 'C002', name: 'Bob Samuel', phone: '080333444', created_on: '2023-07-01' }
    ]);
  });

  // Unstable legacy endpoint
  let fail = false;
  app.get('/legacy/unstable', (_, res) => {
    fail = !fail;
    fail ? res.status(500).json({ error: 'temporary error' }) : res.json({ ok: true });
  });

  const server = app.listen(port, () => {
    console.log(`Legacy mock running at http://localhost:${port}`);
  });

  return server;
}
