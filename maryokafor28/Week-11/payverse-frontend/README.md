# PayVerse Frontend

A modern web interface for the PayVerse distributed payments platform built with Next.js, React, and WebSockets.

## Technical Decisions

- **Next.js** - For server-side rendering, file-based routing, and optimized performance
- **React Hooks** - Custom hooks (useUsers, useTransactions, useWebSocket) for clean state management
- **WebSocket Integration** - Real-time transaction updates without page refresh
- **TypeScript** - Type safety for API responses and component props

  **Full Trade-off Analysis:** https://docs.google.com/document/d/1WD4lgkRT2HhAQyxUZfD08WUeRF3LMQCx3gR40IiGOU4/edit?usp=sharing

---

## Quick Start

### Prerequisites

- Node.js 18+
- Running PayVerse backend

### Setup

1. **Install dependencies**

```bash
npm install
```

2. **Environment variables** (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

3. **Start development server**

```bash
npm run dev
```

4. **Open browser**

```
http://localhost:3000
```

---

## Pages

### Home (`/`)

- Landing page with navigation links
- Overview of technical features

### Users (`/users`)

- View all users from **SQL database**
- Create new users
- Shows data from PostgreSQL with **Redis caching**

### Transactions (`/transactions`)

- Select user and view their transactions
- Create new transactions
- **Real-time updates** via WebSocket
- Live connection status indicator

---

## Features

✅ **SQL Integration** - Fetches data from PostgreSQL backend  
✅ **WebSocket Real-time** - Live transaction updates  
✅ **Redis Caching** - Backend caches API responses  
✅ **Loading States** - User-friendly loading indicators  
✅ **Error Handling** - Graceful error messages  
✅ **Type Safety** - Full TypeScript support

---

## Tech Stack

Next.js 14 • React 18 • TypeScript • Tailwind CSS • WebSockets

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── users/page.tsx        # Users page
│   └── transactions/page.tsx # Transactions page
├── hooks/
│   ├── useUsers.ts           # User data hook
│   ├── useTransactions.ts    # Transaction data hook
│   └── useWebSocket.ts       # WebSocket connection hook
├── lib/
│   └── api.ts                # API client
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## 🧪 Testing the App

1. **Start backend** (must be running on port 4000)
2. **Create a user** on `/users` page
3. **Create transactions** on `/transactions` page
4. **Watch real-time updates** when WebSocket is connected (green indicator)

---

## Styling

Uses **Tailwind CSS** for utility-first styling. All components are self-contained with inline styles.
