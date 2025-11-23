import { useEffect, useState, Suspense } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

type Customer = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  companyName: string;
  status: string;
  registeredAt: string;
};

function CustomersData() {
  const [data, setData] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v2/customers`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      })
      .then((json) => setData(json.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (data.length === 0) return <LoadingSpinner />;

  return (
    <DataTable title="Customers (transformed from legacy users.php)">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Full Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Bank
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((c) => (
          <tr key={c.id}>
            <td className="px-6 py-4">{c.id}</td>
            <td className="px-6 py-4 font-medium">{c.fullName}</td>
            <td className="px-6 py-4">{c.email}</td>
            <td className="px-6 py-4">{c.companyName}</td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  c.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {c.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function Customers() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <CustomersData />
      </Suspense>
    </>
  );
}
