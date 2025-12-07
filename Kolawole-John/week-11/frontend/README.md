# PayVerse Frontend

Modern React dashboard for the PayVerse distributed payments platform.

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool (10x faster than Webpack)
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS
- **Heroicons** - Beautiful icons
- **date-fns** - Date formatting

## 🏗️ Architecture Decisions

### Why React + Vite (not Next.js)?
- **Faster Development:** Vite's HMR is instant (no webpack rebuild delays)
- **Simpler Deployment:** Static files → deploy anywhere (Vercel, Netlify, Cloudflare)
- **No SSR Complexity:** This dashboard doesn't need server-side rendering

### Authentication Pattern
- **JWT with Refresh Tokens:** Stored in localStorage
- **Axios Interceptors:** Automatically adds tokens to requests
- **Token Refresh:** Seamlessly refreshes expired tokens
- **Protected Routes:** `<PrivateRoute>` wrapper for auth-only pages

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PayVerse backend running on `http://localhost:5000`

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Update VITE_API_URL if backend is on different port
```

3. **Start development server**
```bash
npm run dev
```

App runs on `http://localhost:5173`

## 🎨 Features

### Implemented Pages
- ✅ **Login** - Email/password authentication
- ✅ **Register** - User registration with validation
- ✅ **Dashboard** - Overview with statistics cards
- ✅ **Transactions** - Full transaction history + create new

### UI Components
- Reusable Button, Input, Card components
- Loading states and error handling
- Responsive design (mobile-friendly)
- Smooth animations and transitions

## 🚀 Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Output: `dist/` folder (deploy to any static host)

## 📁 Project Structure
```
src/
├── api/              # Backend communication
├── components/       # Reusable UI components
├── context/          # Global state (Auth)
├── hooks/            # Custom React hooks
├── pages/            # Route components
├── utils/            # Helper functions
└── App.jsx           # Main app with routing
```

## 🔐 Security Features

- Password validation (8+ chars, uppercase, lowercase, number)
- Email validation
- JWT token management
- Automatic token refresh
- Protected routes
- XSS protection (React escaping)

## 🎯 User Flow

1. User visits `/` → Redirected to `/dashboard` or `/login`
2. Not authenticated? → `/login` page
3. Login successful → Dashboard with stats + recent transactions
4. Navigate to `/transactions` → Full history + create new transaction
5. Token expires? → Automatically refreshed (no logout)

## 📱 Responsive Design

- Desktop: Full sidebar navigation
- Tablet: Collapsible navigation
- Mobile: Bottom navigation bar

## 🤝 Contributing

This is a learning project for PLP Academy's technical assessment.

## 📄 License

MIT License
```

---

## **Step 14: Final Files**

### **`.gitignore`**
```
