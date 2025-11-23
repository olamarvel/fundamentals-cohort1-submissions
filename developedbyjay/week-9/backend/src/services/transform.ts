export function transformPayment(legacy: any) {

  return {
    id: legacy.id,
    amount: legacy.amt / 100,
    currency: legacy.currency,
    status:
      legacy.status_code === 1
        ? "SUCCESS"
        : legacy.status_code === 2
        ? "PENDING"
        : "FAILED",
    payerName: legacy.payer?.name ?? null,
    payerAccountId: legacy.payer?.account_id ?? null,
    createdAt: legacy.created_at,
  };
}

export function transformCustomer(legacy: any) {
  return {
    id: legacy.cust_id,
    name: legacy.fullname,
    email: legacy.email,
    joined: legacy.meta?.signup ?? null,
  };
}
