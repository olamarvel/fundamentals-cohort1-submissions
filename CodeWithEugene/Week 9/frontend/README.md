# LegacyBridge Frontend

A modern React-Vite frontend application that displays transformed data from the LegacyBridge integration service. This application provides a clean, user-friendly interface for viewing customers and payments data that has been transformed from legacy systems.

## 🚀 Features

- **Modern UI**: Clean, responsive design with loading, error, and success states
- **Customer Management**: View all customers with transformed data from legacy system
- **Payment Tracking**: View and filter payments by status (completed, pending, failed)
- **Customer Details**: Detailed view of individual customers with payment history
- **TypeScript**: Fully typed codebase for better developer experience
- **React Router**: Client-side routing for seamless navigation

## 📋 Prerequisites

- Node.js >= 18.17.0
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legacybridge-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:3000
   ```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📱 Pages

### Customers Page (`/customers`)
- Displays all customers in a grid layout
- Shows customer name, email, phone, company, and address
- Status badges for active/inactive customers
- Link to view detailed customer information

### Payments Page (`/payments`)
- Displays all payments in a table format
- Filter payments by status (all, completed, pending, failed)
- Shows payment amount, customer, status, date, and description
- Links to customer details and payment details

### Customer Detail Page (`/customers/:id`)
- Detailed view of a single customer
- Shows all customer information
- Displays payment history for the customer
- Navigation back to customers list

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── CustomersPage.tsx      # Customers listing page
│   │   ├── PaymentsPage.tsx       # Payments listing page
│   │   └── CustomerDetailPage.tsx # Customer detail page
│   ├── services/
│   │   └── api.ts                 # API service layer
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Application styles
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 UI States

### Loading State
Displays a loading message while fetching data from the API.

### Error State
Shows an error message with a retry button when API calls fail.

### Success State
Displays the requested data in a clean, organized format.

## 🔌 API Integration

The frontend communicates with the backend API through the `apiService`:

```typescript
import { apiService } from './services/api';

// Get all customers
const customers = await apiService.getCustomers();

// Get customer by ID
const customer = await apiService.getCustomerById(1);

// Get payments (optionally filtered by status)
const payments = await apiService.getPayments('completed');

// Get customer payments
const customerPayments = await apiService.getCustomerPayments(1);
```

## 🚢 Deployment

### Environment Variables

For production, set the API base URL:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### Deployment Platforms

- **Vercel**: Connect your GitHub repository and deploy
- **Netlify**: Push to Netlify for automatic deployment
- **Render**: Deploy as a static site

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory, ready to be deployed to any static hosting service.

## 🎯 Features in Detail

### Status Badges
- **Active/Inactive**: For customer status
- **Completed/Pending/Failed**: For payment status
- Color-coded for quick visual identification

### Filtering
- Filter payments by status on the payments page
- Real-time filtering without page reload

### Responsive Design
- Mobile-friendly layout
- Adapts to different screen sizes
- Touch-friendly buttons and links

## 🔗 Backend Integration

This frontend requires the LegacyBridge backend to be running. Make sure:

1. Backend is running on the configured port (default: 3000)
2. CORS is properly configured in the backend
3. API endpoints are accessible

## 📝 License

MIT

## 👥 Contributors

LegacyBridge Team


