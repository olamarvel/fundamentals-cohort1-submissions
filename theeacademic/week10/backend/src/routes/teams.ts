import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { mockTeamMembers } from '../data/mockData';

const router = Router();

const validateMemberId = [
  param('id').isLength({ min: 1 }).withMessage('Member ID is required')
];

// GET /api/teams/members - Get all team members
router.get('/members', (req: Request, res: Response) => {
  const { role, isActive } = req.query;
  
  let filteredMembers = mockTeamMembers;
  
  if (role && typeof role === 'string') {
    filteredMembers = filteredMembers.filter(member => member.role === role);
  }
  
  if (isActive !== undefined) {
    const activeFilter = isActive === 'true';
    filteredMembers = filteredMembers.filter(member => member.isActive === activeFilter);
  }
  
  res.json({
    success: true,
    data: filteredMembers,
    count: filteredMembers.length
  });
});

// GET /api/teams/members/:id - Get team member by ID
router.get('/members/:id', validateMemberId, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const member = mockTeamMembers.find(m => m.id === req.params.id);
  
  if (!member) {
    return res.status(404).json({ 
      success: false, 
      error: 'Team member not found' 
    });
  }
  
  res.json({
    success: true,
    data: member
  });
});

// GET /api/teams/timezones - Get unique timezones
router.get('/timezones', (req: Request, res: Response) => {
  const timezones = [...new Set(mockTeamMembers.map(member => member.timezone))];
  
  res.json({
    success: true,
    data: timezones,
    count: timezones.length
  });
});

export { router as teamRoutes };