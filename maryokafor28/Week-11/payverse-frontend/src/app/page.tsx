import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">PayVerse</h1>
        <p className="text-gray-600 mb-8">Distributed Payments Platform</p>

        <div className="space-y-4">
          <Link
            href="/users"
            className="block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            View Users
          </Link>

          <Link
            href="/transactions"
            className="block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
          >
            View Transactions
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>✅ SQL Database (PostgreSQL)</p>
          <p>✅ WebSocket Real-time Updates</p>
          <p>✅ Redis Caching</p>
        </div>
      </div>
    </div>
  );
}
