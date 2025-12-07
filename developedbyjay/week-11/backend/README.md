# PayVerse - Transaction Metadata Service (TMS)

## Technical Design Document

**Author:** Okegbemi Joshua  
**Date:** 5th December, 2025  
**Project:** PayVerse Platform Upgrade  
**Status:** Approved for Implementation

---

## Problem Statement

PayVerse is experiencing rapid growth, processing high-volume transactions across diverse global regions. The current monolithic architecture faces three critical bottlenecks:

1. **Data Rigidity:** Diverse regional compliance and merchant requirements mean transaction data structures vary wildly, making SQL schema migrations frequent and risky.

2. **Read Latency:** Dashboard loads for analytics are slowing down the primary database, affecting write performance during peak hours.

3. **Authentication Bottlenecks:** Centralized session validation is introducing latency and creating a single point of failure as we horizontally scale our API services.

The goal of this architectural upgrade is to decouple these concerns to improve developer velocity, system reliability, and scalability.

---

## Decision Options & Analysis

### Decision A: Database Storage Strategy

**Context:** Storing transaction logs containing both standard financial data (amount, currency) and highly variable metadata (device fingerprint, location, merchant-specific tags).

| Feature              | Option 1: SQL (PostgreSQL)                                              | Option 2: NoSQL (MongoDB)                                     |
| -------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Schema Structure** | Rigid, tabular. Requires migrations for changes.                        | Flexible JSON documents. No migrations needed for new fields. |
| **Scaling**          | Vertical scaling is standard. Horizontal scaling (sharding) is complex. | Built-in horizontal sharding and replica sets.                |
| **Data Integrity**   | Strict ACID compliance.                                                 | Eventual consistency (tunable).                               |
| **Complex Queries**  | Excellent for joins and aggregations.                                   | Poor for joins; optimized for single-collection reads.        |

**Selected Option:** NoSQL (MongoDB)

**Justification:**  
The variation in transaction metadata across regions renders a rigid SQL schema inefficient. MongoDB allows us to ingest polymorphic data at high speed without downtime for schema changes. We prioritize write throughput and schema flexibility over complex join capabilities for this specific microservice.

---

### Decision B: Caching Strategy

**Context:** Reducing database load for the high-traffic "Transaction History" dashboard.

| Feature            | Option 1: In-Memory (Node-Cache)                                           | Option 2: Distributed (Redis)                    |
| ------------------ | -------------------------------------------------------------------------- | ------------------------------------------------ |
| **Scope**          | Local to a single server instance.                                         | Shared across all server instances.              |
| **Consistency**    | Low. Request A hits Server 1 (cached), Request B hits Server 2 (uncached). | High. All servers see the same cached data.      |
| **Resilience**     | Cache clears on server restart/deploy.                                     | Cache persists independently of app deployments. |
| **Infrastructure** | None (embedded in code).                                                   | Requires separate service/container management.  |

**Selected Option:** Distributed Cache (Redis)

**Justification:**  
Since PayVerse uses a load-balanced, containerized environment (Docker/K8s), In-Memory caching would result in cache fragmentation (low hit rates). Redis ensures that if User A caches their history on Server 1, they can retrieve it from Server 2, maintaining consistency and effectively offloading the primary database.

---

### Decision C: Authentication Mechanism

**Context:** Securing API endpoints for web and mobile clients.

| Feature          | Option 1: Session-Based Auth                        | Option 2: JWT (JSON Web Tokens)                      |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------- |
| **State**        | Stateful. Server stores session ID in memory or DB. | Stateless. Token contains all user data.             |
| **Scalability**  | Linear cost. More users = more DB/Memory lookups.   | Flat cost. CPU-only verification (Crypto signature). |
| **Revocation**   | Immediate. Delete session from server.              | Difficult. Requires token expiration or blocklists.  |
| **Payload Size** | Small (Cookie ID).                                  | Larger (Base64 encoded JSON).                        |

**Selected Option:** JWT (Stateless Auth)

**Justification:**  
To avoid a database lookup on every single API request, we opt for JWTs. This allows our backend services to verify identity purely through cryptographic signatures. This is essential for latency reduction and enables our services to scale horizontally without being tethered to a central session store.

---

## Implementation Summary

To validate these architectural decisions, a Proof of Concept (PoC) was developed with the following specifications:

### Backend Architecture

- **Runtime:** Node.js with Express
- **Implementation:** Decoupled controllers for Auth and Transactions
- **Middleware:** Custom JWT validation middleware to enforce stateless security
- **Optimization:** Redis Middleware implemented on GET routes to intercept requests before reaching the database logic
- **Database:** MongoDB Atlas (Cloud) / Local Docker Container
- **Schema:** A Mongoose schema utilizing a Mixed type for the metadata field to demonstrate NoSQL flexibility

