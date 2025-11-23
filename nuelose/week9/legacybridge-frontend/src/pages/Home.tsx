export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to LegacyBridge</h1>
      <p className="text-xl text-gray-600 mb-8">
        Modern UI consuming the new v2 API that bridges our old PHP
        monolith.
      </p>
      <div className="space-x-4">
        <a
          href="/customers"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          View Customers
        </a>
        <a
          href="/payments"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          View Payments
        </a>
      </div>
    </div>
  );
}
