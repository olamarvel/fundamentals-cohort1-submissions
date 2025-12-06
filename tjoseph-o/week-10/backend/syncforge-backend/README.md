# SyncForge Backend

> **Distributed Team Collaboration Platform API**  
> Demonstrating professional code review practices, Git workflows, and remote team collaboration

## 📋 Project Overview

SyncForge Backend is a task management API built to demonstrate best practices for distributed software engineering teams, including:

- **Clean Git Workflows** (Gitflow branching strategy)
- **Code Review Processes** (PR templates, review checklists)
- **Automated CI/CD** (GitHub Actions for linting and testing)
- **Team Collaboration** (GitHub Projects, Issues, and structured communication)

## 🏗️ Architecture

```
syncforge-backend/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                    # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── controllers/
│   │   └── taskController.js          # Business logic
│   ├── middleware/
│   │   └── errorHandler.js            # Error handling
│   ├── models/
│   │   └── taskStore.js               # In-memory data store
│   ├── routes/
│   │   └── taskRoutes.js              # API routes
│   ├── validators/
│   │   └── taskValidator.js           # Input validation (Joi)
│   └── server.js                       # Application entry point
├── tests/
│   └── task.test.js                    # Unit tests
├── .eslintrc.js                        # ESLint configuration
├── .prettierrc.js                      # Prettier configuration
├── jest.config.js                      # Jest configuration
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
cd week-10/backend/syncforge-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

Server runs at: `http://localhost:4000`

### Available Scripts

```bash
npm run dev       # Start development server with nodemon
npm start         # Start production server
npm test          # Run tests with Jest
npm run lint      # Run ESLint
npm run lint:fix  # Fix linting issues
npm run format    # Format code with Prettier
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Query Parameters (GET /api/tasks)
- `status` - Filter by status (todo, in-progress, in-review, completed)
- `priority` - Filter by priority (low, medium, high)
- `assignee` - Filter by assignee email

## 🧪 API Testing with Postman

Import `SyncForge_API.postman_collection.json` for complete API documentation.

### Example Requests

**Create Task:**
```json
POST /api/tasks
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication",
  "status": "todo",
  "priority": "high",
  "assignee": "dev@syncforge.com"
}
```

**Update Task:**
```json
PUT /api/tasks/:id
{
  "status": "in-progress",
  "priority": "high"
}
```

## 🔄 Git Workflow & Branching Strategy

### Gitflow Branching Model

We follow **Gitflow** for structured development:

```
main (production-ready code)
  └── develop (integration branch)
       ├── feature/task-filtering
       ├── feature/task-statistics
       └── bugfix/validation-error
