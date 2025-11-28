# SyncForge Backend API

A Node.js Express API for distributed team collaboration and project management.

## Project Overview

SyncForge Backend provides RESTful APIs for managing projects and team members in a distributed work environment. Built with TypeScript, Express, and following enterprise-grade practices for remote team collaboration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Linting**: ESLint with TypeScript rules
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Projects
- `GET /api/projects` - Get all projects (supports status filtering)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project

### Teams
- `GET /api/teams/members` - Get all team members (supports role/status filtering)
- `GET /api/teams/members/:id` - Get team member by ID
- `GET /api/teams/timezones` - Get unique timezones

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   ```

3. **Development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Development Workflow

### Branching Strategy
We follow **Gitflow** branching model:
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical production fixes

### Branch Naming Convention
- `feature/add-user-authentication`
- `bugfix/fix-validation-error`
- `hotfix/security-patch`

### Commit Message Format
```
type: brief description

Detailed explanation if needed

Closes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Review Process

### Before Creating PR
1. Ensure all tests pass locally
2. Run linting and fix issues
3. Update documentation if needed
4. Test API endpoints manually

### PR Requirements
- Clear title and description
- Link to related issues
- Include API examples/screenshots
- All CI checks must pass
- At least one approval required

### Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] Proper error handling implemented
- [ ] Input validation in place
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Tests cover new functionality

## Code Quality Standards

### TypeScript Guidelines
- Use strict type checking
- Prefer interfaces over types for object shapes
- Use explicit return types for functions
- Avoid `any` type usage

### API Design Principles
- RESTful endpoint design
- Consistent response format
- Proper HTTP status codes
- Input validation on all endpoints
- Comprehensive error messages

### Security Practices
- Input sanitization and validation
- CORS configuration
- Helmet for security headers
- Environment variable usage for secrets

## Testing Strategy

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Collaboration Guidelines

### Remote Team Practices
1. **Async Communication**: Use PR descriptions and comments for context
2. **Time Zone Awareness**: Include timezone in meeting requests
3. **Documentation First**: Update docs before code review
4. **Clear Commit Messages**: Help distributed team understand changes

### Issue Management
- Use GitHub Issues for all tasks
- Include acceptance criteria
- Label appropriately (bug, feature, enhancement)
- Assign to project board columns

### Code Review Philosophy
- **Constructive Feedback**: Focus on code improvement
- **Knowledge Sharing**: Explain reasoning behind suggestions
- **Timely Reviews**: Respond within 24 hours
- **Respectful Communication**: Consider cultural differences

## Environment Variables

```bash
PORT=3001
NODE_ENV=development
API_VERSION=v1
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm test` - Run Jest tests

## Contributing

1. Create feature branch from `develop`
2. Make changes following code standards
3. Add/update tests as needed
4. Update documentation
5. Create PR with proper template
6. Address review feedback
7. Merge after approval

## License

MIT License - see LICENSE file for details
