// worker-service.js
import { connectRabbitMQ, QUEUE_NAME } from '../config/rabbitmq';
import connectDB from '../config/db'; 
import JobModel, { type JOB } from '../models/job';

const mockNotificationProvider = (job:JOB & {_id:string}) => {
    return new Promise((resolve, reject) => {
        const delay = Math.random() * 1000 * 60; 
        setTimeout(() => {
            if (Math.random() < 0.1) { 
                console.log(`[Worker] Job ${job._id} FAILED.`); // Use _id from DB
                reject(new Error("External provider API error."));
            } else {
                console.log(`[Worker] Job ${job._id} SENT successfully.`);
                resolve(undefined);
            }
        }, delay);
    });
};

async function startWorkerService() {
    try {
        await connectDB(); 

        const channel = await connectRabbitMQ();
        if(!channel) return;
        channel.prefetch(5); 

        console.log(`Waiting for messages in ${QUEUE_NAME}...`);

        await channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                let jobData;
                try {
                    // Parse the message (contains the _id and info)
                    jobData = JSON.parse(msg.content.toString());
                    console.log(`[Worker] Processing Job ID: ${jobData._id}`);
                    
                    // --- EXECUTE TASK ---
                    await mockNotificationProvider(jobData);

                    // --- DB UPDATE: SUCCESS ---
                    // Since we are connected to Mongo, we can run queries!
                    await JobModel.findByIdAndUpdate(jobData._id, { 
                        status: 'SENT' 
                    });
                    
                    console.log(`[Worker] DB Updated: ${jobData._id} -> SENT`);
                    
                    // --- RABBITMQ ACK ---
                    channel.ack(msg);
                    
                } catch (error) {
                    console.error(`[Worker] Error:`, (error as any).message);
                    
                    // --- DB UPDATE: FAILURE ---
                    // Optional: Track retries in DB so we can see it in dashboard
                    if (jobData && jobData._id) {
                         await JobModel.findByIdAndUpdate(jobData._id, { 
                            status: 'FAILED',
                            $inc: { retries: 1 } // Increment retry count
                        });
                    }

                    // --- RABBITMQ NACK ---
                    // Put it back in the queue to try again
                    channel.nack(msg, false, true); 
                }
            }
        });

    } catch (error) {
        console.error("Fatal error starting Worker:", error);
        process.exit(1);
    }
}

startWorkerService();