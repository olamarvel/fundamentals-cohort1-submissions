import { useMemo } from "react";
import Header from "../components/Header/header";
import StatusCard from "../components/StatusCard/StatusCard";
import MetricCard from "../components/MetricCard/MetricCard";
import { useHealth } from "../hooks/useHealth";
import { useMetrics } from "../hooks/useMetrics";

export default function Dashboard() {
  const {
    data: health,
    loading: healthLoading,
    error: healthError,
    refresh: refreshHealth,
  } = useHealth(true, 5000);

  const {
    data: metrics,
    loading: metricsLoading,
    error: metricsError,
    refresh: refreshMetrics,
  } = useMetrics(true, 4000);

  const lastUpdated = useMemo(
    () => new Date().toLocaleTimeString(),
    [health, metrics]
  );

  const handleRefresh = () => {
    refreshHealth();
    refreshMetrics();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <Header
        version={health?.version ?? null}
        environment={health?.environment ?? null}
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
      />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Status and primary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            {healthLoading ? (
              <div className="card">Loading health...</div>
            ) : healthError ? (
              <div className="card">Error: {healthError}</div>
            ) : health ? (
              <StatusCard
                status={health.status}
                uptime={health.uptime}
                environment={health.environment}
                version={health.version}
              />
            ) : (
              <div className="card">No health data</div>
            )}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Total Requests"
              value={metricsLoading ? "…" : metrics?.totalRequests ?? "—"}
              sub={
                metrics
                  ? `Errors: ${
                      metrics?.errorRate ? `${metrics.errorRate}%` : "—"
                    }`
                  : undefined
              }
            />
            <MetricCard
              title="Error Rate"
              value={
                metricsLoading
                  ? "…"
                  : metrics?.errorRate
                  ? `${metrics.errorRate}%`
                  : "—"
              }
              sub="Errors / requests"
            />
            <MetricCard
              title="Avg Response"
              value={
                metricsLoading
                  ? "…"
                  : metrics?.averageLatency
                  ? `${metrics.averageLatency}s`
                  : "—"
              }
              sub="Seconds"
            />
          </div>
        </div>

        {/* optional charts or more details */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="text-sm text-slate-500">Response Time Trend</div>
            <div className="mt-4 text-sm text-slate-600">
              (Chart placeholder)
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-slate-500">Recent Events</div>
            <div className="mt-4 text-sm text-slate-600">No events</div>
          </div>
        </section>

        {/* Errors summary */}
        {(healthError || metricsError) && (
          <div className="mt-6 card bg-red-50 border border-red-200 text-red-700">
            <strong>Data fetch error:</strong>
            <div>{healthError ?? metricsError}</div>
          </div>
        )}
      </main>
    </div>
  );
}
