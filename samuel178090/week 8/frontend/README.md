# DeployHub - Enterprise CI/CD Platform

**Built by Samuel Joseph Ajewole**

## 🚀 Live Application

- **Frontend**: https://deployhubweb.netlify.app/
- **Backend API**: https://deployhub-platformbackend.onrender.com/

## 📋 Test Credentials

Use these credentials to explore the platform:

| Role | Username | Password | Access Level |
|------|----------|----------|-------------|
| **Admin** | `admin` | `admin123` | Full platform access |
| **User** | `user` | `user123` | Limited user access |
| **Developer** | `developer` | `dev123` | Development features |

## 🎯 Project Overview

DeployHub is a comprehensive CI/CD platform inspired by AWS CodePipeline, featuring enterprise-grade observability, multi-stage deployments, and real-time monitoring capabilities.

## 📁 Architecture

```
DeployHub Platform/
├── deployhub-backend/     # Node.js Express API
├── deployhub-frontend/    # React Dashboard
└── Documentation/         # Technical specs
```

## 🔧 Local Development

### Backend Setup:
```bash
cd deployhub-backend
npm install
npm run dev    # http://localhost:5001
```

### Frontend Setup:
```bash
cd deployhub-frontend
npm install
npm run dev    # http://localhost:3000
```

## ✨ Key Features

### 🔐 Authentication & Security
- Role-based access control (Admin, User, Developer)
- Secure session management
- JWT-style authentication
- User registration system

### 📡 Backend Infrastructure
- RESTful API with Express.js
- Structured logging with Winston
- Prometheus metrics collection
- Health monitoring endpoints
- Docker containerization

### 🖥️ Frontend Dashboard
- Modern React-based interface
- AWS CodePipeline-inspired design
- Real-time deployment monitoring
- Responsive admin panel
- Interactive pipeline management

## 🚀 **AWS CodePipeline-Inspired Features**
- ✅ **Multi-Stage Deployment** (Staging → Production)
- ✅ **Manual Approval Gates** with GitHub Environments
- ✅ **Security Scanning** (npm audit + secret detection)
- ✅ **Parallel Execution** (Matrix builds + concurrent jobs)
- ✅ **Health Check Verification** (Post-deployment validation)
- ✅ **Automated Rollback** (Failure recovery mechanisms)
- ✅ **Deployment Notifications** (Slack integration)
- ✅ **Artifact Management** (Build artifacts with retention)
- ✅ **Branch-Based Workflows** (Feature/develop/main)
- ✅ **Comprehensive Testing** (Unit + Integration + Security)

## 🔗 API Endpoints

### Production URLs:
- **Frontend Dashboard**: https://deployhubweb.netlify.app/
- **Backend API**: https://deployhub-platformbackend.onrender.com/

### Key API Routes:
- **Authentication**: `/auth/login`, `/auth/register`
- **Health Monitoring**: `/health`, `/health/metrics`
- **Deployments**: `/api/deployments`
- **Documentation**: `/api/docs/sections`
- **System Status**: `/api/status`

## 🎯 **Pipeline Architecture**

### **Backend Pipeline:**
```
Code Quality → Security Scan → Unit Tests → Integration Tests
       ↓
   Build App → Build Docker → Deploy Staging → Manual Approval
       ↓
Deploy Production → Health Check → Rollback (if needed) → Notify Team
```

### **Frontend Pipeline:**
```
Code Quality → Security Scan → Build & Test (Multi-version)
       ↓
Deploy Staging → Manual Approval → Deploy Production
       ↓
Health Check → Rollback (if needed) → Notify Team
```

## 📈 **Enterprise Features**

### **Observability Stack:**
- **Structured Logging** (Winston with JSON format)
- **Metrics Collection** (Prometheus with custom metrics)
- **Deployment Tracking** (Version, build, deployer info)
- **Health Monitoring** (Multi-endpoint validation)
- **Real-time Dashboard** (React-based monitoring UI)

### **Security & Quality:**
- **Vulnerability Scanning** (npm audit)
- **Secret Detection** (TruffleHog)
- **Code Quality** (ESLint)
- **Multi-version Testing** (Node 18 & 20)
- **Integration Testing** (API endpoint validation)

### **Deployment & Recovery:**
- **Multi-environment** (Staging + Production)
- **Approval Gates** (Manual review required)
- **Health Verification** (Post-deployment checks)
- **Automatic Rollback** (On failure detection)
- **Team Notifications** (Slack integration)

## 🔧 **Setup Instructions**

### **1. Configure GitHub Secrets:**
```
RENDER_DEPLOY_HOOK=your_render_webhook
VERCEL_DEPLOY_HOOK=your_vercel_webhook
SLACK_WEBHOOK=your_slack_webhook
PROD_URL=your_production_url
```

### **2. Configure GitHub Environments:**
- Create `staging`, `production-approval`, `production` environments
- Add required reviewers for production approval

### **3. Enable Branch Protection:**
- Protect `main` branch with required status checks
- Require pull request reviews

## 📚 **Documentation**
See [AWS-CODEPIPELINE-FEATURES.md](./AWS-CODEPIPELINE-FEATURES.md) for detailed feature comparison and implementation guide.

## 💼 Technical Implementation

### Core Technologies:
- **Backend**: Node.js, Express.js, Winston, Prometheus
- **Frontend**: React, Vite, Modern CSS
- **Deployment**: Render (Backend), Netlify (Frontend)
- **CI/CD**: GitHub Actions, Automated Testing
- **Monitoring**: Health checks, Metrics collection

### Enterprise Standards:
- ✅ **Scalable Architecture** - Microservices-ready design
- ✅ **Production Deployment** - Live on cloud platforms
- ✅ **Security Best Practices** - CORS, Helmet, Rate limiting
- ✅ **Observability** - Structured logging and metrics
- ✅ **User Experience** - Intuitive dashboard interface

---

**Built with ❤️ by Samuel Joseph Ajewole**

*This project demonstrates enterprise-level CI/CD platform development with modern web technologies and cloud deployment practices.*