### Frontend Architecture

- **Framework:** React (Vite)
- **UI:** A dashboard displaying transaction logs with visual indicators showing whether data was served from "Live DB" (slow path) or "Redis Cache" (fast path)

---

## Technology Stack

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Cache:** Redis (ioredis)
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Language:** TypeScript

---

## Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── mongo.ts         # MongoDB connection setup
│   │   └── redis.ts         # Redis connection setup
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── transaction.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts          # JWT validation middleware
│   │   ├── cache.ts         # Redis cache middleware
│   │   └── error.ts         # Error handling middleware
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   └── transaction.model.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── transaction.routes.ts
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── transaction.service.ts
│   │
│   ├── utils/
│   │   └── validators.ts
│   │
│   └── index.ts             # Application entry point
│
├── package.json
├── tsconfig.json
└── .env.example
```



## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Client Application                     │
│                  (React Frontend / API)                  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ HTTP/REST + JWT
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Express.js Backend                    │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │         JWT Middleware (Stateless Auth)            │ │
│  └─────────────────────┬──────────────────────────────┘ │
│                        │                                 │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │        Redis Cache Middleware (GET Routes)         │ │
│  │          • Check cache before DB query             │ │
│  │          • Return cached data if available         │ │
│  └─────────────────────┬──────────────────────────────┘ │
│                        │                                 │
│                  Cache Miss?                             │
│                        │                                 │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │              Controllers Layer                      │ │
│  │      • Auth Controller                              │ │
│  │      • Transaction Controller                       │ │
│  └─────────────────────┬──────────────────────────────┘ │
│                        │                                 │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │              Services Layer                         │ │
│  │      • Business Logic                               │ │
│  │      • Data Validation                              │ │
│  └───────────┬────────────────────┬────────────────────┘ │
└──────────────┼────────────────────┼──────────────────────┘
               │                    │
               │                    │
    ┌──────────▼──────────┐  ┌──────▼──────────┐
    │     MongoDB         │  │      Redis       │
    │   (NoSQL Store)     │  │ (Distributed     │
    │                     │  │     Cache)       │
    │ • Users Collection  │  │                  │
    │ • Transactions      │  │ • Cached Queries │
    │ • Flexible Schema   │  │ • Session Data   │
    │ • Mixed metadata    │  │ • Shared State   │
    └─────────────────────┘  └──────────────────┘
```

---

## Key Features Implemented

### 1. Stateless JWT Authentication

- JWT tokens contain user identity and claims
- No database lookup required for authentication
- Cryptographic signature verification only
- Middleware validates tokens on protected routes

### 2. Redis Cache Middleware

- Intercepts GET requests before database queries
- Caches frequently accessed data (transaction lists, user profiles)
- Cache keys based on user ID and request parameters
- Configurable TTL (Time To Live) per endpoint
- Cache invalidation on data mutations (POST, PATCH, DELETE)

### 3. Flexible MongoDB Schema

- Transaction model uses Mongoose Mixed type for metadata
- Allows polymorphic data structures per transaction
- No schema migrations required for new fields
- Region-specific and merchant-specific data supported

---



### Redis Caching Strategy

- **User Profile:** 5-minute TTL
- **Transaction Lists:** 2-minute TTL
- **Transaction Details:** 5-minute TTL
- Cache invalidation on data updates (create, update, delete)
- Cache key pattern: `user:{userId}:transactions`

### Scalability Features

- Stateless JWT enables horizontal scaling
- Distributed Redis cache shared across instances
- MongoDB sharding support for geographic distribution
- Connection pooling for both MongoDB and Redis

---

## Security Features

- **Helmet.js:** Security headers (XSS, clickjacking protection)
- **CORS:** Cross-origin resource sharing configuration
- **JWT Authentication:** Secure token-based authentication with expiration
- **Input Validation:** Joi schema validation for all inputs
- **Error Handling:** No sensitive data exposed in error responses
- **Password Hashing:** Bcrypt with salt rounds (implemented in models)


## Technical Documentation

**Complete Technical Report:**  
[View Detailed Trade-Off Analysis](https://docs.google.com/document/d/1CyonVdT3FRmuM2VeSt8HSnVt8HXP9KRbG9jt_ABdnDI/edit?usp=sharing)

The technical report includes:

- Detailed problem statement
- All decision options considered
- Comprehensive trade-off analysis tables
- Justification for each architectural choice
- Performance benchmarks
- Future considerations and recommendations

