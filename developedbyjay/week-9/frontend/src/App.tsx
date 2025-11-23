import { useEffect, useMemo, useState } from "react";
import { Calendar, Database, DollarSign, User } from "lucide-react";

interface Payment {
  id: string;
  payerName: string;
  amount: number;
  currency: string;
  createdAt: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export default function App() {
  const [payments, setPayments] = useState<Array<Payment>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/v2/payments");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.data);
      setPayments(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = useMemo(
    () => (status: string) => {
      switch (status) {
        case "SUCCESS":
          return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "FAILED":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800";
      }
    },
    []
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      <header className="bg-indigo-900 text-white shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-300" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                LegacyBridge
              </h1>
              <p className="text-indigo-300 text-sm">
                System Integration Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-800 px-3 py-1 rounded-full text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  error ? "bg-red-500" : "bg-green-400"
                }`}
              ></span>
              {error ? "System Offline" : "System Operational"}
            </div>
            <button
              onClick={() => fetchData()}
              className="text-xs bg-indigo-700 hover:bg-indigo-600 px-3 py-1 rounded transition-colors"
            >
              {loading ? "Refetching..." : "Refetch Data"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-sm font-medium mb-2">
              Total Volume
            </div>
            <div className="text-3xl font-bold text-slate-800">
              $
              {payments
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-sm font-medium mb-2">
              Successful Txns
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              {payments.filter((t) => t.status === "SUCCESS").length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-sm font-medium mb-2">
              Pending / Failed
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {payments.filter((t) => t.status !== "SUCCESS").length}
            </div>
          </div>
        </div>
        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      Initializing integration service...
                    </td>
                  </tr>
                ) : (
                  payments.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          {txn.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <User className="w-4 h-4 text-slate-400" />
                          {txn.payerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-slate-400" />
                          {txn.amount.toFixed(2)}{" "}
                          <span className="text-xs text-slate-400 font-normal">
                            {txn.currency}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            txn.status
                          )}`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
