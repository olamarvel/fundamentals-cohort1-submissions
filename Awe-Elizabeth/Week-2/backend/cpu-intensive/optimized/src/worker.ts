import { parentPort, workerData } from "worker_threads";

export const fibonacci = (n:number): number => {
    if(n < 1) return n
    return fibonacci(n -1) + fibonacci(n-2)
}



if(parentPort){
  const num : number = workerData
  parentPort.postMessage(fibonacci(num))
}
