# PayVerse Frontend# React + Vite



## 🎯 Project OverviewThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



PayVerse Frontend is a modern React-based web application for the PayVerse distributed payments platform. Built with React + Vite and Tailwind CSS, it provides an intuitive interface for managing payments and transfers.Currently, two official plugins are available:



## 🚀 Technology Stack- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Framework**: React 19

- **Build Tool**: Vite## React Compiler

- **Routing**: React Router DOM v6

- **HTTP Client**: AxiosThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Styling**: Tailwind CSS

- **State Management**: React Context API## Expanding the ESLint configuration



## 🏗️ ArchitectureIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


```
payverse-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with user info
│   │   └── PrivateRoute.jsx    # Route protection component
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx           # User login page
│   │   ├── Register.jsx        # User registration page
│   │   ├── Dashboard.jsx       # Main dashboard with balance & quick actions
│   │   └── Transactions.jsx    # Transaction history page
│   ├── services/
│   │   ├── api.js              # Axios instance with interceptors
│   │   └── index.js            # API service functions
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles
│   ├── index.css               # Tailwind imports
│   └── main.jsx                # Application entry point
├── .env.example                # Environment variables template
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## ✨ Features

### Authentication
- **User Registration** with role selection (Personal/Merchant)
- **User Login** with JWT token storage
- **Protected Routes** requiring authentication
- **Auto-logout** on token expiration

### Dashboard
- **Balance Display** with real-time updates
- **Quick Actions**:
  - 💵 Deposit funds
  - 📤 Transfer money
- **Recent Transactions** with status indicators
- **Transaction Details**:
  - Type icons (Sent/Received/Deposit)
  - Amount with color coding (green/red)
  - Status badges
  - Timestamps

### Transaction Management
- **Transfer Funds** to other users by email
- **Deposit Money** into account
- **Transaction History** with:
  - Filtering by status and type
  - Pagination support
  - Detailed transaction view
  - Sender/receiver information

### User Experience
- **Loading States** for all async operations
- **Error Handling** with user-friendly messages
- **Success Notifications** for completed actions
- **Responsive Design** for all screen sizes
- **Modal Dialogs** for actions

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PayVerse Backend running on `http://localhost:5000`

### Installation

1. **Navigate to the frontend directory**
```bash
cd week-11/frontend/payverse-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

5. **Build for production** (optional)
```bash
npm run build
npm run preview
```

## 📱 Pages

### 1. Login Page (`/login`)
- Email and password authentication
- Demo account credentials displayed
- Link to registration page
- Error handling for invalid credentials

### 2. Registration Page (`/register`)
- User details collection:
  - First Name
  - Last Name
  - Email
  - Password
  - Account Type (Personal/Merchant)
- Validation for all fields
- Auto-login after successful registration

### 3. Dashboard (`/dashboard`) - Protected
- Account balance display
- Quick action buttons:
  - Deposit funds modal
  - Transfer money modal
- Recent transactions list (last 10)
- Real-time balance updates after transactions

### 4. Transactions Page (`/transactions`) - Protected
- Complete transaction history table
- Filters:
  - Status (All, Completed, Pending, Failed)
  - Type (All, Transfer, Payment, Deposit)
- Detailed information:
  - Transaction type icons
  - Sender/Receiver details
  - Description
  - Date and time
  - Status badges
  - Amount with color coding

## 🔐 Authentication Flow

1. **Login/Register** → Receive JWT token
2. **Store Token** → localStorage (`token` and `user`)
3. **API Requests** → Axios interceptor adds `Authorization: Bearer {token}`
4. **Token Expiration** → Auto-redirect to login
5. **Logout** → Clear localStorage and redirect

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Blue and Purple gradients
- **Typography**: System fonts for optimal performance
- **Spacing**: Consistent Tailwind spacing scale
- **Components**: Reusable, accessible components

### User Feedback
- **Loading Spinners** during API calls
- **Success Messages** (auto-dismiss after 3s)
- **Error Messages** with actionable information
- **Validation Errors** inline with forms

### Responsive Design
- **Mobile-first** approach
- **Breakpoints**: sm, md, lg, xl
- **Touch-friendly** buttons and inputs
- **Optimized layouts** for all devices

## 🔌 API Integration

### Services Layer
All API calls are centralized in `src/services/`:

```javascript
// Authentication
authService.register(userData)
authService.login(credentials)
authService.logout()
authService.getProfile()

// Transactions
transactionService.createTransaction(data)
transactionService.deposit(amount)
transactionService.getTransactionHistory(params)
transactionService.getTransactionById(id)
```

### Axios Configuration
- **Base URL**: Configured via environment variable
- **Request Interceptor**: Adds JWT token to headers
- **Response Interceptor**: Handles 401 errors globally
- **Error Handling**: Consistent error response format

## 🧪 Testing the Application

### Manual Testing Flow

1. **Register a new account**:
   - Go to `/register`
   - Fill in details
   - Create account

2. **Test deposit**:
   - Click "Deposit" button
   - Enter amount (e.g., $500)
   - Submit and verify balance update

3. **Test transfer**:
   - Click "Transfer" button
   - Enter recipient email (use demo account: bob@payverse.com)
   - Enter amount and description
   - Submit and verify transaction appears in history

4. **View transaction history**:
   - Navigate to `/transactions`
   - Test filters
   - Verify all details display correctly

### Demo Accounts (if backend is seeded)
```
Email: alice@payverse.com | Password: password123 | Balance: $1000
Email: bob@payverse.com | Password: password123 | Balance: $500
Email: merchant@payverse.com | Password: password123 | Balance: $5000
```

## 🎯 Key Implementation Details

### Context API for State Management
- **AuthContext**: Manages user authentication state
- **Providers**: Wrap application in `AuthProvider`
- **Hooks**: Custom `useAuth()` hook for accessing auth state

### Protected Routes
```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```
- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state during check

### Form Handling
- Controlled components
- Real-time validation
- Error state management
- Loading states during submission

### Transaction Display Logic
- **Color coding**: Green for credits, Red for debits
- **Icons**: Different icons for transaction types
- **Relative display**: "To" or "From" based on current user

## 🛠️ Development Tools

- **Vite**: Fast development server with HMR
- **ESLint**: Code linting
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

## 📦 Build & Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Build output: `dist/` directory

## 🎓 Learning Outcomes

This project demonstrates:
- Modern React development with hooks
- Context API for state management
- Protected route implementation
- REST API integration
- Form handling and validation
- Responsive design with Tailwind CSS
- User authentication flows
- Error handling and loading states

## 🔗 Related Projects

- **Backend Repository**: `week-11/backend/payverse-backend`
- **API Documentation**: Postman collection in backend

## 📄 License

This project is part of a software engineering assessment.

## 👤 Author

PayVerse Frontend Team
