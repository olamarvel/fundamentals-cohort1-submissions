import api from "./client";

export async function listTransactions(partner: string, page = 1, limit = 10) {
  const { data } = await api.get("/transactions", {
    params: { partner, page, limit },
  });
  return data;
}

export async function createTransaction(payload: any) {
  const { data } = await api.post("/transactions", payload);
  return data;
}
