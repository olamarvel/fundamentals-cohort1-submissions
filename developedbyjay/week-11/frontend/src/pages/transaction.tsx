import { useEffect, useState } from "react";
import Spinner from "../components/spinner";
import ErrorBanner from "../components/error-banner";
import { listTransactions, createTransaction } from "../api/transaction";

export default function Transactions() {
  const [partner, setPartner] = useState("payverse-ng");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await listTransactions(partner));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createDemo() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        idempotencyKey: `key-${Date.now()}`,
        amount: 1500,
        currency: "NGN",
        customer: { email: "user@example.com" },
        partner,
      };
      await createTransaction(payload);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Transactions</h2>
      {loading && <Spinner />}
      {error && <ErrorBanner message={error} />}
      <div>
        <input value={partner} onChange={(e) => setPartner(e.target.value)} />
        <button onClick={load}>Refresh</button>
        <button onClick={createDemo}>Create demo transaction</button>
      </div>
      {data && (
        <div>
          <p>
            Partner allowed currencies:{" "}
            {data.partnerConfig?.allowedCurrencies?.join(", ") || "N/A"}
          </p>
          <ul>
            {data.items.map((tx: any) => (
              <li key={tx._id}>
                {tx.amount} {tx.currency} - {tx.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
