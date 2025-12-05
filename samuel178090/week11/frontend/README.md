# PayVerse Frontend

This React + Vite frontend demonstrates the client-side implementation of PayVerse's trade-off choices (REST + JWT). It provides a minimal UI for authentication and transaction operations and is intended to be run against the backend POC.

## Trade-off Implementation

1. REST API integration using `axios` (simple HTTP requests)
2. JWT-based authentication with access + refresh token handling
3. React Context for authentication state and protected routes

## Features

- Login page with loading and error states
- Dashboard page listing transactions and a simple create-flow
- Protected routes (redirect to login if unauthenticated)
- Responsive layout and minimal accessibility improvements

## Quickstart

1. Install dependencies
```powershell
cd .\payverse-frontend
npm install
```

2. Configure API base URL (optional):

Edit `src/services/api.js` to point to your backend (default expected: `http://localhost:3001`). Alternatively, set an environment variable in a `.env` file at the project root:

```
VITE_API_BASE_URL=http://localhost:3001
```

3. Start the dev server
```powershell
npm run dev
```

Vite will print the local dev URL (commonly `http://localhost:5173`). Open that URL in your browser.

## Live Deployment

🌐 **Production URLs:**
- **Backend API**: https://payverse-backend.onrender.com
- **Frontend App**: https://payvers.netlify.app

## Demo Credentials

For testing and demonstration purposes:

- **Admin Account**: admin@payverse.com / password123
- **User Account**: user@payverse.com / password123

## Architecture notes

- `AuthContext.jsx` manages auth state and tokens
- `services/api.js` wraps `axios` and sets base URL + interceptors
- Pages: `Login.jsx`, `Dashboard.jsx` (protected)
- UI handles loading and error states explicitly (spinners, toast or inline messages)

## API Integration

This frontend expects the backend to expose REST endpoints on the configured base URL (see `VITE_API_BASE_URL`). Example endpoints used:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/transactions`
- `POST /api/transactions`

## Postman

Use the Postman collection included in the backend repository (`payverse-backend/PayVerse_API.postman_collection.json`) to inspect expected request/response shapes.

## Troubleshooting

- If authentication fails, check that the backend is running and `VITE_API_BASE_URL` is correct.
- If CORS issues appear, ensure the backend allows requests from the frontend origin (or use a proxy in development).

## Next improvements (optional)

- Add logout and refresh token rotation UI flows
- Add form validation and better error messaging
- Add end-to-end tests (Cypress)