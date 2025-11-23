import {transformPayment, transformPayments} from '../services/transform';


describe('transformPayment', () => {
it('converts cents to decimal and maps success status', () => {
const legacy = {payment_id: 'p1', amount_cents: 12345, status: 'SUCCEEDED', created_at: '2024-01-01T00:00:00Z'};
const out = transformPayment(legacy);
expect(out.amount).toBeCloseTo(123.45);
expect(out.status).toBe('success');
expect(out.id).toBe('p1');
});


it('handles missing fields gracefully', () => {
const legacy = { id: 'x' };
const out = transformPayment(legacy as any);
expect(out.id).toBe('x');
expect(out.amount).toBeNull();
expect(out.status).toBe('unknown');
});
});


describe('transformPayments', () => {
it('maps arrays', () => {
const items = [{payment_id: 'a', amount_cents: 100}, {payment_id: 'b', amount_cents: 250}];
const out = transformPayments(items as any[]);
expect(out).toHaveLength(2);
expect(out[0].amount).toBe(1);
expect(out[1].amount).toBe(2.5);
});
});