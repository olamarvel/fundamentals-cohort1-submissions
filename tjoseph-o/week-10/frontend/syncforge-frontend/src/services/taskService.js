import api from './api';

export const taskService = {
  // Get all tasks with optional filters
  getAllTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.assignee) queryParams.append('assignee', filters.assignee);

    const response = await api.get(`/tasks?${queryParams.toString()}`);
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, updates) => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};
