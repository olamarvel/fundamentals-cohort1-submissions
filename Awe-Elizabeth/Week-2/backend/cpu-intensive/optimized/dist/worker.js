"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fibonacci = void 0;
const worker_threads_1 = require("worker_threads");
const fibonacci = (n) => {
    if (n < 1)
        return n;
    return (0, exports.fibonacci)(n - 1) + (0, exports.fibonacci)(n - 2);
};
exports.fibonacci = fibonacci;
function parseJson(data) {
    const parsed = JSON.parse(data);
    return parsed;
}
// if (parentPort) {
//   const { type, data } = workerData;
//   if (type === "fibonacci") {
//     parentPort.postMessage(fibonacci(Number(data)));
//   } else if (type === "json") {
//     parentPort.postMessage(parseJson(data));
//   } else {
//     parentPort.postMessage({ error: `Unknown type: ${type}` });
//   }
// }
if (worker_threads_1.parentPort) {
    const num = worker_threads_1.workerData;
    worker_threads_1.parentPort.postMessage((0, exports.fibonacci)(num));
}
//# sourceMappingURL=worker.js.map