```

### Branch Naming Conventions

- `feature/*` - New features (e.g., `feature/task-filtering`)
- `bugfix/*` - Bug fixes (e.g., `bugfix/validation-error`)
- `hotfix/*` - Production hotfixes (e.g., `hotfix/critical-bug`)
- `release/*` - Release preparation (e.g., `release/v1.0.0`)

### Workflow Steps

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/task-filtering
   ```

2. **Develop & Commit**
   ```bash
   git add .
   git commit -m "feat: add task filtering by status and priority"
   ```

3. **Push & Create PR**
   ```bash
   git push origin feature/task-filtering
   # Create PR on GitHub: feature/task-filtering → develop
   ```

4. **Code Review & Merge**
   - Request reviews from team members
   - Address feedback
   - Merge after approval

5. **Release to Main**
   ```bash
   git checkout main
   git merge develop
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin main --tags
   ```

## 📝 Pull Request Process

### PR Template

Our PRs follow a structured template:
- Description of changes
- Related issue links
- Type of change (feature, bug fix, etc.)
- Testing details
- Screenshots/API samples
- Review checklist

### PR Review Checklist

Reviewers check for:
- [ ] Code follows style guidelines (ESLint passes)
- [ ] Self-review completed by author
- [ ] Code is well-commented
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No new warnings or errors

### Review Philosophy

**Code reviews are collaborative, not confrontational:**
- Be respectful and constructive
- Ask questions, don't make demands
- Explain reasoning behind suggestions
- Approve promptly when ready
- Suggest improvements, don't block unnecessarily

## 🤝 Collaboration Practices

### GitHub Issues

We use issues for all work items:

1. **Clear Titles**: `[FEATURE] Add task filtering by status`
2. **Acceptance Criteria**: Specific, testable requirements
3. **Labels**: Categorize (bug, enhancement, documentation)
4. **Assignment**: Assign to team members
5. **Milestones**: Group related issues

### GitHub Projects (Kanban Board)

Columns:
- **Backlog** - Future work
- **To Do** - Ready to start
- **In Progress** - Active development
- **In Review** - PR opened
- **Done** - Merged and deployed

### Commit Message Conventions

We follow **Conventional Commits**:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Build/tooling changes

**Examples:**
```bash
feat(tasks): add filtering by status and priority
fix(validation): correct email validation regex
docs(readme): update API documentation
test(tasks): add unit tests for task controller
```

## ⚙️ Continuous Integration (CI/CD)

### GitHub Actions Workflow

Our CI pipeline runs on every push and PR:

1. **Checkout code**
2. **Setup Node.js** (matrix: v18, v20)
3. **Install dependencies**
4. **Run linting** (`npm run lint`)
5. **Run tests** (`npm test`)
6. **Upload coverage**

### Status Checks

PRs cannot be merged until:
- ✅ ESLint passes
- ✅ All tests pass
- ✅ Coverage threshold met
- ✅ At least 1 approval

## 🔒 Code Quality Tools

### ESLint
- Extends Airbnb base style
- Custom rules for Node.js
- Auto-fix on save (IDE integration)

### Prettier
- Consistent code formatting
- Runs automatically in CI
- Integrates with ESLint

### Jest
- Unit and integration tests
- Coverage reporting
- Watch mode for development

## 📊 Testing

Run tests:
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

### Test Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🌍 Distributed Team Best Practices

### Asynchronous Communication
- Document decisions in issues/PRs
- Use threaded discussions
- Provide context for reviewers
- Record demo videos for complex features

### Time Zone Considerations
- Schedule overlapping hours for sync meetings
- Use async tools (GitHub Discussions, Slack)
- Document everything for async review
- Respect working hours

### Knowledge Sharing
- Document architectural decisions (ADRs)
- Maintain updated README
- Share learnings in team wiki
- Conduct async code walkthroughs

## 📚 Documentation Standards

All code should be:
- **Self-documenting**: Clear variable/function names
- **Commented**: Complex logic explained
- **Tested**: Unit tests as documentation
- **API-documented**: Postman collections

## 🎯 Code Review Examples

### Example 1: Feature PR
```markdown
## Description
Add task filtering by status and priority

## Related Issue
Closes #23

## Changes
- Added query parameter handling in task controller
- Updated taskStore to support filtering
- Added validation for filter parameters

## Testing
- Unit tests for filter logic
- Manual testing with Postman

## Screenshots
[Postman screenshot showing filtered results]
```

### Example 2: Review Comment
```markdown
**Suggestion**: Consider extracting this filtering logic into a separate utility function for reusability.

**Reasoning**: This logic might be useful in other parts of the application (e.g., search functionality).

**Proposed Change**:
```js
// utils/taskFilters.js
function applyTaskFilters(tasks, filters) {
  // filtering logic here
}
```
```

## 🏆 Success Metrics

We measure collaboration success by:
- **PR Merge Time**: < 24 hours
- **Review Turnaround**: < 4 hours
- **Test Coverage**: > 80%
- **Build Success Rate**: > 95%
- **Issue Resolution Time**: < 3 days

## 📄 License

This project is part of a software engineering assessment.

## 👥 Team

SyncForge Engineering Team - Demonstrating distributed collaboration excellence

---

**🌟 Remember**: Good collaboration is about clear communication, mutual respect, and continuous improvement!
