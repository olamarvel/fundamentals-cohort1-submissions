import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const {accessToken, logout} = useAuth()
    const handleLogout = async() => {
            console.log(accessToken)
        await logout()
    }
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg text-indigo-600">
          Collabo
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-500">Home</Link>
          <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
          {
            accessToken ? (<Link to="/login" className="hover:text-indigo-500" onClick={handleLogout}>Logout</Link>) :
            (<Link to="/login" className="hover:text-indigo-500">Login</Link>)
          }
        </div>
      </div>
    </nav>
  );
}
