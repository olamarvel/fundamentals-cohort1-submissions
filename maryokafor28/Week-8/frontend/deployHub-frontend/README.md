DeployHub Frontend
This is the React-Vite frontend for the DeployHub project. It connects to the DeployHub backend API for health checks, metrics, and other application features.
Tech Stack

React + Vite

TypeScript

Deployed on Vercel

Environment Variables
Create a .env file in the project root:
VITE_API_BASE_URL=https://deployhub-backend-s6p2.onrender.com

For local development:
VITE_API_BASE_URL=http://localhost:4000

🏃 Running the App
Install dependencies:
npm install

Start the development server:
npm run dev

Build for production:
npm run build

Preview production build:
npm run preview

Deployment
The frontend is deployed on Vercel:
https://deployhub-frontend-psi.vercel.app
