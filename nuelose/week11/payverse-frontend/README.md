# PayVerse Frontend – African Payments App

**PayVerse Distributed Payments Platform** is a rapidly scaling fintech company that processes high‑volume transactions across multiple regions in Africa.

**Backend Repository:** [payverse-backend](https://github.com/yourusername/payverse-backend)

## Key Features

- Clean login & registration with real-time feedback
- Send money instantly with dropdown (NGN, GHS, KES)
- Real-time summary cards (Total Sent, Received, Count)
- Secure authentication using **HttpOnly cookies** (no localStorage)
- Built with React 18 + Vite + TypeScript + Tailwind CSS

## Project Structure

```
src/
├── components/     → Reusable UI components
├── lib/            → Axios instance (api.ts)
├── pages/          → LoginPage.tsx, DashboardPage.tsx
├── types/          → Shared TypeScript interfaces
├── App.tsx         → Routing + auth logic
└── main.tsx        → Entry point
```

## Quick Start

1.  Clone and install

```bash
git clone https://github.com/nuelose/payverse-frontend.git
cd payverse-frontend
npm install
```

2. Make sure backend is running
   `http://localhost:3000 (see payverse-backend repo)`

3. Start frontend

```bash
npm run dev
Open: http://localhost:5173
```
