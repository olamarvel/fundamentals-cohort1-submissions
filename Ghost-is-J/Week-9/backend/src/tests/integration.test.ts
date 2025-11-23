import request from 'supertest';
import nock from 'nock';
import app from '../app';
import {LEGACY_API_URL} from '../config';


describe('integration /v2 endpoints', () => {
afterEach(() => nock.cleanAll());


it('GET /v2/payments returns transformed data and respects cache flag', async () => {
const legacyPayments = [
{payment_id: 'p1', amount_cents: 1000, status: 'SUCCEEDED', created_at: '2024-01-01T00:00:00Z'}
];


nock(LEGACY_API_URL).get('/payments').reply(200, legacyPayments);


const res1 = await request(app).get('/v2/payments');
expect(res1.status).toBe(200);
expect(res1.body.data).toBeDefined();
expect(res1.body.cached).toBe(false);
expect(res1.body.data[0].amount).toBe(10);


// second call: legacy won't be called because cache exists. Nock will fail if called
const res2 = await request(app).get('/v2/payments');
expect(res2.status).toBe(200);
expect(res2.body.cached).toBe(true);
});


it('GET /v2/customers returns transformed customers', async () => {
const legacyCustomers = [{customer_id: 'c1', first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com'}];
nock(LEGACY_API_URL).get('/customers').reply(200, legacyCustomers);


const res = await request(app).get('/v2/customers');
expect(res.status).toBe(200);
expect(res.body.data[0].name).toContain('Jane');
});
});