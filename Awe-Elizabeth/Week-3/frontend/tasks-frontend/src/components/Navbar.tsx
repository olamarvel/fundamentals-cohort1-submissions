import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check token on mount or route change
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      // Optional: Notify backend to revoke refresh token
    //   await fetch("http://localhost:5000/api/auth/logout", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //     },
    //   });

      // Clear local tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm fixed top-0 w-full z-50">
      {/* Brand */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TaskManager Pro
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className={`${isActive("/")} hover:text-blue-600 transition`}>
          Home
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to="/dashboard"
              className={`${isActive("/dashboard")} hover:text-blue-600 transition`}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={`${isActive("/tasks")} hover:text-blue-600 transition`}
            >
              Tasks
            </Link>
          </>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
