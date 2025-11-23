### CPU Profiling Report
## Baseline Analysis
Here is a report of CPU profiling carried out on "http://localhost:5020/api/process-data" endpoint. It highlights the average latency time as well as a detailed screenshot of the CPU profile when the endpoint was triggered


Average Request Latency = Total Time/ No of requests
                        = 2,400,000 / 100
                        = 24s or 24000 miliseconds

### Screenshot of Unoptimized Process
![alt text](https://github.com/Awe-Elizabeth/CPU_Intensive_Analysis/blob/38c45beb1681746910fc0b1c02ec0f110eb66cae/unoptimized/fib-100.png)

## Optimaization Strategy
In the baseline analysis above, the Fibonacci method is CPU intensive and takes a longer time to run as opposed to parsing the JSON string. Since Node.js is single threaded, this monopolizes the event loop, preventing any other operation from running until it is completed.

# Justification for Worker Threads Over Clustering
1. Worker threads are preferred in this scenario because it has less over head cost as opposed to clustering.
2. Worker threads is able to run in seperate threads within the same process which ensures true parallelism whereas clustering runs multiple processes. 
3. Also, worker threads are great for CPU intensive tasks, while clustering would have been preferred for an input-output process
4. Worker thread consumes less memory because threads can share memory space

# Communication Between the Main Thread and Worker Thread
Communication between the main thread and worker threads is bidirectional which allows the main thread and the worker threads to receive and send messages. The main thread send a message to the worker thread worker.postMessage() method of the Worker class and the worker threads receives the message by listening on the message.on event on the parent port.
The worker threads are also able to pass message on the parentPort.postMessage method, then the main thread receives the message by listening for the message event on the Worker instance. In this scenario, the worker threads are posting messages while the main threads listens.

### Validation Results
Final Request Latency = Total Time / No of Requests
                      = 310,000/100
                      = 310 miliseconds

### Screenshot of Optimized Process
![alt text](https://github.com/Awe-Elizabeth/CPU_Intensive_Analysis/blob/154e1b35bc95c1ef529d2eb2281f6f0a296d6c2f/optimized/Fib-Optimized-full_range.png)

Percentage Improvement = (Initial Request Latency - Final Request Latence)/ Initial * 100
                       = 24000 - 310/24000 * 100 
                       = 98.71%

### Frontend Link
https://github.com/Awe-Elizabeth/CPU_Intensive_Analysis_Frontend.git

