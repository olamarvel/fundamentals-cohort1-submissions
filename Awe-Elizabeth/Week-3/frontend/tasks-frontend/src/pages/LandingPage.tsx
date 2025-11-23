import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <Navbar></Navbar>
        <h1 className="text-2xl font-bold text-blue-600">TaskManager Pro</h1>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20">
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Manage Tasks <br /> The Smart Way 🚀
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Organize, prioritize, and collaborate efficiently. Whether you’re a user or admin, 
          TaskManager Pro helps you stay productive and secure.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Managing Tasks
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Secure Access</h3>
            <p className="text-gray-600">
              Protected login system with token-based authentication and session refresh.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Smart Tasking</h3>
            <p className="text-gray-600">
              Create, filter, and search tasks easily with advanced MongoDB pagination.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Role Control</h3>
            <p className="text-gray-600">
              Role-based permissions let admins and users collaborate seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-100 text-center text-gray-600">
        © {new Date().getFullYear()} TaskManager Pro. All rights reserved.
      </footer>
    </div>
  );
}
