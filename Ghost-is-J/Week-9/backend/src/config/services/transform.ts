export function transformPayment(legacyPayment: any) {
const amountCents = legacyPayment.amount_cents ?? legacyPayment.amount ?? null;
const createdAt = legacyPayment.created_at ?? legacyPayment.timestamp ?? null;


return {
id: legacyPayment.payment_id ?? legacyPayment.id ?? null,
amount: amountCents != null ? Number(amountCents) / 100 : null,
currency: legacyPayment.currency ?? 'USD',
status: mapStatus(legacyPayment.status),
createdAt: createdAt ? new Date(createdAt).toISOString() : null,
legacy: { raw: legacyPayment }
};
}


function mapStatus(s: any) {
if (!s) return 'unknown';
const str = String(s).toLowerCase();
if (str.includes('succ')) return 'success';
if (str.includes('fail')) return 'failed';
if (str.includes('pend')) return 'pending';
return 'unknown';
}


export function transformPayments(legacyArray: any[]) {
return legacyArray.map(transformPayment);
}


export function transformCustomer(legacy: any) {
return {
id: legacy.customer_id ?? legacy.id ?? null,
name: legacy.name ?? `${legacy.first_name ?? ''} ${legacy.last_name ?? ''}`.trim(),
email: legacy.email ?? null,
createdAt: legacy.created_at ? new Date(legacy.created_at).toISOString() : null,
legacy: { raw: legacy }
};
}


export function transformCustomers(arr: any[]) {
return arr.map(transformCustomer);
}