import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import v2Routes from "./routes/v2.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.urlencoded({ limit: "50mb", extended: false }));
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", service: "LegacyBridge v2 API" });
});

app.use((req, res, next) => {
  if (req.path.endsWith(".php")) {
    setTimeout(next, 300 + Math.random() * 1200);
  } else {
    next();
  }
});

const getDataPath = (filename: string) => {
  // const directPath = path.join(__dirname, "../data", filename);

  // if (fs.existsSync(directPath)) return directPath;

  // const fallback = path.join(process.cwd(), "dist/data", filename);
  // if (fs.existsSync(fallback)) return fallback;

  // throw new Error(`Data file missing: ${filename}`);
  const fullPath = path.join(process.cwd(), "data", filename);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Data file not found at ${fullPath}`);
  }

  return fullPath;
};

app.get("/api/users.php", (_req, res) => {
  const filePath = getDataPath("v1_users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  res.json(JSON.parse(raw));
});

app.get("/api/posts.php", (_req, res) => {
  const filePath = getDataPath("v1_posts.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  res.json(JSON.parse(raw));
});

app.use("/api/v2", v2Routes);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LegacyBridge Backend running on http://localhost:${PORT}`);
    console.log(`=>Health: http://localhost:${PORT}/health`);
  });
}

export { app };
