type HealthState = "healthy" | "degraded" | "unhealthy";

interface Props {
  status: HealthState;
  uptime: number;
  environment?: string;
  version?: string;
}

function colorFor(status: HealthState) {
  if (status === "healthy") return "healthy";
  if (status === "degraded") return "degraded";
  return "unhealthy";
}

export default function StatusCard({
  status,
  uptime,
  environment,
  version,
}: Props) {
  const dotColor = colorFor(status);
  const humanUptime = `${Math.floor(uptime / 3600)}h ${Math.floor(
    (uptime % 3600) / 60
  )}m`;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">System Health</div>
          <div className="flex items-center mt-2">
            <span className={`status-dot bg-${dotColor}`}></span>
            <span className="text-lg font-medium capitalize">{status}</span>
          </div>
        </div>

        <div className="text-right text-sm text-slate-500">
          <div>Uptime</div>
          <div className="text-base text-slate-900 dark:text-white">
            {humanUptime}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div>Env: {environment ?? "—"}</div>
        <div className="text-right">Version: {version ?? "—"}</div>
      </div>
    </div>
  );
}
