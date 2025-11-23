# DeployHub Frontend

A modern React + Vite frontend application for managing and displaying deployment services, tracking system health, and visualizing metrics.

This app integrates with the DeployHub backend API and is deployed on **Render** using client-side routing (React Router).

---

## Features

- React + Vite setup
- Axios API integration
- Client-side Routing (React Router)
- Fetches services, health status, and Prometheus metrics
- Deployed on Render
- Environment-based API configuration

---

## Tech Stack

- **React** (Hooks, Components)
- **Vite**
- **TypeScript**
- **Axios**
- **React Router DOM**
- **TailwindCSS** (optional depending on your project)
- **Render deployment** (static hosting)

# Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=https://deployhub-backend-9aas.onrender.com/api
```

# Running the Project Locally

### Install dependencies

```
npm install
```

### Create `.env`

```
VITE_API_URL=http://localhost:8080/api
```

### Start development server

```
npm run dev
```

---

# Deployment (Render)

### IMPORTANT: SPA Rewrite Rule

If you use **React Router**, add the following rule in Render:

| Source | Destination   | Action  |
| ------ | ------------- | ------- |
| `/*`   | `/index.html` | Rewrite |

Without this, routes like `/overview` will return **404 Not Found**.

---

# API Endpoints Used

Frontend consumes these backend endpoints:

| Endpoint            | Purpose                                |
| ------------------- | -------------------------------------- |
| `GET /api/services` | Fetch all services                     |
| `GET /api/health`   | System health, uptime, metrics summary |
| `GET /metrics`      | Prometheus metrics endpoint            |

---

# Request Timer + Metrics Integration

Backend exposes:

- Total Requests
- Total Errors
- Histogram Response Times
- Formatted Average Response Time
- Application uptime
- Error rate

Frontend uses Axios to fetch these and display in the UI.

---

# Common Issues & Fixes

### **CORS error**

Make sure backend includes your Render domain:

```ts
cors({
  origin: [
    "http://localhost:5173",
    "https://deployhub-frontend.onrender.com",
    "https://deployhub-frontend-zsp3.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```
