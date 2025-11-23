import express, {Request, Response} from 'express'
import cors from 'cors';
import { Worker } from "worker_threads";
import path from 'path';

const app = express();

app.use(cors())
app.use(express.json());


function runFibWorker(workerData: any): Promise<any> {
return new Promise((resolve, reject) => {
  const worker = new Worker(path.resolve(__dirname, "worker.js"),{
    workerData
  });

  worker.on("message", resolve);
  worker.on("error", reject);
  worker.on("exit", (code) => {
    if(code != 0)
      reject(new Error(`Worker stopped with exit code ${code}`))
  })
})
}

app.post("/api/process-data",async (_req: Request, res: Response) => {
    //large JSON parse
  const fakeData = JSON.stringify(
    Array.from({ length: 5000 }, (_, i) => ({ index: i, value: i * 2 }))
  );

  const parsedData = JSON.parse(fakeData);

  const fibResult = await runFibWorker(40)

  return  res.status(200).json({
                message: "",
                data: {parsedData, fibResult }
            });
})



const port = "5030"
app.listen(port, () => {
    console.log(`💀 CPU intesive process currently running on port: ${port}`)
})
