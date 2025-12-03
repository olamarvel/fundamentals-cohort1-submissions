# Week 9: LegacyBridge Integration Challenge

This repository contains the complete implementation of the LegacyBridge integration system, bridging legacy PHP systems with modern Node.js and React applications.

## 📁 Repository Structure

```
Week 9/
├── backend/          # Node.js integration service
└── frontend/         # React-Vite frontend application
```

## 🎯 Challenge Overview

**LegacyBridge** is a fintech company that has been operating for over a decade. The company's core payment system is built using an outdated monolithic architecture written in PHP, while the new team is developing microservices using Node.js and React.

This project implements a Node.js integration service that:
- Consumes data from a mock legacy API (JSONPlaceholder)
- Transforms legacy data into modern formats
- Exposes versioned RESTful endpoints
- Implements caching, retry logic, and error handling
- Provides a React frontend to display transformed data

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📦 Deliverables

### Backend (`legacybridge-backend`)

✅ **Node.js Integration Service**
- Express server with TypeScript
- Legacy API integration with retry logic
- Data transformation layer
- In-memory caching
- API versioning (v1, v2)
- Comprehensive error handling

✅ **Testing**
- Unit tests for services
- Integration tests for API endpoints
- Coverage reports

✅ **Documentation**
- Postman collection (`LegacyBridge-API.postman_collection.json`)
- README with API flow diagram
- Setup and deployment instructions

### Frontend (`legacybridge-frontend`)

✅ **React-Vite Application**
- TypeScript implementation
- Customer management interface
- Payment tracking with filtering
- Customer detail pages with payment history
- Loading, error, and success states

✅ **Documentation**
- README with setup instructions
- Deployment guide

## 🔗 API Endpoints

### V2 Endpoints

- `GET /api/v2/customers` - Get all customers
- `GET /api/v2/customers/:id` - Get customer by ID
- `GET /api/v2/payments` - Get all payments
- `GET /api/v2/payments?status=completed` - Filter payments by status
- `GET /api/v2/payments/:id` - Get payment by ID
- `GET /api/v2/customers/:customerId/payments` - Get customer payments

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📊 Architecture

### Integration Flow

```
Legacy API (JSONPlaceholder)
    ↓
LegacyBridge Backend (Express + TypeScript)
    ├── Cache Layer (in-memory)
    ├── Retry Logic (exponential backoff)
    ├── Transformation Service
    └── Versioned API Endpoints
        ↓
React Frontend (Vite + TypeScript)
    └── User Interface
```

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to:
- **Render**: Connect GitHub repo, auto-deploy
- **Railway**: Push to Railway for deployment
- **Heroku**: Use Node.js buildpack

### Frontend Deployment

The frontend can be deployed to:
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Push to Netlify
- **Render**: Deploy as static site

## 📝 Key Features

### Backend Features

- ✅ Legacy API integration with JSONPlaceholder
- ✅ Exponential backoff retry mechanism
- ✅ In-memory caching (5-minute TTL)
- ✅ API versioning middleware
- ✅ Data transformation (legacy → modern format)
- ✅ Comprehensive error handling
- ✅ TypeScript for type safety

### Frontend Features

- ✅ Customer listing with grid layout
- ✅ Payment tracking with status filtering
- ✅ Customer detail pages
- ✅ Payment history per customer
- ✅ Responsive design
- ✅ Loading and error states
- ✅ TypeScript for type safety

## 🔧 Technology Stack

### Backend
- Node.js 18+
- Express.js
- TypeScript
- Jest (testing)
- Axios (HTTP client)
- node-cache (caching)

### Frontend
- React 18
- Vite
- TypeScript
- React Router
- Axios

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend setup, API documentation, and architecture
- [Frontend README](./frontend/README.md) - Frontend setup and usage guide
- [Postman Collection](./backend/LegacyBridge-API.postman_collection.json) - API testing collection

## 🎓 Learning Objectives

This project demonstrates:

1. **Legacy System Integration**: How to integrate with existing legacy systems
2. **API Design**: Versioning, error handling, and RESTful principles
3. **Data Transformation**: Converting legacy data formats to modern structures
4. **Resilience**: Retry logic, caching, and error handling
5. **Modern Frontend**: React with TypeScript and proper state management
6. **Testing**: Unit and integration testing strategies

## 📄 License

MIT

## 👥 Contributors

LegacyBridge Team

---

**Note**: This is a learning project for Week 9 of the Software Engineering Fundamentals course. The legacy API is simulated using JSONPlaceholder for demonstration purposes.


