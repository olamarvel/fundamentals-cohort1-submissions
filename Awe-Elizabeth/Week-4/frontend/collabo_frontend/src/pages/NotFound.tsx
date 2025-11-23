import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
