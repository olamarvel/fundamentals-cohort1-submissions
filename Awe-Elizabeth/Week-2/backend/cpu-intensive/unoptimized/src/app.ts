import express, {Request, Response} from 'express'
import cors from 'cors';

const app = express();

app.use(cors())
app.use(express.json());


app.post("/api/process-data", (_req: Request, res: Response) => {
    //large JSON parse
  const fakeData = JSON.stringify(
    Array.from({ length: 5000 }, (_, i) => ({ index: i, value: i * 2 }))
  );

  const parsedData = JSON.parse(fakeData);

  // CPU-bound Fibonacci
  const fibResult = fibonacci(40); 

  return  res.status(200).json({
                message: "",
                data: {parsedData, fibResult }
            });
})

const fibonacci = (n:number): number => {
    if(n < 1) return n
    return fibonacci(n -1) + fibonacci(n-2)
}


const port = "5020"
app.listen(port, () => {
    console.log(`💀 CPU intesive process currently running on port: ${port}`)
})
