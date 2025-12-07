# PayVerse Backend

Distributed payments platform backend built with Node.js, Express, and PostgreSQL.

## 🏗️ Architecture Decisions

### 1. SQL vs NoSQL → PostgreSQL
**Reason:** Financial transactions require ACID compliance. PostgreSQL ensures data integrity through foreign keys, transactions, and constraints—critical for payments.

### 2. JWT vs Session-Based Auth → JWT
**Reason:** Stateless authentication enables horizontal scaling without shared session storage. Perfect for microservices architecture.

### 3. REST vs gRPC → REST
**Reason:** REST provides universal client compatibility and excellent developer experience (Postman, curl). gRPC reserved for internal services in production.

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd payverse-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup PostgreSQL database**
```bash
# Create database
createdb payverse

# Run schema
psql -d payverse -f database/schema.sql
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your settings
```

5. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/:id` - Get specific transaction
- `GET /api/transactions/stats` - Get user statistics

## 📝 Postman Documentation

Import `postman_collection.json` for full API documentation.

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets (minimum 32 characters)
3. Enable SSL/TLS for database connections
4. Set up monitoring (e.g., PM2, New Relic)
5. Implement rate limiting (e.g., express-rate-limit)

## 📊 Database Schema

See `database/schema.sql` for complete schema definition.

## 🔐 Security Features

- Helmet.js for HTTP security headers
- bcrypt password hashing (10 salt rounds)
- JWT with short expiry (15 minutes)
- SQL injection prevention (parameterized queries)
- Input validation (express-validator)
- CORS configuration

## 🤝 Contributing

This is a learning project. Feedback welcome!

## 📄 License

MIT License