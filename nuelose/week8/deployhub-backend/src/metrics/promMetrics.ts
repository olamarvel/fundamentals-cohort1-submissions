import client from "prom-client";

client.collectDefaultMetrics();

export const totalRequests = new client.Counter({
  name: "deployhub_total_requests",
  help: "Total number of requests received",
});

export const totalErrors = new client.Counter({
  name: "deployhub_total_errors",
  help: "Total number of errors sent",
});

export const responseTime = new client.Histogram({
  name: "deployhub_response_time_ms",
  help: "Response time in milliseconds",
  buckets: [50, 100, 300, 500, 1000, 2000],
});

export const register = client.register;
