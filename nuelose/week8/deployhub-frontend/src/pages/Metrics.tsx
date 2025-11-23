import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "../lib/api";

import {
  HealthResponse,
  HistogramBucket,
  Histogram,
  RequestHistoryPoint,
} from "../types";

export default function Metrics() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryPoint[]>(
    []
  );

  function parseHistogram(histogram: Histogram | undefined) {
    if (!histogram) return [];

    return histogram.values
      .filter((v: HistogramBucket) => v.metricName.endsWith("_bucket"))
      .map((bucket: HistogramBucket) => ({
        le: bucket.labels.le ?? "unknown",
        count: bucket.value,
      }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/health");
        const data: HealthResponse = await res.data;

        setHealth(data);

        setRequestHistory((prev: RequestHistoryPoint[]) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            totalRequests: data.totalRequests,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch /api/health", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!health) return <p>Loading metrics...</p>;

  const histogramData = parseHistogram(health.responseTimeHistogram);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Metrics</h1>
      <p className="text-slate-500 mb-6">
        Real-time performance metrics and analytics
      </p>

      {/* Line Chart — Request Count Over Time */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-medium mb-4">Total Requests Over Time</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={requestHistory}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalRequests"
                stroke="#3b82f6"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart — Response Time Histogram */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-medium mb-4">Response Time Histogram</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={histogramData}>
              <XAxis dataKey="le" label="≤ ms" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart — Error Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium mb-4">Error Rate</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart
              data={[
                {
                  name: "Errors",
                  errors: health.errorRate,
                },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="errors" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
