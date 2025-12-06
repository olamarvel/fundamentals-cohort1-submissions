# PayVerse Backend

## 🎯 Project Overview

PayVerse is a distributed payments platform backend built with **Node.js** and **Express**, implementing critical technical trade-offs for a scalable fintech system.

## 🔧 Technical Trade-Off Decisions

### 1. **SQL (PostgreSQL) vs NoSQL**
**Decision: PostgreSQL (SQL)** ✅

#### Trade-Offs Analysis

| Aspect | PostgreSQL (✅ Chosen) | NoSQL (MongoDB) |
|--------|----------------------|-----------------|
| **ACID Compliance** | ✅ Full ACID guarantees | ⚠️ Eventually consistent |
| **Transaction Support** | ✅ Native multi-row transactions | ❌ Limited transaction support |
| **Data Integrity** | ✅ Foreign keys, constraints | ⚠️ Application-level enforcement |
| **Query Complexity** | ✅ Complex joins, aggregations | ❌ Limited join support |
| **Scalability** | ⚠️ Vertical scaling primarily | ✅ Horizontal scaling |
| **Schema Flexibility** | ❌ Rigid schema | ✅ Flexible schema |

#### Justification
For a **payments platform**, data consistency and integrity are non-negotiable. PostgreSQL provides:
- **ACID transactions** for reliable money transfers
- **Referential integrity** to prevent orphaned records
- **Row-level locking** for concurrent transaction handling
- **Strong consistency** required for financial data
- **Audit trails** through transaction history

### 2. **REST vs gRPC**
**Decision: REST API** ✅

#### Trade-Offs Analysis

| Aspect | REST (✅ Chosen) | gRPC |
|--------|-----------------|------|
| **Browser Support** | ✅ Native HTTP support | ❌ Requires proxies |
| **Learning Curve** | ✅ Simple, well-known | ⚠️ Steeper learning curve |
| **Tooling** | ✅ Postman, Swagger, etc. | ⚠️ Limited tooling |
| **Performance** | ⚠️ JSON overhead | ✅ Binary Protocol Buffers |
| **Human Readability** | ✅ JSON is readable | ❌ Binary format |
| **Compatibility** | ✅ Universal compatibility | ⚠️ Requires specific clients |

#### Justification
REST was chosen for:
- **Wide compatibility** with web, mobile, and third-party integrations
- **Developer-friendly** with standard HTTP methods
- **Easy debugging** with tools like Postman and browser DevTools
- **Lower barrier to entry** for frontend developers
- **JSON format** for clear API contracts

### 3. **JWT vs Session-Based Authentication**
**Decision: JWT (JSON Web Tokens)** ✅

#### Trade-Offs Analysis

| Aspect | JWT (✅ Chosen) | Session-Based |
|--------|----------------|---------------|
| **Statelessness** | ✅ No server storage | ❌ Requires session store |
| **Scalability** | ✅ Horizontal scaling friendly | ⚠️ Requires shared session store |
| **Token Size** | ⚠️ Larger payloads | ✅ Small session ID |
| **Revocation** | ⚠️ Difficult to revoke | ✅ Easy to revoke |
| **Cross-Domain** | ✅ Works across domains | ⚠️ CORS complexity |
| **Security** | ⚠️ Token exposure risk | ✅ Server-side storage |

#### Justification
JWT was selected for:
- **Stateless architecture** enabling easier horizontal scaling
- **Microservices-friendly** for future service separation
- **Mobile app support** without session management
- **Reduced database load** (no session lookups)
- **Standard implementation** with widespread library support

## 🏗️ Architecture

```
payverse-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── transactionController.js  # Payment operations
│   ├── database/
│   │   ├── connection.js        # PostgreSQL connection
│   │   ├── migrate.js           # Database migrations
│   │   └── seed.js              # Sample data seeding
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validate.js          # Request validation
│   ├── models/
│   │   ├── User.js              # User model (Sequelize)
│   │   ├── Transaction.js       # Transaction model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── transactionRoutes.js # Transaction endpoints
│   │   └── index.js             # Health check
│   ├── validators/
│   │   └── schemas.js           # Joi validation schemas
│   └── server.js                # Application entry point
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Transactions
- `POST /api/transactions` - Create transaction/transfer (protected)
- `POST /api/transactions/deposit` - Deposit funds (protected)
- `GET /api/transactions` - Get transaction history (protected)
- `GET /api/transactions/:id` - Get specific transaction (protected)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd week-11/backend/payverse-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=payverse_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173
```

4. **Create PostgreSQL database**
```bash
psql -U postgres
CREATE DATABASE payverse_db;
\q
```

5. **Run database migrations**
```bash
npm run migrate
```

6. **Seed sample data (optional)**
```bash
npm run seed
```

7. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 🧪 Testing with Postman

Import the `PayVerse_API.postman_collection.json` file into Postman for complete API documentation and testing.

### Sample Accounts (after seeding)
- **Email**: alice@payverse.com | **Password**: password123 | **Balance**: $1000
- **Email**: bob@payverse.com | **Password**: password123 | **Balance**: $500
- **Email**: merchant@payverse.com | **Password**: password123 | **Balance**: $5000

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - DDoS protection
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Joi schema validation
- **CORS** - Cross-Origin Resource Sharing
- **SQL Injection Protection** - Sequelize ORM parameterization

## 🎯 Key Features

### Database Layer (SQL Trade-Off)
- **ACID Transactions** for money transfers
- **Row-level locking** to prevent race conditions
- **Foreign key constraints** for data integrity
- **Transaction rollback** on errors

### REST API (REST Trade-Off)
- **Standard HTTP methods** (GET, POST, PUT, DELETE)
- **JSON request/response** format
- **Proper status codes** (200, 201, 400, 401, 404, 500)
- **Error handling** with consistent format

### JWT Authentication (JWT Trade-Off)
- **Stateless tokens** with user claims
- **Token expiration** (24h default)
- **Authorization header** Bearer scheme
- **Protected routes** with middleware

## 📊 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- firstName (String)
- lastName (String)
- accountBalance (Decimal)
- accountStatus (Enum: active, suspended, closed)
- role (Enum: user, merchant, admin)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Transactions Table
```sql
- id (UUID, Primary Key)
- senderId (UUID, Foreign Key -> Users)
- receiverId (UUID, Foreign Key -> Users)
- amount (Decimal)
- currency (String, default: USD)
- type (Enum: transfer, payment, withdrawal, deposit)
- status (Enum: pending, processing, completed, failed, reversed)
- description (String)
- metadata (JSONB)
- failureReason (String, nullable)
- processedAt (Timestamp, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Utilities**: dotenv, cors, morgan

## 📝 Development Notes

### Transaction Handling
All money transfers use **database transactions** with row-level locking to ensure:
1. Atomic operations (all-or-nothing)
2. Consistency (balance never negative)
3. Isolation (concurrent transfer safety)
4. Durability (committed changes persist)

### Error Handling
- Centralized error handler middleware
- Consistent error response format
- Proper HTTP status codes
- Development vs production error details

## 🎓 Learning Outcomes

This project demonstrates:
- Making informed technical trade-off decisions
- Implementing ACID-compliant financial transactions
- Building RESTful APIs with Express
- Securing applications with JWT
- Database design for financial systems
- Error handling and validation
- Code organization and modularity

## 📄 License

This project is part of a software engineering assessment.

## 👤 Author

Technical Trade-Off Implementation by PayVerse Engineering Team
