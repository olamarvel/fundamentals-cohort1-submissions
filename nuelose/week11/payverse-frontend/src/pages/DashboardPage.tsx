import { useState, useEffect } from "react";
import api from "../lib/api";
import { LogOut, Send, RefreshCw } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface Payment {
  id: string;
  amount: number;
  currency: "NGN" | "GHS" | "KES";
  status: string;
  createdAt: string;
  sender: { name: string | null; email: string } | null; 
  receiverEmail: string;
}

interface DashboardData {
  sent: Payment[];
  received: Payment[];
  summary: {
    totalSent: number;
    totalReceived: number;
  };
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

const currencies: Array<"NGN" | "GHS" | "KES"> = ["NGN", "GHS", "KES"];

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      setData(res.data);
      setSendError("");
    } catch (error) {
        console.log(error)
      alert("Session expired. Please log in again.");
      onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSendError("");

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const currency = formData.get("currency") as "NGN" | "GHS" | "KES";
    const receiverEmail = formData.get("receiverEmail") as string;

    try {
      await api.post("/payments", { amount, currency, receiverEmail });
      fetchPayments();
      e.currentTarget.reset();
    } catch (error: any) {
      setSendError(error.response?.data?.error || "Failed to send money");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const allTransactions = [
    ...(data?.sent || []),
    ...(data?.received || []),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {user.name || user.email.split("@")[0]}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Send money instantly across Africa
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Send Money Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Money</h2>
        <form
          onSubmit={handleSendMoney}
          className="grid grid-cols-1 md:grid-cols-4 gap-5"
        >
          <input
            name="receiverEmail"
            type="email"
            placeholder="receiver@example.com"
            required
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Amount"
            required
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="currency"
            required
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select currency
            </option>
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c === "NGN"
                  ? "₦ Naira"
                  : c === "GHS"
                  ? "₵ Cedi"
                  : "KSh Shilling"}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={sending}
            className="bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-70 transition flex items-center justify-center gap-2"
          >
            <Send size={22} />
            {sending ? "Sending..." : "Send Money"}
          </button>
        </form>
        {sendError && (
          <p className="mt-5 text-red-600 font-medium bg-red-50 p-4 rounded-lg">
            {sendError}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-lg">
          <p className="text-3xl font-bold">
            ₦{data?.summary.totalSent.toFixed(2) || "0.00"}
          </p>
          <p className="text-green-100 mt-2">Total Sent</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-lg">
          <p className="text-3xl font-bold">
            ₦{data?.summary.totalReceived.toFixed(2) || "0.00"}
          </p>
          <p className="text-blue-100 mt-2">Total Received</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
          <p className="text-3xl font-bold">{allTransactions.length}</p>
          <p className="text-purple-100 mt-2">Transactions</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Counterparty
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-gray-500 text-lg"
                  >
                    No transactions yet. Send your first payment!
                  </td>
                </tr>
              ) : (
                allTransactions.map((tx) => {
                  const isSent = tx.sender?.email === user.email;
                  const counterparty = isSent
                    ? tx.receiverEmail
                    : tx.sender?.email || "Unknown";

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition">
                      <td className="px-8 py-5">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                            isSent
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isSent ? "Sent" : "Received"}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-medium">{counterparty}</td>
                      <td className="px-8 py-5 font-bold text-lg">
                        {tx.currency} {tx.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                            tx.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
