# SyncForge Frontend

> **Distributed Team Collaboration Platform - User Interface**

## 📋 Overview

The SyncForge Frontend is a modern React application built with Vite, providing a clean and intuitive interface for distributed teams to manage tasks, collaborate, and track project progress.

## 🚀 Tech Stack

- **React 18.2** - Modern React with hooks
- **Vite 5** - Lightning-fast development server and build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

## 📁 Project Structure

```
syncforge-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation bar
│   │   └── TaskCard.jsx             # Task card with edit/delete
│   ├── pages/
│   │   ├── TaskList.jsx             # Main task listing page
│   │   ├── CreateTask.jsx           # Task creation form
│   │   └── TaskStats.jsx            # Task statistics dashboard
│   ├── services/
│   │   ├── api.js                   # Axios instance
│   │   └── taskService.js           # Task API methods
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

## 🏁 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running on `http://localhost:4000`

### Installation

```bash
cd week-10/frontend/syncforge-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Application runs at: `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🎨 Features

### 1. Task Management
- **Task List View** - Browse all tasks with filtering
- **Create Tasks** - Add new tasks with detailed information
- **Edit Tasks** - Update task status and priority inline
- **Delete Tasks** - Remove tasks with confirmation

### 2. Advanced Filtering
- Filter by status (To Do, In Progress, In Review, Completed)
- Filter by priority (Low, Medium, High)
- Search by assignee email
- Real-time filter updates

### 3. Task Statistics
- Total task count
- Completion rate percentage
- Status distribution charts
- Priority breakdown
- Visual progress bars

### 4. User Experience
- **Loading States** - Spinners for async operations
- **Error Handling** - Graceful error messages with retry
- **Responsive Design** - Mobile-first, works on all devices
- **Empty States** - Helpful messages when no data
- **Confirmation Dialogs** - Prevent accidental deletions

## 📡 API Integration

The frontend communicates with the backend API via Axios:

### API Service Layer

**Base Configuration** (`api.js`):
```javascript
const API_BASE_URL = 'http://localhost:4000/api'
```

**Task Operations** (`taskService.js`):
- `getAllTasks(filters)` - GET /tasks with query params
- `getTaskById(id)` - GET /tasks/:id
- `createTask(data)` - POST /tasks
- `updateTask(id, updates)` - PUT /tasks/:id
- `deleteTask(id)` - DELETE /tasks/:id
- `getTaskStats()` - GET /tasks/stats

### Error Handling

The API service includes:
- Request interceptors
- Response error handling
- User-friendly error messages
- Automatic retry options

## 🎯 Pages

### Task List (`/`)
- Displays all tasks in a responsive grid
- Filter panel with status, priority, assignee filters
- Task cards with inline editing
- Loading and error states

### Create Task (`/create`)
- Form with validation
- All task fields (title, description, status, priority, assignee)
- Task guidelines panel
- Success notification and redirect

### Statistics (`/stats`)
- Overview cards (total, completed, in-progress, completion rate)
- Status distribution bar charts
- Priority breakdown visualization
- Refresh capability

## 🎨 Styling

### Tailwind CSS Configuration

Custom color palette:
```javascript
primary: {
  50-900: Blue color scale
}
```

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Component Patterns
- Cards with shadows and rounded corners
- Color-coded status badges
- Priority-based border colors
- Hover effects and transitions

## 🔄 State Management

Uses React hooks for local state:
- `useState` - Component state
- `useEffect` - Side effects (data fetching)
- `useNavigate` - Programmatic navigation

### Data Flow
1. User action triggers service call
2. Loading state activates
3. API request sent via Axios
4. Response updates component state
5. UI re-renders with new data

## 🧪 Development Guidelines

### Code Style
- Follow ESLint configuration
- Use functional components with hooks
- Destructure props
- Keep components small and focused

### File Naming
- Components: PascalCase (`TaskCard.jsx`)
- Services: camelCase (`taskService.js`)
- Pages: PascalCase (`TaskList.jsx`)

### Best Practices
- Extract reusable components
- Handle loading and error states
- Validate user input
- Provide user feedback
- Use semantic HTML

## 🚀 Performance

### Optimizations
- Vite for fast HMR (Hot Module Replacement)
- Code splitting with React Router
- Production build with tree-shaking
- Tailwind CSS purging unused styles

### Build Stats
```bash
npm run build

# Output:
dist/assets/index-[hash].js   ~150kb (gzipped)
dist/assets/index-[hash].css  ~10kb (gzipped)
```

## 🔧 Configuration Files

### Vite Config
- Port 3000
- Proxy API calls to backend (port 4000)
- React plugin

### Tailwind Config
- Custom color scheme
- Content paths for purging
- Extended theme

### ESLint Config
- React plugin
- React Hooks rules
- JSX runtime

## 📱 Responsive Design

Mobile-first approach:
- Single column on mobile
- 2 columns on tablet (md breakpoint)
- 2-3 columns on desktop (lg breakpoint)
- Hamburger menu (if needed)

## 🎨 Component Library

### Reusable Components

**TaskCard**
- Props: `task`, `onUpdate`, `onDelete`
- Features: Inline editing, color-coded priority, status badges

**Navbar**
- Responsive navigation
- Active route highlighting
- Brand logo and name

**StatBar** (in TaskStats)
- Props: `label`, `count`, `total`, `color`
- Visual progress bar with percentage

## 🔐 Security

- Environment variables for API URL
- No sensitive data in frontend
- Input validation before API calls
- Sanitized user inputs

## 📚 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `axios` - HTTP client

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - CSS framework
- `autoprefixer` - PostCSS plugin
- `eslint` - Linting

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### API Connection Failed
1. Ensure backend is running on port 4000
2. Check API_BASE_URL in `api.js`
3. Verify CORS settings on backend

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

Part of the Brave Redemptive software engineering fundamentals cohort.

---

**Built with ❤️ for distributed teams**
