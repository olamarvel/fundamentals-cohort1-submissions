interface HeaderProps {
  version?: string | null;
  environment?: string | null;
  onRefresh?: () => void;
  lastUpdated?: string | null;
}

export default function Header({
  version,
  environment,
  onRefresh,
  lastUpdated,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white dark:bg-slate-900 border-b">
      <div>
        <h1 className="text-xl font-semibold">DeployHub Dashboard</h1>
        <div className="text-sm text-slate-500">
          {environment ? `Env: ${environment}` : "Env: —"} •{" "}
          {version ? `v${version}` : "version —"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <div className="text-sm text-slate-500 hidden sm:block">
            Last update: {lastUpdated}
          </div>
        )}
        <button
          onClick={onRefresh}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm"
        >
          Refresh
        </button>
      </div>
    </header>
  );
}
