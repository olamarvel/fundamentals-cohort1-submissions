"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "../../hooks/useUsers";
import { useTransactions } from "../../hooks/useTransactions";

export default function TransactionsPage() {
  const router = useRouter();
  const { users } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { transactions, loading, error, createTransaction, isConnected } =
    useTransactions(selectedUserId);

  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    status: "pending",
  });
  const [creating, setCreating] = useState(false);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setCreating(true);
    const success = await createTransaction({
      userId: selectedUserId,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      status: formData.status,
    });

    if (success) {
      setFormData({ amount: "", currency: "USD", status: "pending" });
    }
    setCreating(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        Back to Home
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-sm text-gray-600">
            {isConnected ? "WebSocket Connected" : "WebSocket Disconnected"}
          </span>
        </div>
      </div>

      {/* User Selection */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Select User</h2>
        <select
          value={selectedUserId || ""}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <>
          {/* Create Transaction Form */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Create New Transaction
            </h2>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                className="w-full p-2 border rounded"
              />
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="NGN">NGN</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {creating ? "Creating..." : "Create Transaction"}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Transactions List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            {loading ? (
              <p className="text-gray-500">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500">No transactions found</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-2xl font-bold">
                          {tx.currency} {tx.amount}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ref: {tx.reference || "N/A"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : tx.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
