# Scalable Notification Delivery System 🚀

  

## 📖 Overview

The **WaveCom Notification System** is a distributed, fault-tolerant microservices architecture designed to handle high-throughput transactional notifications (Email/SMS). Built to scale to **50,000 notifications per minute**, it leverages an asynchronous event-driven architecture to decouple message ingestion from processing.

This repository contains:

  * **Producer API:** A high-performance Express.js entry point.
  * **Worker Service:** A horizontally scalable consumer fleet.
  * **Dashboard:** A React-based real-time control center for load testing and monitoring.

-----

## 🏗 Architecture

The system follows a **Producer-Consumer** pattern using RabbitMQ as the message broker.
![Flow Diagram](flow.png)


### Components & Responsibilities

| Component | Responsibility | Tech Stack |
| :--- | :--- | :--- |
| **API Service** | Ingests requests, validates payloads, logs initial state to DB, and acts as the RabbitMQ Producer. Responds immediately with `202 Accepted`. | Node.js, Express |
| **RabbitMQ** | Acts as a durable buffer / shock absorber. Ensures messages are ordered and persisted until processed. | RabbitMQ (AMQP) |
| **Worker Service** | Consumes messages, handles 3rd-party API latency, manages retries, and updates final status. **Stateless and horizontally scalable.** | Node.js, amqplib |
| **MongoDB** | Persistent storage for job status, logs, and audit trails. | MongoDB, Mongoose |
| **Frontend** | Load generator and real-time status dashboard. | React, Vite |

-----

## 🛡️ Design Defense

### 1\. Why this Architecture?

We chose an **Asynchronous Queue-Based Architecture** over a monolithic REST API to ensure high availability.

  * **Decoupling:** The API ingestion rate is not limited by the speed of the email/SMS provider. The API can accept requests in milliseconds, while the actual sending takes seconds.
  * **Reliability:** By persisting jobs to MongoDB *before* queueing, and using RabbitMQ's **Persistent Messages**, we ensure zero data loss even if the broker crashes.

### 2\. How does it handle 50,000 notifications/min?

Achieving \~833 requests/second requires preventing the Node.js event loop from blocking.

  * **Horizontal Scaling:** The Worker Service is designed to be run as multiple independent instances (`npm run scale:workers`). RabbitMQ's **Round-Robin Dispatch** distributes the load evenly across all active workers.
  * **Prefetch Count:** We configured `channel.prefetch(5)` on consumers. This ensures fair distribution; a worker is never overwhelmed with too many unacknowledged messages, keeping RAM usage predictable.
  * **Connection Pooling:** Workers maintain a persistent connection to MongoDB, eliminating the overhead of the TCP handshake for every single notification.

### 3\. Fault Tolerance & Graceful Degradation

  * **Message Durability:** Queues are declared `durable: true` and messages `persistent: true`.
  * **Acknowledgement Mode:** Workers use manual acknowledgments (`channel.ack`). If a worker crashes mid-process, RabbitMQ detects the lost connection and re-queues the message for another worker.
  * **Retry Logic:** Failed deliveries (e.g., 3rd party downtime) are handled via `channel.nack(msg, false, true)` (requeue) or routed to a Dead Letter Exchange (DLX) for delayed retry.

-----

## 📡 API Documentation

### 1\. Send Notification

**Endpoint:** `POST /api/notify`
**Description:** Queues a new notification job.

**Payload:**

```json
{
  "type": "email",
  "to": "user@example.com",
  "content": "Your OTP is 1234"
}
```

**Response (202 Accepted):**

```json
{
  "message": "Notification job accepted and queued.",
  "jobId": "a1b2c3d4-..." 
}
```

### 2\. Check Status

**Endpoint:** `GET /api/status/:id`
**Description:** Polls the real-time status of a specific job.

**Response:**

```json
{
  "jobId": "a1b2c3d4-...",
  "status": "SENT",  // PENDING, SENT, or FAILED
  "updatedAt": "2025-12-12T10:00:00Z"
}
```

-----

## 🗄️ Database Schema

**Collection:** `jobs`

```javascript
{
  _id: ObjectId("..."),
  type: String,         // 'email' | 'sms'
  to: String,
  content: String,
  status: String,       // Enum: ['PENDING', 'SENT', 'FAILED']
  retries: Number,      // Default: 0
  createdAt: Date,
  updatedAt: Date
}
```

-----

## 🚀 Setup & Usage

### Prerequisites

  * Node.js v18+
  * RabbitMQ Server (Running on localhost:5672)
  * MongoDB (Running on localhost:27017)

### Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/olamarvel/fundamentals-cohort1-submissions.git
    cd olamrvel/week-12
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    cd frontend && npm install
    ```

### Running the System

We use **concurrently** to spin up the entire architecture (API + 10 Workers) in one command.

```bash
# In the root folder
npm run dev:full
```

### Running the Load Test (Dashboard)

1.  Navigate to the frontend: `cd frontend`
2.  Start the UI: `npm run dev`
3.  Open `http://localhost:5173`
4.  Set **Total Requests** to `5000` and **Batch Size** to `50`.
5.  Click **🚀 Start Test** and watch the workers drain the queue in real-time.

-----

### 🧪 Manual Testing (Bash)

You can also run the included CLI stress tester:

```bash
chmod +x blast_v2.sh
./blast_v2.sh
```