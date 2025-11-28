export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  updatedAt: string;
  teamMembers: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'designer' | 'manager' | 'qa';
  timezone: string;
  isActive: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  teamMembers?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'on-hold';
  teamMembers?: string[];
}