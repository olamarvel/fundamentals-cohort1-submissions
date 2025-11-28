# LegacyBridge Frontend

A modern React-Vite frontend application that displays and interacts with transformed legacy data through the LegacyBridge backend API.

## Features

- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Dashboard**: Overview of key metrics and system status
- **Payment Management**: View and filter payments with pagination
- **Customer Management**: Browse customers with search functionality
- **Analytics**: Visual insights and statistics from integrated data
- **Health Monitoring**: Real-time system health and performance metrics
- **Error Handling**: Graceful error states with retry functionality
- **Loading States**: Smooth loading indicators for better UX
- **TypeScript**: Full TypeScript implementation for type safety

## Pages

- **Dashboard** (`/`) - Overview with key metrics and quick navigation
- **Payments** (`/payments`) - Paginated payment list with status filtering
- **Customers** (`/customers`) - Customer directory with search functionality
- **Analytics** (`/analytics`) - Data insights and visualization
- **Health** (`/health`) - System status and performance monitoring

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api/v2)

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

## Architecture

The application follows React best practices:

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Hooks**: Custom hooks for API integration and state management
- **Services**: API service layer with axios
- **Types**: TypeScript interfaces for type safety

## API Integration

The frontend integrates with the LegacyBridge backend API:

- Automatic error handling and retry logic
- Loading states for all API calls
- Caching through custom hooks
- Real-time data updates

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any static hosting service. Build the application and deploy the `dist` folder.
