"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/process-data", (_req, res) => {
    //large JSON parse
    const fakeData = JSON.stringify(Array.from({ length: 5000 }, (_, i) => ({ index: i, value: i * 2 })));
    const parsedData = JSON.parse(fakeData);
    // CPU-bound Fibonacci
    const fibResult = fibonacci(40);
    return res.status(200).json({
        message: "",
        data: { parsedData, fibResult }
    });
});
const fibonacci = (n) => {
    if (n < 1)
        return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
};
const port = "5020";
app.listen(port, () => {
    console.log(`💀 CPU intesive process currently running on port: ${port}`);
});
//# sourceMappingURL=app.js.map