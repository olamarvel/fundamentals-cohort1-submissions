import { Project, TeamMember } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'SyncForge Platform',
    description: 'Main collaboration platform for distributed teams',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    teamMembers: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'React Native mobile application for team communication',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    teamMembers: ['2', '4']
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    status: 'on-hold',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-12T13:15:00Z',
    teamMembers: ['1', '3', '5']
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@syncforge.com',
    role: 'developer',
    timezone: 'UTC-8',
    isActive: true
  },
  {
    id: '2',
    name: 'Bob Chen',
    email: 'bob@syncforge.com',
    role: 'developer',
    timezone: 'UTC+8',
    isActive: true
  },
  {
    id: '3',
    name: 'Carol Martinez',
    email: 'carol@syncforge.com',
    role: 'designer',
    timezone: 'UTC-5',
    isActive: true
  },
  {
    id: '4',
    name: 'David Kumar',
    email: 'david@syncforge.com',
    role: 'qa',
    timezone: 'UTC+5:30',
    isActive: true
  },
  {
    id: '5',
    name: 'Eva Petrov',
    email: 'eva@syncforge.com',
    role: 'manager',
    timezone: 'UTC+2',
    isActive: false
  }
];