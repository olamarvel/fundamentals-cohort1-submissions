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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  errors?: Array<{ msg: string; param: string }>;
}