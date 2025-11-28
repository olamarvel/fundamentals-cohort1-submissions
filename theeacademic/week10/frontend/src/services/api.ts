import axios from 'axios';
import { Project, TeamMember, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectsApi = {
  getAll: async (status?: string): Promise<ApiResponse<Project[]>> => {
    const params = status ? { status } : {};
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Project>> => {
    const response = await api.post('/projects', project);
    return response.data;
  },

  update: async (id: string, project: Partial<Project>): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },
};

export const teamsApi = {
  getMembers: async (role?: string, isActive?: boolean): Promise<ApiResponse<TeamMember[]>> => {
    const params: Record<string, string> = {};
    if (role) params.role = role;
    if (isActive !== undefined) params.isActive = isActive.toString();
    
    const response = await api.get('/teams/members', { params });
    return response.data;
  },

  getMemberById: async (id: string): Promise<ApiResponse<TeamMember>> => {
    const response = await api.get(`/teams/members/${id}`);
    return response.data;
  },

  getTimezones: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/teams/timezones');
    return response.data;
  },
};

export default api;