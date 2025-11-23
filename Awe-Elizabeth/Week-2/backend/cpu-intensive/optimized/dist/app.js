"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function runFibWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, "worker.js"), {
            workerData
        });
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code != 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}
app.post("/api/process-data", async (_req, res) => {
    //large JSON parse
    const fakeData = JSON.stringify(Array.from({ length: 5000 }, (_, i) => ({ index: i, value: i * 2 })));
    const parsedData = JSON.parse(fakeData);
    const fibResult = await runFibWorker(40);
    return res.status(200).json({
        message: "",
        data: { parsedData, fibResult }
    });
});
const port = "5030";
app.listen(port, () => {
    console.log(`💀 CPU intesive process currently running on port: ${port}`);
});
//# sourceMappingURL=app.js.map