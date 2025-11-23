import React, {useEffect, useState} from 'react';
import {fetchHealth, type Health} from './api';
import HealthCard from './components/HealthCard';

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchHealth();
        setHealth(data);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    })();
  },  []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header>
        <h1>DeployHub-Frontend</h1>
        <p>Simple UI that shows backend health and version information.</p>
      </header>

      <section style={{ marginTop: 20 }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {health && <HealthCard health={health} />}
      </section>

      <footer style={{marginTop: 24, color: '#666'}}>
        <small>Built with Vite + React — API: <code>{import.meta.env.VITE_API_BASE_URL || '/api'}</code></small>
      </footer>
    </div>
  );
}