const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = {
  // Users
  async getUsers() {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  async getUserById(id: number) {
    const res = await fetch(`${API_URL}/users/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  async createUser(data: { name: string; email: string }) {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  // Transactions
  async getTransactions(userId: number) {
    const res = await fetch(`${API_URL}/transactions/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  async createTransaction(data: {
    userId: number;
    amount: number;
    currency?: string;
    status?: string;
  }) {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },
};
