import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { mockProjects } from '../data/mockData';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

const router = Router();

// Validation middleware
const validateProject = [
  body('name').isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('description').isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('teamMembers').optional().isArray().withMessage('Team members must be an array')
];

const validateProjectId = [
  param('id').isLength({ min: 1 }).withMessage('Project ID is required')
];

// GET /api/projects - Get all projects
router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  
  let filteredProjects = mockProjects;
  
  if (status && typeof status === 'string') {
    filteredProjects = mockProjects.filter(project => project.status === status);
  }
  
  res.json({
    success: true,
    data: filteredProjects,
    count: filteredProjects.length
  });
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', validateProjectId, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const project = mockProjects.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({ 
      success: false, 
      error: 'Project not found' 
    });
  }
  
  res.json({
    success: true,
    data: project
  });
});

// POST /api/projects - Create new project
router.post('/', validateProject, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, description, teamMembers = [] }: CreateProjectRequest = req.body;
  
  const newProject: Project = {
    id: (mockProjects.length + 1).toString(),
    name,
    description,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teamMembers
  };
  
  mockProjects.push(newProject);
  
  res.status(201).json({
    success: true,
    data: newProject,
    message: 'Project created successfully'
  });
});

// PUT /api/projects/:id - Update project
router.put('/:id', [...validateProjectId, ...validateProject], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Project not found' 
    });
  }
  
  const updateData: UpdateProjectRequest = req.body;
  const updatedProject = {
    ...mockProjects[projectIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  mockProjects[projectIndex] = updatedProject;
  
  res.json({
    success: true,
    data: updatedProject,
    message: 'Project updated successfully'
  });
});

export { router as projectRoutes };