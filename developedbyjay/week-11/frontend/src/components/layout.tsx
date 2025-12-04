import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Login</Link>
        <Link to="/transactions">Transactions</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
