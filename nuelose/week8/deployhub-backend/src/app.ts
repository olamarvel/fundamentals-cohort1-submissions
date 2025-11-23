import express from "express";
import serviceRoutes from "./routes/servicesRoute";
import { requestTimer } from "./middleware/requestTimer";
import metricsRouter from "./routes/metricsRoute";
import healthRouter from "./routes/healthRoute";
import cors from "cors";
import { metricsMiddleware } from "./middleware/metricsMiddleware";

const app = express();
app.use(express.json());
app.use(metricsMiddleware);
app.use(requestTimer);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://deployhub-frontend.onrender.com",
      "https://deployhub-frontend-zsp3.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/health", healthRouter);
app.use("/api/services", serviceRoutes);
app.use("/metrics", metricsRouter);

export default app;
