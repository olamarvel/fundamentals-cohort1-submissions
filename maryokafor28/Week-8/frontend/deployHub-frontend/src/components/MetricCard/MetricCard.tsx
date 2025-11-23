import React from "react";

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  sub?: string;
}

export default function MetricCard({ title, value, sub }: MetricCardProps) {
  return (
    <div className="card">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}
