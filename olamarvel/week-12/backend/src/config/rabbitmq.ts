

import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'notification_jobs';

async function connectRabbitMQ() {
    let attempt = 0;
    const maxAttempts = 5;
    const retryDelay = 5000; // 5 seconds

    while (attempt < maxAttempts) {
        try {
            console.log(`Connecting to RabbitMQ: ${RABBITMQ_URL}`);
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            
            // Set up listener for connection close events for graceful handling
            connection.on('close', () => {
                console.error("RabbitMQ connection closed! Exiting process to restart worker.");
                process.exit(1);
            });
            
            console.log("Successfully connected to RabbitMQ and created channel.");

            await channel.assertQueue(QUEUE_NAME, { durable: true });

            return channel;
        } catch (error) {
            const err = error as any
            attempt++;
            console.error(`Failed to connect to RabbitMQ (attempt ${attempt}/${maxAttempts}). Error: ${err.message}`);
            
            if (attempt < maxAttempts) {
                console.log(`Retrying in ${retryDelay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error("Max retries reached. Could not connect to RabbitMQ.");
                throw error; 
            }
        }
    }
}

const channelPromise = connectRabbitMQ();

export default channelPromise;

export { connectRabbitMQ, QUEUE_NAME };