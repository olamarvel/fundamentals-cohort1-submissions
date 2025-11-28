# SyncForge Frontend

React frontend for the SyncForge distributed team collaboration platform.

## Overview

SyncForge Frontend is a modern React application built with Vite and TypeScript that provides an intuitive interface for distributed team collaboration. It features project management, team member tracking, and real-time collaboration tools.

## Features

- **Dashboard**: Overview of projects, team members, and key metrics
- **Project Management**: View, filter, and manage projects with detailed views
- **Team Management**: Browse team members by timezone and role
- **Responsive Design**: Mobile-first design that works across all devices
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Graceful error handling with retry mechanisms
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern features
- **Linting**: ESLint with React and TypeScript rules

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd syncforge-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run test` - Run tests

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API service layer
├── types/          # TypeScript type definitions
├── App.tsx         # Main app component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

## Pages & Features

### Dashboard (`/`)
- Project and team statistics
- Recent projects overview
- Team member summary
- Quick navigation to key sections

### Projects (`/projects`)
- List all projects with filtering
- Status-based filtering (active, completed, on-hold)
- Project cards with key information
- Navigation to detailed project views

### Project Detail (`/projects/:id`)
- Detailed project information
- Team member assignments
- Project timeline and status
- Breadcrumb navigation

### Team Members (`/team`)
- Team member directory
- Filter by role and active status
- Grouped by timezone for distributed team awareness
- Member contact information and roles

## API Integration

The frontend communicates with the SyncForge Backend API:

```typescript
// Environment configuration
VITE_API_URL=http://localhost:3001/api

// API services
- projectsApi.getAll()
- projectsApi.getById(id)
- teamsApi.getMembers()
- teamsApi.getMemberById(id)
```

## Collaboration Workflow

### Branching Strategy
We follow **Gitflow** branching model:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes

### Branch Naming Convention
- `feature/dashboard-improvements`
- `bugfix/mobile-responsive-fix`
- `hotfix/critical-ui-bug`

### Commit Message Format
```
type(scope): description

feat(dashboard): add project statistics cards
fix(mobile): resolve navigation menu overflow
docs(readme): update setup instructions
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes & Commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create PR against `develop` branch
   - Fill out PR template completely
   - Include screenshots for UI changes
   - Link related issues

4. **Code Review Requirements**
   - At least 1 approval required
   - All CI checks must pass
   - No merge conflicts
   - UI testing completed

### Code Review Philosophy

**What We Look For:**
- **Functionality**: Does the UI work as intended?
- **Accessibility**: Is the interface accessible to all users?
- **Performance**: Are there any performance bottlenecks?
- **Responsiveness**: Does it work on all screen sizes?
- **Code Quality**: Is the code maintainable and readable?
- **Type Safety**: Are TypeScript types properly defined?

**Review Guidelines:**
- Test UI changes on multiple devices
- Verify accessibility standards
- Check for console errors
- Validate API integration
- Ensure consistent design patterns

## Development Guidelines

### Component Structure
```typescript
interface ComponentProps {
  // Define props with TypeScript
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div className="component">
      {/* JSX content */}
    </div>
  );
};

export default Component;
```

### State Management
- Use React hooks for local state
- Lift state up when needed by multiple components
- Consider context for global state
- Keep state close to where it's used

### Styling Guidelines
- Use CSS classes with BEM-like naming
- Responsive design with mobile-first approach
- Consistent spacing and typography
- Accessible color contrast ratios

### Error Handling
- Implement loading states for async operations
- Show user-friendly error messages
- Provide retry mechanisms where appropriate
- Log errors for debugging

### Performance Best Practices
- Use React.memo for expensive components
- Implement proper key props for lists
- Optimize images and assets
- Lazy load components when beneficial

## Testing Strategy

### Component Testing
- Test component rendering
- Test user interactions
- Test prop handling
- Test error states

### Integration Testing
- Test API integration
- Test routing behavior
- Test form submissions
- Test error scenarios

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA attributes

## Deployment

### Environment Variables
```bash
VITE_API_URL=https://api.syncforge.com/api
```

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Build Optimization
- Code splitting with React.lazy
- Asset optimization with Vite
- Bundle analysis for size monitoring
- Progressive Web App features

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes following guidelines
4. Add tests for new functionality
5. Ensure responsive design
6. Test accessibility features
7. Submit a pull request

## Troubleshooting

### Common Issues

**Development server won't start:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for port conflicts

**API connection issues:**
- Verify VITE_API_URL in .env
- Ensure backend server is running
- Check CORS configuration

**Build failures:**
- Run TypeScript compiler check
- Fix ESLint errors
- Ensure all imports are correct

## License

This project is licensed under the MIT License.