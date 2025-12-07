import { useState } from "react";
import { login, logout } from "../api/auth";
import Spinner from "../components/spinner";
import ErrorBanner from "../components/error-banner";

export default function Login() {
  const [username, setUsername] = useState("okegbemi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      await login(username);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleLogout() {
    setLoading(true);
    setError(null);
    try {
      await logout();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {loading && <Spinner />}
      {error && <ErrorBanner message={error} />}
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleLogin}>Get Token</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
