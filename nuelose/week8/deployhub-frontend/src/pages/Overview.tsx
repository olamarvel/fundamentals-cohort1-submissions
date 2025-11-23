import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Health } from "../types";



export default function Overview() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/health");
        setHealth(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    const t = setInterval(fetch, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Overview</h1>
      <p className="text-slate-500 mb-6">
        Monitor your infrastructure health and performance
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-full text-gray-500">
          Loading...
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">API Health Status</h3>
                <p className="text-sm text-slate-500">Current system status</p>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  All Systems Operational
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-slate-400">Backend Uptime</div>
                <div className="font-medium mt-1">
                  {health ? `${(health.uptime / 3600).toFixed(2)} hrs` : "—"}
                </div>
              </div>

              <div>
                <div className="text-slate-400">Version</div>
                <div className="font-medium mt-1">{health?.version || "—"}</div>
              </div>

              <div>
                <div className="text-slate-400">Last Updated</div>
                <div className="font-medium mt-1">
                  {health ? new Date(health.timestamp).toLocaleString() : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-slate-500">Total Requests</div>
              <div className="text-2xl font-semibold mt-2">
                {health?.totalRequests || "-"}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-slate-500">
                Average Response Time
              </div>
              <div className="text-2xl font-semibold mt-2">
                {health?.avgResponseTime || "-"}secs
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-slate-500">Error Rate</div>
              <div className="text-2xl font-semibold mt-2">
                {health?.errorRate?.toFixed(2) || "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
