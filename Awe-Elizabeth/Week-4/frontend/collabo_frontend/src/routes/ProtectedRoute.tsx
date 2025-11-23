import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { accessToken, loading } = useAuth();
  // Wait for refresh token check to complete
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the requested protected route
  return <Outlet />;
}
