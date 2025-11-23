import express from "express";
import cors from "cors";
import v1 from "./routes/v1";
import v2 from "./routes/v2";
import { startMockLegacy } from "./mock/legacy-mock";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// versioned API
app.use("/v1", v1);
app.use("/v2", v2);

if (process.env.NODE_ENV !== "production") {
  startMockLegacy(); // runs on 4001 by default
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`legacybridge-backend listening on ${PORT}`);
});
