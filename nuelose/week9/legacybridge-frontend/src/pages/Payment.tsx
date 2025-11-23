import { useEffect, useState, Suspense } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

type Payment = {
  id: number;
  customerId: number;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  processedAt: string;
};

function PaymentsData() {
  const [data, setData] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v2/payments`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch payments");
        return res.json();
      })
      .then((json) => setData(json.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (data.length === 0) return <LoadingSpinner />;

  return (
    <DataTable title="Payments (transformed – real amounts + refund logic)">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Customer ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((p) => (
          <tr key={p.id} className={p.amount < 0 ? "bg-red-50" : ""}>
            <td className="px-6 py-4">{p.id}</td>
            <td className="px-6 py-4">{p.customerId}</td>
            <td className="px-6 py-4">{p.title}</td>
            <td className="px-6 py-4 font-medium">
              {p.amount.toLocaleString("en-NG", {
                style: "currency",
                currency: p.currency,
              })}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  p.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {p.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function Payments() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Payments & Refunds</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentsData />
      </Suspense>
    </>
  );
}
