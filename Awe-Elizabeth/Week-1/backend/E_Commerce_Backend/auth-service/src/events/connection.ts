import amqp, { ChannelModel, Channel } from "amqplib";

let channel: Channel | null = null;
let connection: ChannelModel | null = null;

export const connectRabbitMQ = async (url: string, queue: string[]): Promise<Channel> => {
  try {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    for(const q of queue){
      await channel.assertQueue(q, { durable: true });
    };

    console.log(`✅ Connected to RabbitMQ, queue ready: ${queue}`);
    return channel;
  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ", err);
    throw err;
  }
};


export const consumeQueue = async (queue: string, handler: (msg: any) => void) => {
  if (!channel) throw new Error("Channel not initialized");

  channel.consume(queue, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log(`📥 Consumed from ${queue}:`, content);
      handler(content);
      channel?.ack(msg)
    }
  });
};

// Safer accessor
export const publishToQueue = async (queue: string, message: object) => {
  if (!channel) {
    throw new Error("❌ Channel not initialized");
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`📤 Message published to ${queue}:`, message);
}

